import { Deck, ITable, IPlayer, GameStage, PlayerStatus, HandEvaluator } from 'poker-shared';
import { v4 as uuidv4 } from 'uuid';

export class GameManager {
  private tables: Map<string, ITable> = new Map();
  private decks: Map<string, Deck> = new Map();

  constructor() {
    // Create a default table for testing
    this.createTable('Default Table');
  }

  createTable(name: string): string {
    const id = uuidv4();
    const table: ITable = {
      id,
      players: [],
      communityCards: [],
      pots: [{ amount: 0, eligiblePlayers: [] }],
      currentTurn: '',
      dealerIndex: 0,
      smallBlind: 10,
      bigBlind: 20,
      stage: GameStage.PreFlop,
      minRaise: 40, // Minimum raise is 2x big blind initially
      lastRaise: 0,
    };
    this.tables.set(id, table);
    this.decks.set(id, new Deck());
    console.log(`Table created: ${name} (${id})`);
    return id;
  }

  getTable(id: string): ITable | undefined {
    return this.tables.get(id);
  }

  getAllTables(): { id: string; playerCount: number }[] {
    return Array.from(this.tables.values()).map((t) => ({
      id: t.id,
      playerCount: t.players.length,
    }));
  }

  addPlayer(tableId: string, name: string, socketId: string): IPlayer | null {
    const table = this.tables.get(tableId);
    if (!table) return null;

    if (table.players.length >= 9) return null; // Max 9 players

    const player: IPlayer = {
      id: socketId,
      name,
      chips: 1000, // Default buy-in
      holeCards: [],
      status: PlayerStatus.Active,
      currentBet: 0,
      hasActed: false,
      position: table.players.length,
    };

    table.players.push(player);
    return player;
  }

  removePlayer(socketId: string): void {
    for (const table of this.tables.values()) {
      const player = table.players.find((p) => p.id === socketId);
      if (player) {
        // If player is in active game, fold them instead of removing
        if (table.stage !== GameStage.PreFlop || player.holeCards.length > 0) {
          console.log(`Player ${player.name} disconnected mid-game, auto-folding`);
          player.status = PlayerStatus.Folded;
          
          // If it was their turn, move to next player
          if (table.currentTurn === socketId) {
            this.nextTurn(table);
          }
        } else {
          // Not in active game, safe to remove
          const index = table.players.findIndex((p) => p.id === socketId);
          if (index !== -1) {
            table.players.splice(index, 1);
            console.log(`Player removed from table`);
          }
        }
        break;
      }
    }
  }

  startGame(tableId: string): void {
    const table = this.tables.get(tableId);
    const deck = this.decks.get(tableId);
    if (!table || !deck) return;

    if (table.players.length < 2) {
      console.log('Not enough players to start');
      return;
    }

    // Reset table state
    table.communityCards = [];
    table.pots = [{ amount: 0, eligiblePlayers: table.players.map((p) => p.id) }];
    table.stage = GameStage.PreFlop;
    deck.reset();

    // Deal hole cards
    for (const player of table.players) {
      player.holeCards = [deck.deal()!, deck.deal()!];
      player.status = PlayerStatus.Active;
      player.currentBet = 0;
      player.hasActed = false;
    }

    // Move dealer button
    table.dealerIndex = (table.dealerIndex + 1) % table.players.length;

    // Post blinds
    this.postBlinds(table);

    // Set current turn (UTG - Under The Gun, player after Big Blind)
    // Dealer -> SB -> BB -> UTG
    let currentTurnIndex = (table.dealerIndex + 3) % table.players.length;
    // If only 2 players (Heads-up): Dealer is SB, other is BB.
    // Dealer acts first pre-flop in Heads-up?
    // Standard rules:
    // > 2 players: SB = Dealer+1, BB = Dealer+2. UTG = Dealer+3.
    // 2 players: Dealer = SB, Other = BB. Dealer acts first pre-flop.
    
    if (table.players.length === 2) {
      // Heads-up
      // Dealer is SB
      // Other is BB
      // Dealer acts first
      currentTurnIndex = table.dealerIndex;
    }

    table.currentTurn = table.players[currentTurnIndex].id;
    
    console.log(`Game started at table ${tableId}`);
  }

  private postBlinds(table: ITable): void {
    const sbIndex = (table.dealerIndex + 1) % table.players.length;
    const bbIndex = (table.dealerIndex + 2) % table.players.length;

    // Heads-up exception: Dealer is SB
    const realSbIndex = table.players.length === 2 ? table.dealerIndex : sbIndex;
    const realBbIndex = table.players.length === 2 ? (table.dealerIndex + 1) % table.players.length : bbIndex;

    this.placeBet(table, table.players[realSbIndex], table.smallBlind);
    this.placeBet(table, table.players[realBbIndex], table.bigBlind);
    
    table.lastRaise = table.bigBlind;
  }

  private placeBet(table: ITable, player: IPlayer, amount: number): void {
    const actualAmount = Math.min(player.chips, amount);
    player.chips -= actualAmount;
    player.currentBet += actualAmount;
    
    // Add to pot (will be properly split into side pots at end of round)
    table.pots[0].amount += actualAmount;
    
    if (player.chips === 0) {
      player.status = PlayerStatus.AllIn;
      // Trigger side pot calculation
      this.calculateSidePots(table);
    }
  }

  private calculateSidePots(table: ITable): void {
    // Get all players with bets
    const playersWithBets = table.players
      .filter(p => p.currentBet > 0)
      .sort((a, b) => a.currentBet - b.currentBet);

    if (playersWithBets.length === 0) return;

    // Reset pots
    const newPots: { amount: number; eligiblePlayers: string[] }[] = [];
    let remainingPlayers = [...playersWithBets];
    let previousBetLevel = 0;

    // Create pots for each bet level
    for (let i = 0; i < playersWithBets.length; i++) {
      const currentPlayer = playersWithBets[i];
      const betLevel = currentPlayer.currentBet;

      if (betLevel > previousBetLevel && remainingPlayers.length > 0) {
        const potAmount = (betLevel - previousBetLevel) * remainingPlayers.length;
        newPots.push({
          amount: potAmount,
          eligiblePlayers: remainingPlayers
            .filter(p => p.status !== PlayerStatus.Folded)
            .map(p => p.id)
        });
        previousBetLevel = betLevel;
      }

      // Remove this player from remaining (they can't win more)
      remainingPlayers = remainingPlayers.filter(p => p.id !== currentPlayer.id);
    }

    // Only update if we have side pots
    if (newPots.length > 0) {
      table.pots = newPots;
    }
  }

  handleAction(tableId: string, action: { playerId: string; type: string; amount?: number }): void {
    const table = this.tables.get(tableId);
    if (!table) return;

    if (table.currentTurn !== action.playerId) {
      console.log('Not player turn');
      return;
    }

    const player = table.players.find((p) => p.id === action.playerId);
    if (!player) return;

    const maxBet = Math.max(...table.players.map(p => p.currentBet));
    const callAmount = maxBet - player.currentBet;
    
    switch (action.type) {
      case 'fold':
        player.status = PlayerStatus.Folded;
        break;
        
      case 'check':
        // Check only valid if no bet to call
        if (callAmount > 0) {
          console.log('Cannot check, must call or fold');
          return;
        }
        break;
        
      case 'call':
        // Validate call amount
        if (callAmount <= 0) {
          console.log('Nothing to call');
          return;
        }
        this.placeBet(table, player, callAmount);
        break;
        
      case 'raise':
        if (!action.amount) {
          console.log('Raise amount required');
          return;
        }
        
        const totalBet = action.amount; // Total bet amount
        const additionalAmount = totalBet - player.currentBet;
        
        // Validate raise meets minimum
        if (totalBet < table.minRaise) {
          console.log(`Raise must be at least ${table.minRaise}`);
          return;
        }
        
        // Validate player has enough chips
        if (additionalAmount > player.chips) {
          console.log('Not enough chips');
          return;
        }
        
        this.placeBet(table, player, additionalAmount);
        table.lastRaise = totalBet;
        // Update minimum raise (previous raise + raise increment)
        const raiseIncrement = totalBet - maxBet;
        table.minRaise = totalBet + raiseIncrement;
        
        // Reset hasActed for all other active players (they need to respond to raise)
        table.players.forEach(p => {
          if (p.id !== player.id && p.status === PlayerStatus.Active) {
            p.hasActed = false;
          }
        });
        break;
        
      default:
        console.log('Unknown action type:', action.type);
        return;
    }

    player.hasActed = true;

    // Check if round is complete
    if (this.isRoundComplete(table)) {
      this.nextStage(table);
    } else {
      this.nextTurn(table);
    }
  }

  private isRoundComplete(table: ITable): boolean {
    const activePlayers = table.players.filter((p) => p.status === PlayerStatus.Active || p.status === PlayerStatus.AllIn);
    // Everyone must have acted (unless all-in) and matched the highest bet
    // Simplified: check if all active players have acted and bets match
    // Note: Big Blind pre-flop has option to raise even if bets match.
    // For MVP, we'll just check if everyone acted and bets are equal.
    
    const maxBet = Math.max(...table.players.map(p => p.currentBet));
    
    return activePlayers.every((p) => {
      if (p.status === PlayerStatus.AllIn) return true;
      return p.hasActed && p.currentBet === maxBet;
    });
  }

  private nextTurn(table: ITable): void {
    let currentIndex = table.players.findIndex((p) => p.id === table.currentTurn);
    let nextIndex = (currentIndex + 1) % table.players.length;
    
    // Find next active player
    let loopCount = 0;
    while (table.players[nextIndex].status !== PlayerStatus.Active && loopCount < table.players.length) {
      nextIndex = (nextIndex + 1) % table.players.length;
      loopCount++;
    }
    
    if (loopCount === table.players.length) {
      // Should not happen if round is not complete
      return;
    }

    table.currentTurn = table.players[nextIndex].id;
  }

  private nextStage(table: ITable): void {
    // Reset player actions
    table.players.forEach(p => {
      p.hasActed = false;
      p.currentBet = 0;
    });
    table.lastRaise = 0; // Reset for next round

    const deck = this.decks.get(table.id)!;

    switch (table.stage) {
      case GameStage.PreFlop:
        table.stage = GameStage.Flop;
        // Burn 1, Deal 3
        deck.deal();
        table.communityCards.push(deck.deal()!, deck.deal()!, deck.deal()!);
        break;
      case GameStage.Flop:
        table.stage = GameStage.Turn;
        // Burn 1, Deal 1
        deck.deal();
        table.communityCards.push(deck.deal()!);
        break;
      case GameStage.Turn:
        table.stage = GameStage.River;
        // Burn 1, Deal 1
        deck.deal();
        table.communityCards.push(deck.deal()!);
        break;
      case GameStage.River:
        table.stage = GameStage.Showdown;
        // Determine winner(s) and distribute chips
        this.handleShowdown(table);
        return; // Don't set next turn, game is over
    }

    // Set turn to first active player after dealer
    let nextIndex = (table.dealerIndex + 1) % table.players.length;
    while (table.players[nextIndex].status !== PlayerStatus.Active) {
      nextIndex = (nextIndex + 1) % table.players.length;
    }
    table.currentTurn = table.players[nextIndex].id;
  }

  private handleShowdown(table: ITable): void {
    // Get all players still in the hand (not folded)
    const activePlayers = table.players.filter(
      p => p.status === PlayerStatus.Active || p.status === PlayerStatus.AllIn
    );

    if (activePlayers.length === 0) {
      console.log('No active players in showdown');
      return;
    }

    // If only one player left, they win everything
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      const totalPot = table.pots.reduce((sum, pot) => sum + pot.amount, 0);
      winner.chips += totalPot;
      console.log(`${winner.name} wins ${totalPot} chips (everyone else folded)`);
      return;
    }

    // Evaluate all hands
    const playerHands = activePlayers.map(player => ({
      player,
      hand: HandEvaluator.evaluate(player.holeCards, table.communityCards)
    }));

    // Sort by hand value (descending)
    playerHands.sort((a, b) => b.hand.value - a.hand.value);

    // Distribute each pot to eligible winners
    for (const pot of table.pots) {
      // Find eligible players for this pot
      const eligibleHands = playerHands.filter(ph => 
        pot.eligiblePlayers.includes(ph.player.id)
      );

      if (eligibleHands.length === 0) continue;

      // Find best hand value among eligible players
      const bestValue = eligibleHands[0].hand.value;
      
      // Find all winners (could be multiple if tie)
      const winners = eligibleHands.filter(ph => ph.hand.value === bestValue);
      
      // Split pot among winners
      const amountPerWinner = Math.floor(pot.amount / winners.length);
      const remainder = pot.amount % winners.length;

      winners.forEach((winner, index) => {
        let winAmount = amountPerWinner;
        // Give remainder to first winner (arbitrary but fair)
        if (index === 0) winAmount += remainder;
        
        winner.player.chips += winAmount;
        console.log(`${winner.player.name} wins ${winAmount} chips with ${this.getHandName(winner.hand.rank)}`);
      });
    }
  }

  private getHandName(rank: number): string {
    const names = [
      'High Card',
      'One Pair', 
      'Two Pair',
      'Three of a Kind',
      'Straight',
      'Flush',
      'Full House',
      'Four of a Kind',
      'Straight Flush',
      'Royal Flush'
    ];
    return names[rank] || 'Unknown';
  }
}

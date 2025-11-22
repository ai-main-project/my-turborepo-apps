import { Deck, ITable, IPlayer, GameStage, PlayerStatus } from 'poker-shared';
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
      minRaise: 20,
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
      const index = table.players.findIndex((p) => p.id === socketId);
      if (index !== -1) {
        table.players.splice(index, 1);
        // TODO: Handle player leaving mid-game (fold hand, etc.)
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
    table.pots[0].amount += actualAmount;
    
    if (player.chips === 0) {
      player.status = PlayerStatus.AllIn;
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

    // TODO: Validate action logic (e.g. can check? is raise valid?)
    
    switch (action.type) {
      case 'fold':
        player.status = PlayerStatus.Folded;
        break;
      case 'check':
        // Check is only valid if currentBet == lastRaise (or 0 if no bets)
        break;
      case 'call':
        const callAmount = table.lastRaise - player.currentBet;
        this.placeBet(table, player, callAmount);
        break;
      case 'raise':
        if (!action.amount) return;
        const raiseAmount = action.amount; // Total bet amount
        // Diff to add
        const diff = raiseAmount - player.currentBet;
        this.placeBet(table, player, diff);
        table.lastRaise = raiseAmount;
        table.minRaise = raiseAmount * 2; // Simplified min-raise logic
        break;
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
        // Determine winner
        // TODO: Implement showdown logic using HandEvaluator
        break;
    }

    // Set turn to first active player after dealer
    let nextIndex = (table.dealerIndex + 1) % table.players.length;
    while (table.players[nextIndex].status !== PlayerStatus.Active) {
      nextIndex = (nextIndex + 1) % table.players.length;
    }
    table.currentTurn = table.players[nextIndex].id;
  }
}

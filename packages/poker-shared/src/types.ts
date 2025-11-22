import { Card } from './Card';

export enum PlayerStatus {
  Active = 'active',
  Folded = 'folded',
  AllIn = 'all_in',
  SittingOut = 'sitting_out',
}

export enum GameStage {
  PreFlop = 'pre_flop',
  Flop = 'flop',
  Turn = 'turn',
  River = 'river',
  Showdown = 'showdown',
}

export interface IPlayer {
  id: string;
  name: string;
  chips: number;
  holeCards: Card[]; // 2 cards
  status: PlayerStatus;
  currentBet: number; // Amount bet in the current round
  hasActed: boolean; // True if player has acted in the current round
  position: number; // Seat position
}

export interface IPot {
  amount: number;
  eligiblePlayers: string[]; // Player IDs
}

export interface ITable {
  id: string;
  players: IPlayer[];
  communityCards: Card[];
  pots: IPot[]; // Main pot and side pots
  currentTurn: string; // Player ID
  dealerIndex: number;
  smallBlind: number;
  bigBlind: number;
  stage: GameStage;
  minRaise: number;
  lastRaise: number; // Amount of the last raise (for min-raise calculation)
}

export enum ActionType {
  Check = 'check',
  Call = 'call',
  Raise = 'raise',
  Fold = 'fold',
  AllIn = 'all_in',
}

export interface IGameAction {
  playerId: string;
  type: ActionType;
  amount?: number; // Required for Raise
}

import { Card } from './Card';
export declare enum PlayerStatus {
    Active = "active",
    Folded = "folded",
    AllIn = "all_in",
    SittingOut = "sitting_out"
}
export declare enum GameStage {
    PreFlop = "pre_flop",
    Flop = "flop",
    Turn = "turn",
    River = "river",
    Showdown = "showdown"
}
export interface IPlayer {
    id: string;
    name: string;
    chips: number;
    holeCards: Card[];
    status: PlayerStatus;
    currentBet: number;
    hasActed: boolean;
    position: number;
}
export interface IPot {
    amount: number;
    eligiblePlayers: string[];
}
export interface ITable {
    id: string;
    players: IPlayer[];
    communityCards: Card[];
    pots: IPot[];
    currentTurn: string;
    dealerIndex: number;
    smallBlind: number;
    bigBlind: number;
    stage: GameStage;
    minRaise: number;
    lastRaise: number;
}
export declare enum ActionType {
    Check = "check",
    Call = "call",
    Raise = "raise",
    Fold = "fold",
    AllIn = "all_in"
}
export interface IGameAction {
    playerId: string;
    type: ActionType;
    amount?: number;
}

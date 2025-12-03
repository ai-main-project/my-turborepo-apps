import { Card } from './Card';
export declare enum HandRank {
    HighCard = 0,
    OnePair = 1,
    TwoPair = 2,
    ThreeOfAKind = 3,
    Straight = 4,
    Flush = 5,
    FullHouse = 6,
    FourOfAKind = 7,
    StraightFlush = 8,
    RoyalFlush = 9
}
export interface HandResult {
    rank: HandRank;
    value: number;
    cards: Card[];
}
export declare class HandEvaluator {
    static evaluate(holeCards: Card[], communityCards: Card[]): HandResult;
    private static getCombinations;
    private static evaluateFiveCardHand;
    private static checkStraight;
    private static reorderCards;
}

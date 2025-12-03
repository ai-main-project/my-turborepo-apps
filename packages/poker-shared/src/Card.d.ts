export declare enum Suit {
    Hearts = "\u2665",
    Diamonds = "\u2666",
    Clubs = "\u2663",
    Spades = "\u2660"
}
export declare enum Rank {
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8",
    Nine = "9",
    Ten = "T",
    Jack = "J",
    Queen = "Q",
    King = "K",
    Ace = "A"
}
export interface ICard {
    suit: Suit;
    rank: Rank;
}
export declare class Card implements ICard {
    suit: Suit;
    rank: Rank;
    constructor(suit: Suit, rank: Rank);
    toString(): string;
    get value(): number;
}

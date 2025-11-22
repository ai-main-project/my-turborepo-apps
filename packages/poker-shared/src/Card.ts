export enum Suit {
  Hearts = '♥',
  Diamonds = '♦',
  Clubs = '♣',
  Spades = '♠',
}

export enum Rank {
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = 'T',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  Ace = 'A',
}

export interface ICard {
  suit: Suit;
  rank: Rank;
}

export class Card implements ICard {
  constructor(public suit: Suit, public rank: Rank) {}

  toString(): string {
    return `${this.rank}${this.suit}`;
  }

  get value(): number {
    const values: Record<Rank, number> = {
      [Rank.Two]: 2,
      [Rank.Three]: 3,
      [Rank.Four]: 4,
      [Rank.Five]: 5,
      [Rank.Six]: 6,
      [Rank.Seven]: 7,
      [Rank.Eight]: 8,
      [Rank.Nine]: 9,
      [Rank.Ten]: 10,
      [Rank.Jack]: 11,
      [Rank.Queen]: 12,
      [Rank.King]: 13,
      [Rank.Ace]: 14,
    };
    return values[this.rank];
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.Rank = exports.Suit = void 0;
var Suit;
(function (Suit) {
    Suit["Hearts"] = "\u2665";
    Suit["Diamonds"] = "\u2666";
    Suit["Clubs"] = "\u2663";
    Suit["Spades"] = "\u2660";
})(Suit || (exports.Suit = Suit = {}));
var Rank;
(function (Rank) {
    Rank["Two"] = "2";
    Rank["Three"] = "3";
    Rank["Four"] = "4";
    Rank["Five"] = "5";
    Rank["Six"] = "6";
    Rank["Seven"] = "7";
    Rank["Eight"] = "8";
    Rank["Nine"] = "9";
    Rank["Ten"] = "T";
    Rank["Jack"] = "J";
    Rank["Queen"] = "Q";
    Rank["King"] = "K";
    Rank["Ace"] = "A";
})(Rank || (exports.Rank = Rank = {}));
class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
    toString() {
        return `${this.rank}${this.suit}`;
    }
    get value() {
        const values = {
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
exports.Card = Card;

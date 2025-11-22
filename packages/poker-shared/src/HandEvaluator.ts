import { Card, Rank, Suit } from './Card';

export enum HandRank {
  HighCard = 0,
  OnePair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  Straight = 4,
  Flush = 5,
  FullHouse = 6,
  FourOfAKind = 7,
  StraightFlush = 8,
  RoyalFlush = 9,
}

export interface HandResult {
  rank: HandRank;
  value: number; // Numeric value for comparison (tie-breaking)
  cards: Card[]; // The 5 cards that make up the hand
}

export class HandEvaluator {
  static evaluate(holeCards: Card[], communityCards: Card[]): HandResult {
    const allCards = [...holeCards, ...communityCards];
    if (allCards.length < 5) {
      throw new Error('Need at least 5 cards to evaluate');
    }

    // Generate all 5-card combinations
    const combinations = this.getCombinations(allCards, 5);
    let bestHand: HandResult | null = null;

    for (const combo of combinations) {
      const result = this.evaluateFiveCardHand(combo);
      if (!bestHand || result.value > bestHand.value) {
        bestHand = result;
      }
    }

    return bestHand!;
  }

  private static getCombinations(cards: Card[], k: number): Card[][] {
    if (k === 0) return [[]];
    if (cards.length === k) return [cards];
    if (cards.length < k) return [];

    const [first, ...rest] = cards;
    const withFirst = this.getCombinations(rest, k - 1).map((c) => [first, ...c]);
    const withoutFirst = this.getCombinations(rest, k);

    return [...withFirst, ...withoutFirst];
  }

  private static evaluateFiveCardHand(cards: Card[]): HandResult {
    // Sort cards by rank (descending)
    const sorted = [...cards].sort((a, b) => b.value - a.value);
    
    const isFlush = sorted.every((c) => c.suit === sorted[0].suit);
    const isStraight = this.checkStraight(sorted);
    
    const rankCounts = new Map<Rank, number>();
    for (const card of sorted) {
      rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
    }
    
    const counts = Array.from(rankCounts.values()).sort((a, b) => b - a);
    
    let rank = HandRank.HighCard;
    
    if (isFlush && isStraight) {
      rank = sorted[0].rank === Rank.Ace && sorted[1].rank === Rank.King ? HandRank.RoyalFlush : HandRank.StraightFlush;
    } else if (counts[0] === 4) {
      rank = HandRank.FourOfAKind;
    } else if (counts[0] === 3 && counts[1] === 2) {
      rank = HandRank.FullHouse;
    } else if (isFlush) {
      rank = HandRank.Flush;
    } else if (isStraight) {
      rank = HandRank.Straight;
    } else if (counts[0] === 3) {
      rank = HandRank.ThreeOfAKind;
    } else if (counts[0] === 2 && counts[1] === 2) {
      rank = HandRank.TwoPair;
    } else if (counts[0] === 2) {
      rank = HandRank.OnePair;
    }

    // Calculate value for tie-breaking
    // This is a simplified value calculation. For a real app, we need more precise tie-breaking.
    // Base value = rank * 1,000,000
    // Add card values weighted by position
    let value = rank * 1000000;
    
    // Adjust sorting for Full House, Four of a Kind, etc. to put relevant cards first
    // e.g. for Full House, the triplet should be first
    // This logic can be expanded. For now, we use the sorted by rank.
    
    // Better tie-breaking:
    // Hex value: R V1 V2 V3 V4 V5 (R=Rank, V=Card Values)
    // But for this MVP, we'll stick to a simple sum or similar if not critical.
    // Actually, let's do a bit better:
    // Value = Rank * 10^10 + C1*10^8 + C2*10^6 + C3*10^4 + C4*10^2 + C5
    // We need to re-sort `sorted` based on the hand type (e.g. quads first)
    
    const reordered = this.reorderCards(sorted, rankCounts);
    
    reordered.forEach((card, index) => {
      value += card.value * Math.pow(15, 4 - index);
    });

    return { rank, value, cards: reordered };
  }

  private static checkStraight(sortedCards: Card[]): boolean {
    // Handle Ace low straight (A, 5, 4, 3, 2)
    // sortedCards is already sorted descending
    // Check normal straight
    let isStraight = true;
    for (let i = 0; i < 4; i++) {
      if (sortedCards[i].value - sortedCards[i + 1].value !== 1) {
        isStraight = false;
        break;
      }
    }
    if (isStraight) return true;

    // Check Ace low
    if (sortedCards[0].rank === Rank.Ace && 
        sortedCards[1].rank === Rank.Five &&
        sortedCards[2].rank === Rank.Four &&
        sortedCards[3].rank === Rank.Three &&
        sortedCards[4].rank === Rank.Two) {
      return true;
    }
    
    return false;
  }

  private static reorderCards(cards: Card[], counts: Map<Rank, number>): Card[] {
    // Sort by count (descending), then by value (descending)
    return [...cards].sort((a, b) => {
      const countA = counts.get(a.rank) || 0;
      const countB = counts.get(b.rank) || 0;
      if (countA !== countB) return countB - countA;
      return b.value - a.value;
    });
  }
}

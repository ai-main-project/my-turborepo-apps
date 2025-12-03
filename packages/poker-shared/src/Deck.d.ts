import { Card } from './Card';
export declare class Deck {
    private cards;
    constructor();
    reset(): void;
    shuffle(): void;
    deal(): Card | undefined;
    get remaining(): number;
}

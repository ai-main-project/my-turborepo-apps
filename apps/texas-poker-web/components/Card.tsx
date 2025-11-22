import { ICard, Suit } from 'poker-shared';
import clsx from 'clsx';

interface CardProps {
    card: ICard;
    hidden?: boolean;
}

export const Card = ({ card, hidden }: CardProps) => {
    if (hidden) {
        return (
            <div className="w-16 h-24 bg-blue-800 rounded-lg border-2 border-white shadow-md flex items-center justify-center">
                <div className="w-12 h-20 bg-blue-600 rounded border border-blue-400 pattern-grid" />
            </div>
        );
    }

    const isRed = card.suit === Suit.Hearts || card.suit === Suit.Diamonds;

    return (
        <div className="w-16 h-24 bg-white rounded-lg border border-slate-300 shadow-md flex flex-col items-center justify-center relative select-none">
            <span className={clsx('text-2xl font-bold', isRed ? 'text-red-600' : 'text-slate-900')}>
                {card.rank}
            </span>
            <span className={clsx('text-3xl', isRed ? 'text-red-600' : 'text-slate-900')}>
                {card.suit}
            </span>
        </div>
    );
};

import { IPlayer, PlayerStatus } from 'poker-shared';
import { Card } from './Card';
import clsx from 'clsx';

interface PlayerProps {
    player: IPlayer;
    isCurrentTurn: boolean;
    isMe: boolean;
    isDealer: boolean;
}

export const Player = ({ player, isCurrentTurn, isMe, isDealer }: PlayerProps) => {
    return (
        <div className={clsx(
            'flex flex-col items-center p-2 rounded-xl transition-all',
            isCurrentTurn ? 'bg-yellow-500/20 ring-2 ring-yellow-500' : 'bg-slate-800/50',
            player.status === PlayerStatus.Folded && 'opacity-50'
        )}>
            <div className="relative mb-2">
                <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-xl font-bold border-2 border-slate-400">
                    {player.name[0].toUpperCase()}
                </div>
                {player.status === PlayerStatus.AllIn && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-1 rounded font-bold">ALL IN</span>
                )}
                {isDealer && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white text-slate-900 rounded-full flex items-center justify-center text-xs font-bold border border-slate-300">D</div>
                )}
            </div>

            <div className="text-center mb-1">
                <p className="font-bold text-sm truncate max-w-[100px]">{player.name}</p>
                <p className="text-yellow-400 text-sm font-mono">${player.chips}</p>
            </div>

            <div className="flex space-x-1">
                {player.holeCards && player.holeCards.length > 0 ? (
                    player.holeCards.map((card, i) => (
                        <Card key={i} card={card} />
                    ))
                ) : (
                    // Show backs if active and not me (or if me but no cards yet)
                    // Actually server sends holeCards only to owner or at showdown.
                    // If holeCards is empty but status is Active, show backs.
                    player.status !== PlayerStatus.Folded && player.status !== PlayerStatus.SittingOut && (
                        <>
                            <Card card={{ suit: '?', rank: '?' } as any} hidden />
                            <Card card={{ suit: '?', rank: '?' } as any} hidden />
                        </>
                    )
                )}
            </div>

            {player.currentBet > 0 && (
                <div className="mt-2 bg-slate-900/80 px-2 py-1 rounded text-xs text-yellow-400">
                    Bet: ${player.currentBet}
                </div>
            )}
        </div>
    );
};

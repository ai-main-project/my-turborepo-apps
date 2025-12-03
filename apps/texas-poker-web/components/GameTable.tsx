import { ITable, IPlayer, ActionType } from 'poker-shared';
import { Card } from './Card';
import { Player } from './Player';
import { useGameStore } from '@/store/gameStore';
import { useTranslations } from 'next-intl';

interface GameTableProps {
    table: ITable;
    currentPlayer: IPlayer | null;
}

export const GameTable = ({ table, currentPlayer }: GameTableProps) => {
    const t = useTranslations('Game');
    const { performAction, startGame } = useGameStore();

    const isMyTurn = table.currentTurn === currentPlayer?.id;
    const maxBet = Math.max(...table.players.map(p => p.currentBet));
    const callAmount = maxBet - (currentPlayer?.currentBet || 0);
    const minRaise = table.minRaise;

    const handleAction = (type: ActionType, amount?: number) => {
        performAction(table.id, { type, amount });
    };

    // Calculate positions for 9 players circle
    // For MVP, just a grid or flex layout

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-800 flex justify-between items-center">
                <h1 className="text-xl font-bold">Table {table.id.slice(0, 4)}</h1>
                <div className="text-yellow-400 font-mono">
                    Pot: ${table.pots.reduce((a, b) => a + b.amount, 0)}
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 relative flex items-center justify-center bg-green-900/20 m-4 rounded-3xl border-4 border-slate-700">

                {/* Community Cards */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-2">
                    {table.communityCards.map((card, i) => (
                        <Card key={i} card={card} />
                    ))}
                    {table.communityCards.length === 0 && (
                        <div className="text-slate-500 font-bold tracking-widest uppercase opacity-50">Texas Hold&apos;em</div>
                    )}
                </div>

                {/* Players */}
                <div className="absolute inset-0 p-8">
                    {/* Simple positioning for up to 9 players */}
                    {/* Top */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-8">
                        {table.players.slice(2, 5).map((p, i) => (
                            <Player key={p.id} player={p} isCurrentTurn={table.currentTurn === p.id} isMe={p.id === currentPlayer?.id} isDealer={table.players.indexOf(p) === table.dealerIndex} />
                        ))}
                    </div>
                    {/* Left */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-8">
                        {table.players.slice(5, 7).map(p => (
                            <Player key={p.id} player={p} isCurrentTurn={table.currentTurn === p.id} isMe={p.id === currentPlayer?.id} isDealer={table.players.indexOf(p) === table.dealerIndex} />
                        ))}
                    </div>

                    {/* Right */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-8">
                        {table.players.slice(7, 9).map(p => (
                            <Player key={p.id} player={p} isCurrentTurn={table.currentTurn === p.id} isMe={p.id === currentPlayer?.id} isDealer={table.players.indexOf(p) === table.dealerIndex} />
                        ))}
                    </div>

                    {/* Bottom (Me + others) */}
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-8">
                        {table.players.slice(0, 2).map(p => (
                            <Player key={p.id} player={p} isCurrentTurn={table.currentTurn === p.id} isMe={p.id === currentPlayer?.id} isDealer={table.players.indexOf(p) === table.dealerIndex} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="h-24 bg-slate-800 p-4 flex items-center justify-center space-x-4">
                {table.players.length >= 2 && table.communityCards.length === 0 && table.pots[0].amount === 0 && (
                    <button onClick={() => startGame(table.id)} className="px-6 py-2 bg-green-600 rounded font-bold hover:bg-green-700">
                        {t('start')}
                    </button>
                )}

                {isMyTurn && (
                    <>
                        <button
                            onClick={() => handleAction(ActionType.Fold)}
                            className="px-6 py-2 bg-red-600 rounded font-bold hover:bg-red-700"
                        >
                            {t('fold')}
                        </button>

                        {callAmount === 0 ? (
                            <button
                                onClick={() => handleAction(ActionType.Check)}
                                className="px-6 py-2 bg-slate-600 rounded font-bold hover:bg-slate-700"
                            >
                                {t('check')}
                            </button>
                        ) : (
                            <button
                                onClick={() => handleAction(ActionType.Call)}
                                className="px-6 py-2 bg-blue-600 rounded font-bold hover:bg-blue-700"
                            >
                                {t('call')} ${callAmount}
                            </button>
                        )}

                        <button
                            onClick={() => handleAction(ActionType.Raise, maxBet + minRaise)}
                            className="px-6 py-2 bg-yellow-600 rounded font-bold hover:bg-yellow-700"
                        >
                            {t('raise')} ${maxBet + minRaise}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

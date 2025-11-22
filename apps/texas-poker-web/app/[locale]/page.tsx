'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';

import { GameTable } from '@/components/GameTable';

export default function Lobby() {
  const t = useTranslations('Lobby');
  const { connect, isConnected, tables, joinTable, currentTable, currentPlayer } = useGameStore();
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (currentTable) {
      console.log('Joined table:', currentTable.id);
    }
  }, [currentTable]);

  const handleJoin = (tableId: string) => {
    if (!name) return alert(t('enterName'));
    joinTable(tableId, name);
  };

  if (currentTable) {
    return <GameTable table={currentTable} currentPlayer={currentPlayer} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <h1 className="text-6xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
        {t('title')}
      </h1>

      <div className="w-full max-w-md space-y-8">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-slate-300">{t('enterName')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
              placeholder="PokerFace"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200">{t('tables')}</h2>
            {tables.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No tables found</p>
            ) : (
              tables.map((table) => (
                <div key={table.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                  <div>
                    <p className="font-medium">Table {table.id.slice(0, 4)}</p>
                    <p className="text-sm text-slate-400">{table.playerCount}/9 Players</p>
                  </div>
                  <button
                    onClick={() => handleJoin(table.id)}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-colors"
                  >
                    {t('joinTable')}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

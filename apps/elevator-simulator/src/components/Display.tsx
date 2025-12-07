'use client';

import React from 'react';
import { useElevatorStore } from '@/lib/store';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const Display = () => {
    const { currentFloor, direction } = useElevatorStore();

    return (
        <div className="bg-black text-cyan-500 font-mono p-6 rounded-xl border-2 border-cyan-900/50 flex items-center justify-center gap-6 shadow-[0_0_20px_rgba(6,182,212,0.2)] w-full max-w-[240px] relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="text-6xl font-bold drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                {currentFloor}
            </div>
            <div className="flex flex-col gap-1">
                <ArrowUp
                    className={`w-8 h-8 ${direction === 'UP' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-bounce' : 'text-slate-800'}`}
                />
                <ArrowDown
                    className={`w-8 h-8 ${direction === 'DOWN' ? 'text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-bounce' : 'text-slate-800'}`}
                />
            </div>
        </div>
    );
};

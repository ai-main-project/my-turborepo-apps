'use client';

import React from 'react';
import { useElevatorStore } from '@/lib/store';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { soundManager } from '@/lib/sound';
import clsx from 'clsx';

interface FloorControlProps {
    floor: number;
}

export const FloorControl = ({ floor }: FloorControlProps) => {
    const { requests, addRequest } = useElevatorStore();

    const handlePress = (direction: 'UP' | 'DOWN') => {
        soundManager.playButtonPress();
        addRequest({ floor, direction, type: 'EXTERNAL' });
    };

    const isUpActive = requests.some(r => r.floor === floor && r.direction === 'UP');
    const isDownActive = requests.some(r => r.floor === floor && r.direction === 'DOWN');

    return (
        <div className="flex flex-col gap-2 bg-slate-900 p-2 rounded-lg shadow-lg border border-cyan-900/30 backdrop-blur-sm">
            <button
                onClick={() => handlePress('UP')}
                className={clsx(
                    "p-2 rounded transition-all duration-200",
                    isUpActive
                        ? "bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.6)] scale-105"
                        : "bg-slate-800 text-cyan-700 hover:bg-slate-700 hover:text-cyan-400"
                )}
            >
                <ArrowUp size={18} />
            </button>
            <button
                onClick={() => handlePress('DOWN')}
                className={clsx(
                    "p-2 rounded transition-all duration-200",
                    isDownActive
                        ? "bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.6)] scale-105"
                        : "bg-slate-800 text-cyan-700 hover:bg-slate-700 hover:text-cyan-400"
                )}
            >
                <ArrowDown size={18} />
            </button>
        </div>
    );
};

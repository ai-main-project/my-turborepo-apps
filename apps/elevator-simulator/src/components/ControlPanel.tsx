
'use client';

import React from 'react';
import { useElevatorStore } from '@/lib/store';
import { FLOORS } from '@/lib/constants';
import { soundManager } from '@/lib/sound';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export const ControlPanel = () => {
    const { addRequest, requests, currentFloor } = useElevatorStore();
    const t = useTranslations('ControlPanel');

    const handlePress = (floor: number) => {
        addRequest({ floor, direction: 'IDLE', type: 'INTERNAL' });
        soundManager.playButtonPress();
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg border-2 border-slate-700 shadow-2xl w-64">
            <div className="mb-4 text-center border-b border-slate-700 pb-2">
                <h3 className="text-cyan-500 font-bold uppercase tracking-wider">{t('title')}</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: FLOORS }).map((_, i) => {
                    const floor = FLOORS - 1 - i; // Top to bottom
                    const isActive = requests.some(r => r.floor === floor && r.type === 'INTERNAL');
                    const isCurrent = currentFloor === floor;

                    return (
                        <button
                            key={floor}
                            onClick={() => handlePress(floor)}
                            className={clsx(
                                "w-14 h-14 rounded-lg font-bold transition-all duration-200 flex items-center justify-center shadow-lg relative overflow-hidden group",
                                isActive
                                    ? "bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.6)] border border-cyan-400"
                                    : "bg-slate-800 text-cyan-700 hover:bg-slate-700 hover:text-cyan-400 border border-cyan-900/30",
                                isCurrent && !isActive && "border-emerald-500/50 border-2 text-emerald-500"
                            )}
                        >
                            <span className="relative z-10">{floor}</span>
                            {isActive && <div className="absolute inset-0 bg-white opacity-20 animate-ping"></div>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

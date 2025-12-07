'use client';

import React from 'react';
import { ElevatorShaft } from './ElevatorShaft';
import { ControlPanel } from './ControlPanel';
import { Display } from './Display';
import { FloorControl } from './FloorControl';
import { useElevatorStore } from '@/lib/store';
import { FLOORS, FLOOR_HEIGHT } from '@/lib/constants';
import { useTranslations } from 'next-intl';

export const Building = () => {
    const t = useTranslations('Building');

    return (
        <div className="flex flex-col md:flex-row gap-12 items-start justify-center min-h-screen bg-slate-900 p-8 font-mono text-cyan-400 selection:bg-cyan-900 relative overflow-hidden">

            {/* Left Column: Building View */}
            <div className="flex flex-col items-center gap-6 z-10">
                <h2 className="text-3xl font-bold text-cyan-500 tracking-widest uppercase shadow-cyan-500/50 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    {t('title')}
                </h2>
                <div className="flex gap-4 relative p-4 border border-cyan-900/50 rounded-xl bg-slate-950/80 backdrop-blur-sm shadow-[0_0_30px_rgba(8,145,178,0.1)]">
                    {/* Floor Labels & Controls */}
                    <div className="flex flex-col relative" style={{ height: FLOORS * FLOOR_HEIGHT }}>
                        {Array.from({ length: FLOORS }).map((_, i) => {
                            const floor = FLOORS - 1 - i;

                            return (
                                <div
                                    key={floor}
                                    className="absolute right-0 flex items-center gap-4 pr-4"
                                    style={{
                                        top: i * FLOOR_HEIGHT,
                                        height: FLOOR_HEIGHT
                                    }}
                                >
                                    <span className="font-bold text-cyan-700/50 text-xl">{t('floor', { floor })}</span>
                                    <FloorControl floor={floor} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Shaft */}
                    <ElevatorShaft />
                </div>
            </div>

            {/* Right Column: Inside View */}
            <div className="flex flex-col items-center gap-8 bg-slate-950 p-10 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] border border-cyan-900/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <h2 className="text-2xl font-bold text-cyan-400 tracking-wider z-10">INTERNAL CONTROL</h2>

                <div className="flex flex-col items-center gap-10 z-10">
                    <Display />
                    <ControlPanel />
                </div>

                <div className="mt-8 text-xs text-cyan-800/60 max-w-xs text-center z-10 uppercase tracking-widest">
                    <p>System Status: <span className="text-emerald-500 animate-pulse">ONLINE</span></p>
                    <p className="mt-2">Authorized Personnel Only</p>
                </div>
            </div>

        </div>
    );
};

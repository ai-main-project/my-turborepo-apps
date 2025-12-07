'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useElevatorStore } from '@/lib/store';
import { FLOORS, FLOOR_HEIGHT } from '@/lib/constants';
import { soundManager } from '@/lib/sound';
import clsx from 'clsx';

export const ElevatorShaft = () => {
    const { currentFloor, doorProgress, state, updateElevator } = useElevatorStore();

    // Sound effects logic
    useEffect(() => {
        if (state === 'DOOR_OPENING' && doorProgress === 0) {
            soundManager.playDoorOpen();
            soundManager.playDing();
        }
        if (state === 'DOOR_CLOSING' && doorProgress === 0) {
            soundManager.playDoorClose();
        }
    }, [state, doorProgress]);

    // Game loop for logic updates
    useEffect(() => {
        let lastTime = performance.now();
        const loop = (time: number) => {
            const dt = time - lastTime;
            lastTime = time;
            updateElevator(dt);
            requestAnimationFrame(loop);
        };
        const frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [updateElevator]);

    return (
        <div
            className="relative bg-slate-900 border-x-2 border-cyan-900/50 overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
            style={{ height: FLOORS * FLOOR_HEIGHT, width: '240px' }}
        >
            {/* Background grid/rails */}
            <div className="absolute inset-0 flex justify-center opacity-30">
                <div className="w-0.5 h-full bg-cyan-500 mx-8 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                <div className="w-0.5 h-full bg-cyan-500 mx-8 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.1)_50%,transparent_100%)] bg-[length:100%_4px]"></div>
            </div>

            {/* Floors indicators */}
            {Array.from({ length: FLOORS }).map((_, i) => (
                <div
                    key={i}
                    className="absolute w-full border-b border-cyan-900/30 text-cyan-900/20 text-[10px] p-1 font-mono"
                    style={{ bottom: i * FLOOR_HEIGHT, height: FLOOR_HEIGHT }}
                >
                    {i}
                </div>
            ))}

            {/* Elevator Car */}
            <motion.div
                className="absolute left-4 right-4 bg-slate-800 rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center overflow-hidden border border-cyan-500/50"
                initial={{ bottom: 0 }}
                animate={{ bottom: currentFloor * FLOOR_HEIGHT }}
                transition={{
                    type: "spring",
                    stiffness: 60,
                    damping: 15,
                    mass: 1.2
                }}
                style={{ height: FLOOR_HEIGHT - 10 }}
            >
                {/* Interior Light */}
                <div className="absolute top-0 w-full h-full bg-cyan-500/5"></div>
                <div className="absolute top-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)]"></div>



                {/* Doors */}
                <div className="absolute inset-0 flex z-10">
                    {/* Left Door */}
                    <motion.div
                        className="h-full w-1/2 bg-slate-700 border-r border-cyan-900 relative shadow-lg"
                        animate={{ x: `-${doorProgress * 100}%` }}
                    >
                        <div className="absolute right-2 top-1/2 w-0.5 h-12 bg-cyan-500/50 rounded-full shadow-[0_0_5px_rgba(6,182,212,0.5)]"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    </motion.div>
                    {/* Right Door */}
                    <motion.div
                        className="h-full w-1/2 bg-slate-700 border-l border-cyan-900 relative shadow-lg"
                        animate={{ x: `${doorProgress * 100}%` }}
                    >
                        <div className="absolute left-2 top-1/2 w-0.5 h-12 bg-cyan-500/50 rounded-full shadow-[0_0_5px_rgba(6,182,212,0.5)]"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

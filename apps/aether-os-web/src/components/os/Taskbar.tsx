"use client";

import React, { useState, useEffect } from "react";
import { useOS } from "@/context/OSContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Monitor, Grid } from "lucide-react";
import StartMenu from "./StartMenu";

export default function Taskbar() {
    const { windows, activeWindowId, minimizeWindow, restoreWindow, focusWindow } = useOS();
    const { t, language } = useLanguage();
    const [time, setTime] = useState<Date | null>(null);
    const [isStartOpen, setIsStartOpen] = useState(false);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} />

            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
                <div className="glass-panel px-4 py-2 rounded-2xl flex gap-4 items-center pointer-events-auto transition-all duration-300 hover:scale-105">

                    {/* Start Button */}
                    <button
                        onClick={() => setIsStartOpen(!isStartOpen)}
                        className={cn(
                            "p-2 rounded-xl transition-colors text-white/90 hover:text-white flex items-center gap-2",
                            isStartOpen ? "bg-white/20 text-white" : "hover:bg-white/10"
                        )}
                        title={t("taskbar.start")}
                    >
                        <Grid size={20} />
                        <span className="text-sm font-medium hidden sm:inline-block">{t("taskbar.start")}</span>
                    </button>

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    {/* Open Apps */}
                    <div className="flex items-center gap-2">
                        {windows.map((win) => (
                            <button
                                key={win.id}
                                onClick={() => {
                                    if (win.isMinimized) {
                                        restoreWindow(win.id);
                                    } else if (activeWindowId === win.id) {
                                        minimizeWindow(win.id);
                                    } else {
                                        focusWindow(win.id);
                                    }
                                }}
                                className={cn(
                                    "p-2 rounded-xl transition-all duration-300 relative group",
                                    activeWindowId === win.id && !win.isMinimized
                                        ? "bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                        : "hover:bg-white/10 bg-white/5"
                                )}
                                title={win.title}
                            >
                                <div className="w-5 h-5 rounded-full bg-blue-500/50 flex items-center justify-center text-[10px] text-white font-bold">
                                    {win.title.charAt(0)}
                                </div>
                                {/* Indicator dot for open apps */}
                                <div className={cn(
                                    "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-opacity",
                                    win.isMinimized ? "opacity-30" : "opacity-100"
                                )} />
                            </button>
                        ))}
                    </div>

                    {windows.length > 0 && <div className="w-px h-8 bg-white/10 mx-1" />}

                    {/* Clock */}
                    <div className="text-white/90 text-sm font-medium tabular-nums px-2 flex flex-col items-center leading-tight group cursor-default min-w-[60px]">
                        {time && (
                            <>
                                <span>{time.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="text-[10px] text-white/50 h-0 overflow-hidden group-hover:h-auto transition-all">
                                    {time.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

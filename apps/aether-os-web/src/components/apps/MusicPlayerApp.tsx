"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const PLAYLIST = [
    { id: 1, title: "Cyberpunk City", artist: "Synthwave Boy", duration: "3:45" },
    { id: 2, title: "Neon Dreams", artist: "Retro Future", duration: "4:20" },
    { id: 3, title: "Digital Rain", artist: "Glitch Master", duration: "3:10" },
    { id: 4, title: "Nightcall", artist: "Kavinsky Style", duration: "4:05" },
];

export default function MusicPlayerApp() {
    const { t } = useLanguage();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(PLAYLIST[0]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="h-full flex flex-col text-white/90">
            {/* Visualizer / Album Art Area */}
            <div className="flex-1 bg-black/20 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center group">
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 transition-opacity duration-1000",
                    isPlaying ? "opacity-100" : "opacity-50"
                )} />

                {/* Animated Bars */}
                <div className="flex items-end gap-1 h-32">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-3 bg-white/80 rounded-t-sm transition-all duration-100 ease-in-out",
                                isPlaying ? "animate-pulse" : "h-2"
                            )}
                            style={{
                                height: isPlaying ? `${Math.random() * 100}%` : '10%',
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>

                <div className="absolute top-4 left-4">
                    <Music className="text-white/20" size={48} />
                </div>
            </div>

            {/* Controls */}
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="font-bold text-lg">{currentTrack.title}</h3>
                        <p className="text-sm text-white/60">{currentTrack.artist}</p>
                    </div>
                    <span className="text-xs text-white/50">{currentTrack.duration}</span>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                <div className="flex justify-center items-center gap-6">
                    <button className="text-white/70 hover:text-white transition-colors"><SkipBack size={20} /></button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                    <button className="text-white/70 hover:text-white transition-colors"><SkipForward size={20} /></button>
                </div>
            </div>

            {/* Playlist */}
            <div className="flex-1 overflow-y-auto -mx-2 px-2">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">{t("music.upnext")}</h4>
                <div className="space-y-1">
                    {PLAYLIST.map((track) => (
                        <button
                            key={track.id}
                            onClick={() => { setCurrentTrack(track); setIsPlaying(true); setProgress(0); }}
                            className={cn(
                                "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors",
                                currentTrack.id === track.id ? "bg-white/10 text-blue-300" : "hover:bg-white/5 text-white/70"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs w-4 text-center opacity-50">{track.id}</span>
                                <div>
                                    <div className="text-sm font-medium">{track.title}</div>
                                    <div className="text-xs opacity-60">{track.artist}</div>
                                </div>
                            </div>
                            <span className="text-xs opacity-50">{track.duration}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

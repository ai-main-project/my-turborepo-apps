"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DesktopIconProps {
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
}

export default function DesktopIcon({ title, icon, onClick }: DesktopIconProps) {
    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-colors w-24"
        >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center text-white">
                {icon}
            </div>
            <span className="text-sm text-white font-medium drop-shadow-md text-center leading-tight">
                {title}
            </span>
        </button>
    );
}

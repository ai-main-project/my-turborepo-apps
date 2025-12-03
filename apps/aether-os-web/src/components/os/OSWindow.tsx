"use client";

import React, { useRef, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { X, Minus, Square, Maximize2 } from "lucide-react";
import { useOS, WindowState } from "@/context/OSContext";
import { cn } from "@/lib/utils";

interface WindowProps {
    window: WindowState;
    children: React.ReactNode;
}

export default function OSWindow({ window, children }: WindowProps) {
    const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow } = useOS();
    const dragControls = useDragControls();
    const constraintsRef = useRef(null);

    const handleFocus = () => {
        focusWindow(window.id);
    };

    if (window.isMinimized) {
        return null;
    }

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
                scale: window.isMaximized ? 1 : 1,
                opacity: 1,
                width: window.isMaximized ? "100%" : window.size?.width || 600,
                height: window.isMaximized ? "100%" : window.size?.height || 400,
                x: window.isMaximized ? 0 : window.position?.x || 100,
                y: window.isMaximized ? 0 : window.position?.y || 100,
                borderRadius: window.isMaximized ? 0 : "0.75rem",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
                zIndex: window.zIndex,
                position: window.isMaximized ? "fixed" : "absolute",
                top: window.isMaximized ? 0 : 0,
                left: window.isMaximized ? 0 : 0,
            }}
            className={cn(
                "flex flex-col overflow-hidden shadow-2xl glass-dark text-white",
                window.isMaximized ? "inset-0" : ""
            )}
            onPointerDown={handleFocus}
        >
            {/* Title Bar */}
            <div
                className="h-10 flex items-center justify-between px-3 select-none bg-white/5 border-b border-white/10 cursor-default"
                onPointerDown={(e) => {
                    if (!window.isMaximized) {
                        dragControls.start(e);
                    }
                }}
                onDoubleClick={() => {
                    if (window.isMaximized) {
                        restoreWindow(window.id);
                    } else {
                        maximizeWindow(window.id);
                    }
                }}
            >
                <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                    {/* App Icon placeholder */}
                    <div className="w-4 h-4 rounded-full bg-blue-500/50" />
                    {window.title}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
                        className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                    >
                        <Minus size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.isMaximized) restoreWindow(window.id);
                            else maximizeWindow(window.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                    >
                        {window.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
                        className="p-1.5 rounded-md hover:bg-red-500/80 transition-colors text-white/70 hover:text-white"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 relative">
                {children}
            </div>
        </motion.div>
    );
}

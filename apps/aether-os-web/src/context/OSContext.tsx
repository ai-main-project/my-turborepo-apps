"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface WindowState {
    id: string;
    title: string;
    appId: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
}

interface OSContextType {
    windows: WindowState[];
    activeWindowId: string | null;
    openWindow: (appId: string, title: string) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    focusWindow: (id: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: ReactNode }) {
    const [windows, setWindows] = useState<WindowState[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [zIndexCounter, setZIndexCounter] = useState(10);

    const focusWindow = useCallback((id: string) => {
        setActiveWindowId(id);
        setZIndexCounter((prev) => prev + 1);
        setWindows((prev) =>
            prev.map((win) =>
                win.id === id ? { ...win, zIndex: zIndexCounter + 1, isMinimized: false } : win
            )
        );
    }, [zIndexCounter]);

    const openWindow = useCallback((appId: string, title: string) => {
        // Check if window for this app already exists
        // For some apps we might want multiple instances, but for now let's assume single instance for simplicity or just create new ID
        const newId = `${appId}-${Date.now()}`;

        const newWindow: WindowState = {
            id: newId,
            appId,
            title,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: zIndexCounter + 1,
            position: { x: 100, y: 100 }, // Default position, will be handled by Window component ideally
        };

        setWindows((prev) => [...prev, newWindow]);
        setZIndexCounter((prev) => prev + 1);
        setActiveWindowId(newId);
    }, [zIndexCounter]);

    const closeWindow = useCallback((id: string) => {
        setWindows((prev) => prev.filter((win) => win.id !== id));
        if (activeWindowId === id) {
            setActiveWindowId(null);
        }
    }, [activeWindowId]);

    const minimizeWindow = useCallback((id: string) => {
        setWindows((prev) =>
            prev.map((win) => (win.id === id ? { ...win, isMinimized: true } : win))
        );
        if (activeWindowId === id) {
            setActiveWindowId(null);
        }
    }, [activeWindowId]);

    const maximizeWindow = useCallback((id: string) => {
        setWindows((prev) =>
            prev.map((win) => (win.id === id ? { ...win, isMaximized: true } : win))
        );
        focusWindow(id);
    }, [focusWindow]);

    const restoreWindow = useCallback((id: string) => {
        setWindows((prev) =>
            prev.map((win) => (win.id === id ? { ...win, isMaximized: false, isMinimized: false } : win))
        );
        focusWindow(id);
    }, [focusWindow]);

    return (
        <OSContext.Provider
            value={{
                windows,
                activeWindowId,
                openWindow,
                closeWindow,
                minimizeWindow,
                maximizeWindow,
                restoreWindow,
                focusWindow,
            }}
        >
            {children}
        </OSContext.Provider>
    );
}

export function useOS() {
    const context = useContext(OSContext);
    if (context === undefined) {
        throw new Error("useOS must be used within an OSProvider");
    }
    return context;
}

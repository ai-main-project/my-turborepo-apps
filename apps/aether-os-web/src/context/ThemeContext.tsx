"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ThemeState {
    backgroundUrl: string;
    accentColor: string;
}

interface ThemeContextType {
    theme: ThemeState;
    setBackground: (url: string) => void;
    setAccentColor: (color: string) => void;
}

const defaultTheme: ThemeState = {
    backgroundUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    accentColor: "blue",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeState>(defaultTheme);

    const setBackground = (url: string) => {
        setTheme((prev) => ({ ...prev, backgroundUrl: url }));
    };

    const setAccentColor = (color: string) => {
        setTheme((prev) => ({ ...prev, accentColor: color }));
    };

    return (
        <ThemeContext.Provider value={{ theme, setBackground, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

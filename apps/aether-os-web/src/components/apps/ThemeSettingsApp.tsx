"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const WALLPAPERS = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?q=80&w=2072&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop",
];

const ACCENTS = [
    { name: "Blue", value: "blue" },
    { name: "Purple", value: "purple" },
    { name: "Pink", value: "pink" },
    { name: "Green", value: "green" },
];

export default function ThemeSettingsApp() {
    const { theme, setBackground, setAccentColor } = useTheme();
    const { t } = useLanguage();

    return (
        <div className="h-full p-6 text-white overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{t("theme.title")}</h2>

            {/* Background Section */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">{t("theme.bg")}</h3>
                <div className="grid grid-cols-2 gap-4">
                    {WALLPAPERS.map((url) => (
                        <button
                            key={url}
                            onClick={() => setBackground(url)}
                            className={cn(
                                "relative aspect-video rounded-xl overflow-hidden border-2 transition-all hover:scale-105",
                                theme.backgroundUrl === url ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <img src={url} alt="Wallpaper" className="w-full h-full object-cover" />
                            {theme.backgroundUrl === url && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Check size={16} className="text-white" />
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Accent Color Section */}
            <div className="mb-8">
                <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">{t("theme.accent")}</h3>
                <div className="flex gap-4">
                    {ACCENTS.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setAccentColor(color.value)}
                            className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                                `bg-${color.value}-500`,
                                theme.accentColor === color.value ? "ring-4 ring-white/20" : ""
                            )}
                            title={color.name}
                        >
                            {theme.accentColor === color.value && <Check size={20} className="text-white" />}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={() => {
                    setBackground(WALLPAPERS[0]);
                    setAccentColor("blue");
                }}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
                {t("theme.reset")}
            </button>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { Save, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotepadApp() {
    const { t } = useLanguage();
    const [content, setContent] = useState("");
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    useEffect(() => {
        const savedContent = localStorage.getItem("notepad-content");
        if (savedContent) {
            setContent(savedContent);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem("notepad-content", content);
        setLastSaved(new Date().toLocaleTimeString());
    };

    const handleClear = () => {
        if (confirm(t("notepad.confirm_clear"))) {
            setContent("");
            localStorage.removeItem("notepad-content");
            setLastSaved(null);
        }
    };

    return (
        <div className="h-full flex flex-col text-white/90">
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="text-xs text-white/50">
                    {lastSaved
                        ? t("notepad.saved", { time: lastSaved })
                        : t("notepad.unsaved")}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleClear}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-red-400 transition-colors"
                        title={t("notepad.clear")}
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={handleSave}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-blue-400 transition-colors"
                        title={t("notepad.save")}
                    >
                        <Save size={16} />
                    </button>
                </div>
            </div>
            <textarea
                className="flex-1 w-full bg-black/20 border border-white/10 rounded-lg p-4 text-white/90 resize-none focus:outline-none focus:border-white/20 transition-colors font-mono text-sm"
                placeholder={t("notepad.placeholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
    );
}

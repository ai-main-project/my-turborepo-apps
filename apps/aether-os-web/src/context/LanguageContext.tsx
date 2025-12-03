"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { TRANSLATIONS, Language } from "@/config/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    // Load saved language
    useEffect(() => {
        const savedLang = localStorage.getItem("aether-language") as Language;
        if (savedLang && (savedLang === "en" || savedLang === "zh")) {
            setLanguage(savedLang);
        }
    }, []);

    // Save language change
    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("aether-language", lang);
    };

    const t = (key: string, params?: Record<string, string>) => {
        const translation = TRANSLATIONS[language][key as keyof typeof TRANSLATIONS["en"]] || key;

        if (params) {
            return Object.entries(params).reduce((acc, [k, v]) => {
                return acc.replace(`{${k}}`, v);
            }, translation);
        }

        return translation;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

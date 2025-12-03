import React from "react";
import { Sparkles, Palette, Music, FileText } from "lucide-react";
import WelcomeApp from "@/components/apps/WelcomeApp";
import ThemeSettingsApp from "@/components/apps/ThemeSettingsApp";
import MusicPlayerApp from "@/components/apps/MusicPlayerApp";
import NotepadApp from "@/components/apps/NotepadApp";

export interface AppConfig {
    id: string;
    title: string;
    icon: React.ReactNode;
    component: React.ReactNode;
    width?: number;
    height?: number;
}

export const APPS: AppConfig[] = [
    {
        id: "welcome",
        title: "app.welcome",
        icon: <Sparkles size={24} />,
        component: <WelcomeApp />,
        width: 600,
        height: 400,
    },
    {
        id: "theme-settings",
        title: "app.themes",
        icon: <Palette size={24} />,
        component: <ThemeSettingsApp />,
        width: 500,
        height: 500,
    },
    {
        id: "music-player",
        title: "app.music",
        icon: <Music size={24} />,
        component: <MusicPlayerApp />,
        width: 400,
        height: 500,
    },
    {
        id: "notepad",
        title: "app.notepad",
        icon: <FileText size={24} />,
        component: <NotepadApp />,
        width: 500,
        height: 400,
    },
];

export const getAppById = (id: string) => APPS.find((app) => app.id === id);

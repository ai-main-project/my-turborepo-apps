"use client";

import React, { useEffect } from "react";
import { useOS } from "@/context/OSContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import OSWindow from "./OSWindow";
import Taskbar from "./Taskbar";
import DesktopIcon from "./DesktopIcon";
import { APPS, getAppById } from "@/config/apps";

export default function Desktop() {
    const { windows, openWindow } = useOS();
    const { theme } = useTheme();
    const { t } = useLanguage();

    // Open Welcome app on first load
    useEffect(() => {
        const hasOpened = sessionStorage.getItem("welcome-opened");
        if (!hasOpened) {
            openWindow("welcome", t("app.welcome"));
            sessionStorage.setItem("welcome-opened", "true");
        }
    }, [openWindow, t]);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url('${theme.backgroundUrl}')` }}>

            {/* Dynamic Background Overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

            {/* Desktop Icons */}
            <div className="relative z-0 p-4 flex flex-col gap-4 items-start">
                {APPS.map((app) => (
                    <DesktopIcon
                        key={app.id}
                        title={t(app.title)}
                        icon={app.icon}
                        onClick={() => openWindow(app.id, t(app.title))}
                    />
                ))}
            </div>

            {/* Desktop Area (Windows) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Windows will be rendered here */}
                {windows.map((win) => {
                    const app = getAppById(win.appId);
                    return (
                        <div key={win.id} className="pointer-events-auto">
                            <OSWindow window={win}>
                                {app ? app.component : <div className="p-4 text-white">App not found</div>}
                            </OSWindow>
                        </div>
                    );
                })}
            </div>

            {/* Taskbar */}
            <Taskbar />
        </div>
    );
}

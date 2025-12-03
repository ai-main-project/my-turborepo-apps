"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOS } from "@/context/OSContext";
import { useLanguage } from "@/context/LanguageContext";
import { APPS } from "@/config/apps";
import { cn } from "@/lib/utils";
import { Search, Globe } from "lucide-react";

interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StartMenu({ isOpen, onClose }: StartMenuProps) {
    const { openWindow } = useOS();
    const { t, language, setLanguage } = useLanguage();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop to close menu when clicking outside */}
                    <div className="fixed inset-0 z-40" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 w-[500px] h-[400px] glass-dark rounded-2xl overflow-hidden flex flex-col border border-white/10 shadow-2xl"
                    >
                        {/* Search Bar */}
                        <div className="p-4 border-b border-white/10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                                <input
                                    type="text"
                                    placeholder={t("start.search")}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 transition-colors"
                                />
                            </div>
                        </div>

                        {/* App Grid */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">{t("start.pinned")}</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {APPS.map((app) => (
                                    <button
                                        key={app.id}
                                        onClick={() => {
                                            openWindow(app.id, t(app.title));
                                            onClose();
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                            {app.icon}
                                        </div>
                                        <span className="text-xs text-white/80">{t(app.title)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-black/20 border-t border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                                <span className="text-sm text-white font-medium">{t("start.guest")}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setLanguage(language === "en" ? "zh" : "en")}
                                    className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <Globe size={14} />
                                    {language === "en" ? "English" : "中文"}
                                </button>
                                <button className="text-xs text-white/50 hover:text-white transition-colors">
                                    {t("start.power")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

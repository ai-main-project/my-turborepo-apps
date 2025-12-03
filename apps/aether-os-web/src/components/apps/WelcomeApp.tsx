"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Layout, AppWindow } from "lucide-react";

export default function WelcomeApp() {
    const { t } = useLanguage();

    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-white">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
                <Sparkles size={40} className="text-white" />
            </div>

            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                {t("welcome.title")}
            </h1>
            <p className="text-white/60 mb-8 max-w-md">
                {t("welcome.subtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl text-left">
                <FeatureCard
                    icon={<Layout className="text-blue-400" />}
                    title={t("welcome.feat.design")}
                    description={t("welcome.feat.design.desc")}
                />
                <FeatureCard
                    icon={<AppWindow className="text-purple-400" />}
                    title={t("welcome.feat.window")}
                    description={t("welcome.feat.window.desc")}
                />
                <FeatureCard
                    icon={<Sparkles className="text-pink-400" />}
                    title={t("welcome.feat.apps")}
                    description={t("welcome.feat.apps.desc")}
                />
            </div>

            <button className="mt-8 px-6 py-2 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform">
                {t("welcome.getstarted")}
            </button>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="mb-2">{icon}</div>
            <h3 className="font-semibold mb-1 text-sm">{title}</h3>
            <p className="text-xs text-white/50 leading-relaxed">{description}</p>
        </div>
    )
}

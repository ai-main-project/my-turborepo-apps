"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ResultsChart } from "@/components/ResultsChart";
import { ResultsTable } from "@/components/ResultsTable";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  calculateCompoundInterest,
  CalculatorInputs,
} from "@/lib/calculator";
import { motion } from "framer-motion";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const [inputs, setInputs] = useState<CalculatorInputs>({
    principal: 10000,
    rate: 7,
    time: 10,
    contribution: 1000,
  });

  const results = useMemo(() => calculateCompoundInterest(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-100 via-slate-50 to-slate-100 dark:from-[#1A1A1A] dark:via-[#121212] dark:to-[#0D0D0D] transition-colors duration-500">
      <header className="sticky top-0 z-50 glass border-b border-[#E2E8F0]/50 dark:border-[#333333]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-900 font-bold text-lg shadow-lg">
              %
            </div>
            <h1 className="text-xl font-bold text-[#121212] dark:text-[#FFFFFF]">
              {t("title")}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <ThemeToggle />
            <LanguageSwitcher />
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[#000000] dark:text-[#FFFFFF] mb-4 tracking-tight">
            {t("subtitle")}
          </h2>
          <p className="text-lg text-[#262626] dark:text-[#E5E5E5]">
            {t("description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <CalculatorForm inputs={inputs} onInputChange={setInputs} />
          </div>
          <div className="lg:col-span-8 space-y-8">
            <ResultsChart data={results} />
            <ResultsTable data={results} />
          </div>
        </div>
      </main>
    </div>
  );
}

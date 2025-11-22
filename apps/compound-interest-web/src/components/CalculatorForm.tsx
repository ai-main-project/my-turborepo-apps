"use client";

import { useTranslations } from "next-intl";
import { CalculatorInputs } from "@/lib/calculator";
import { motion } from "framer-motion";
import { DollarSign, Percent, Calendar, TrendingUp } from "lucide-react";

interface CalculatorFormProps {
    inputs: CalculatorInputs;
    onInputChange: (inputs: CalculatorInputs) => void;
}

export function CalculatorForm({ inputs, onInputChange }: CalculatorFormProps) {
    const t = useTranslations("Calculator");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onInputChange({
            ...inputs,
            [name]: Number(value),
        });
    };

    const inputClasses = "w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 backdrop-blur-sm text-[#121212] dark:text-[#E5E5E5] placeholder-[#737373] dark:placeholder-[#999999]";
    const labelClasses = "block text-sm font-medium text-[#525252] dark:text-[#B3B3B3] mb-2";
    const iconClasses = "absolute left-3 top-3.5 h-5 w-5 text-[#737373] dark:text-[#B3B3B3] group-focus-within:text-primary transition-colors duration-300";

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="glass-card p-8 space-y-6"
        >
            <motion.div variants={item} className="group relative">
                <label className={labelClasses}>{t("principal")}</label>
                <div className="relative">
                    <div className="absolute left-3 top-3.5 h-5 w-5 flex items-center justify-center text-[#737373] dark:text-[#B3B3B3] group-focus-within:text-primary transition-colors duration-300 font-semibold">
                        {t("currencySymbol")}
                    </div>
                    <input
                        type="number"
                        name="principal"
                        value={inputs.principal}
                        onChange={handleChange}
                        className={inputClasses}
                    />
                </div>
                <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    name="principal"
                    value={inputs.principal}
                    onChange={handleChange}
                    className="w-full mt-2 h-1 bg-[#E2E8F0] dark:bg-[#333333] rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </motion.div>

            <motion.div variants={item} className="group relative">
                <label className={labelClasses}>{t("rate")}</label>
                <div className="relative">
                    <Percent className={iconClasses} />
                    <input
                        type="number"
                        name="rate"
                        value={inputs.rate}
                        onChange={handleChange}
                        step="0.1"
                        className={inputClasses}
                    />
                </div>
                <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    name="rate"
                    value={inputs.rate}
                    onChange={handleChange}
                    className="w-full mt-2 h-1 bg-[#E2E8F0] dark:bg-[#333333] rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </motion.div>

            <motion.div variants={item} className="group relative">
                <label className={labelClasses}>{t("time")}</label>
                <div className="relative">
                    <Calendar className={iconClasses} />
                    <input
                        type="number"
                        name="time"
                        value={inputs.time}
                        onChange={handleChange}
                        className={inputClasses}
                    />
                </div>
                <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    name="time"
                    value={inputs.time}
                    onChange={handleChange}
                    className="w-full mt-2 h-1 bg-[#E2E8F0] dark:bg-[#333333] rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </motion.div>

            <motion.div variants={item} className="group relative">
                <label className={labelClasses}>{t("contribution")}</label>
                <div className="relative">
                    <div className="absolute left-3 top-3.5 h-5 w-5 flex items-center justify-center text-[#737373] dark:text-[#B3B3B3] group-focus-within:text-primary transition-colors duration-300 font-semibold">
                        {t("currencySymbol")}
                    </div>
                    <input
                        type="number"
                        name="contribution"
                        value={inputs.contribution}
                        onChange={handleChange}
                        className={inputClasses}
                    />
                </div>
                <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    name="contribution"
                    value={inputs.contribution}
                    onChange={handleChange}
                    className="w-full mt-2 h-1 bg-[#E2E8F0] dark:bg-[#333333] rounded-lg appearance-none cursor-pointer accent-primary"
                />
            </motion.div>
        </motion.div>
    );
}

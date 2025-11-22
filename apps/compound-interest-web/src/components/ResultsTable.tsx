"use client";

import { CalculationResult } from "@/lib/calculator";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface ResultsTableProps {
    data: CalculationResult[];
}

export function ResultsTable({ data }: ResultsTableProps) {
    const t = useTranslations("Results");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden glass-card"
        >
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E2E8F0] dark:divide-[#333333]">
                    <thead className="bg-[#F1F5F9]/50 dark:bg-[#1E1E1E]/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#525252] dark:text-[#B3B3B3] uppercase tracking-wider">
                                {t("year")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#525252] dark:text-[#B3B3B3] uppercase tracking-wider">
                                {t("balance")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#525252] dark:text-[#B3B3B3] uppercase tracking-wider">
                                {t("contributions")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#525252] dark:text-[#B3B3B3] uppercase tracking-wider">
                                {t("interest")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#333333] bg-transparent">
                        {data.map((row, index) => (
                            <motion.tr
                                key={row.year}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.05 * Math.min(index, 20) }} // Stagger first 20 rows
                                className="hover:bg-[#F1F5F9]/50 dark:hover:bg-[#2A2A2A]/50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#121212] dark:text-[#E5E5E5]">
                                    {row.year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                                    {t("currencySymbol")}{row.balance.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#525252] dark:text-[#E5E5E5]">
                                    {t("currencySymbol")}{row.contributions.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 dark:text-amber-400 font-medium">
                                    +{t("currencySymbol")}{row.interest.toLocaleString()}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

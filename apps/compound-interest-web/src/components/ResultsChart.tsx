"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { CalculationResult } from "@/lib/calculator";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface ResultsChartProps {
    data: CalculationResult[];
}

export function ResultsChart({ data }: ResultsChartProps) {
    const t = useTranslations("Results");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-[450px] w-full glass-card p-6"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FCD535" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FCD535" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorContribution" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.1} vertical={false} />
                    <XAxis
                        dataKey="year"
                        stroke="#B3B3B3"
                        tick={{ fontSize: 12, fill: '#B3B3B3' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#B3B3B3"
                        tick={{ fontSize: 12, fill: '#B3B3B3' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${t("currencySymbol")}${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1E1E1E",
                            backdropFilter: "blur(8px)",
                            borderRadius: "12px",
                            border: "1px solid #333333",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                            color: "#E5E5E5"
                        }}
                        itemStyle={{ color: "#E5E5E5" }}
                        labelStyle={{ color: "#B3B3B3", marginBottom: "0.5rem" }}
                        formatter={(value: number) => [`${t("currencySymbol")}${value.toLocaleString()}`, ""]}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Area
                        type="monotone"
                        dataKey="balance"
                        name={t("balance")}
                        stroke="#FCD535"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorBalance)"
                    />
                    <Area
                        type="monotone"
                        dataKey="contributions"
                        name={t("contributions")}
                        stroke="#F59E0B"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorContribution)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

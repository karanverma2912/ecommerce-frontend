"use client";

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const rawData = [
    { name: 'Jan', profit: 7000, expense: 4500 },
    { name: 'Feb', profit: 1000, expense: 3000 },
    { name: 'Mar', profit: 3800, expense: 9000 },
    { name: 'Apr', profit: 5000, expense: 9500 },
    { name: 'May', profit: 7800, expense: 9500 },
    { name: 'Jun', profit: 9000, expense: 9800 },
    { name: 'Jul', profit: 6000, expense: 9500 },
    { name: 'Aug', profit: 7500, expense: 9300 },
    { name: 'Sep', profit: 3500, expense: 9200 },
    { name: 'Oct', profit: 5500, expense: 9500 },
    { name: 'Nov', profit: 7500, expense: 9500 },
    { name: 'Dec', profit: 8000, expense: 9200 },
];

interface CustomTooltipProps {
    active?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any[];
    label?: string;
    activeBar?: string | null;
}

const CustomTooltip = ({ active, payload, label, activeBar }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        // Map the active stack segment to the original data key
        let originalKey = null;
        if (activeBar === 'profitTop' || activeBar === 'profitBottom') originalKey = 'profit';
        if (activeBar === 'expenseTop' || activeBar === 'expenseBottom') originalKey = 'expense';

        // Find the payload item that contains the full data object
        // payload[0].payload holds the original data item (e.g. { name: 'Jan', profit: 7000, ... })
        const dataItem = payload[0]?.payload;

        if (!originalKey || !dataItem) return null;

        const value = dataItem[originalKey];
        const color = originalKey === 'profit' ? '#2A7E74' : '#e5e7eb';
        const name = originalKey === 'profit' ? 'Profit' : 'Expense';

        return (
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden min-w-[120px]">
                <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-700">{label}</p>
                </div>
                <div className="p-3">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-gray-600 capitalize">
                            {name}:
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                            {value}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export default function SalesChart() {
    const [activeBar, setActiveBar] = useState<string | null>(null);

    // Process data to determine stacking order:
    // Total Height = Max(Profit, Expense)
    // Bottom Bar = Min(Profit, Expense)
    // Top Bar = Max - Min (Difference)
    const processedData = rawData.map(item => {
        const isProfitHigher = item.profit > item.expense;

        return {
            ...item,
            // If Profit > Expense: Expense is part of Bottom, Profit starts at Bottom but extends passed Expense?
            // Actually, to achieve the visual:
            // "if profit is high (10k) > expense (3k)":
            // We want a bar of 10k total.
            // Bottom 3k is Expense (Grey).
            // Top 7k is Profit (Green).
            // Visual Result: Grey bar 0-3k, Green bar 3k-10k.

            // "if expense is high (9.5k) > profit (7k)":
            // We want a bar of 9.5k total.
            // Bottom 7k is Profit (Green). 
            // Top 2.5k is Expense (Grey).

            profitBottom: isProfitHigher ? 0 : item.profit,
            expenseBottom: isProfitHigher ? item.expense : 0,

            profitTop: isProfitHigher ? (item.profit - item.expense) : 0,
            expenseTop: isProfitHigher ? 0 : (item.expense - item.profit),
        };
    });

    // Calculate dynamic ticks for YAxis
    const maxVal = Math.max(...rawData.map(d => Math.max(d.profit, d.expense)));

    // Determine step size: 1000 if max <= 10k, otherwise 2000
    const step = maxVal > 10000 ? 2000 : 1000;

    // Ensure we go at least to 10k
    const yMax = Math.max(10000, Math.ceil(maxVal / step) * step);
    const ticks = Array.from({ length: (yMax / step) + 1 }, (_, i) => i * step);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-800">Sales Overview</h3>
                <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg focus:ring-[#2A7E74] focus:border-[#2A7E74] block p-2">
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                </select>
            </div>

            <div className="flex-1 w-full min-h-[400px] overflow-x-auto">
                <BarChart
                    width={1100}
                    height={400}
                    data={processedData}
                    margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                    barGap={0}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        dx={-10}
                        ticks={ticks}
                        domain={[0, 'auto']}
                    />
                    <Tooltip
                        content={<CustomTooltip activeBar={activeBar} />}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="rect"
                    />

                    {/* Layer 1: Bottom Bars */}
                    <Bar
                        dataKey="profitBottom"
                        name="Profit" // Name matches Legend
                        fill="#2A7E74"
                        radius={[0, 0, 0, 0]}
                        barSize={32}
                        stackId="a"
                        onMouseEnter={() => setActiveBar('profitBottom')}
                        onMouseLeave={() => setActiveBar(null)}
                    />
                    <Bar
                        dataKey="expenseBottom"
                        name="Expense" // Name matches Legend
                        fill="#e5e7eb"
                        radius={[0, 0, 0, 0]}
                        barSize={32}
                        stackId="a"
                        onMouseEnter={() => setActiveBar('expenseBottom')}
                        onMouseLeave={() => setActiveBar(null)}
                    />

                    {/* Layer 2: Top Bars */}
                    {/* Note: We hide these from Legend to avoid duplicates */}
                    <Bar
                        dataKey="profitTop"
                        name="Profit" // Keep name for consistency, but duplicate in Legend? 
                        // Recharts Legend dedupes by name usually, or we can filter.
                        // Actually, simply giving them the same Name works for deduplication often, 
                        // but separate dataKeys might create separate legend items.
                        // We'll see. If usage duplicates, we might need a custom Legend payload or legendType="none"
                        legendType="none"
                        fill="#2A7E74"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                        stackId="a"
                        onMouseEnter={() => setActiveBar('profitTop')}
                        onMouseLeave={() => setActiveBar(null)}
                    />
                    <Bar
                        dataKey="expenseTop"
                        name="Expense"
                        legendType="none"
                        fill="#e5e7eb"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                        stackId="a"
                        onMouseEnter={() => setActiveBar('expenseTop')}
                        onMouseLeave={() => setActiveBar(null)}
                    />
                </BarChart>
            </div>
        </div>
    );
}

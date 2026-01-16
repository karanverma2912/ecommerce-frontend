"use client";

import { User, Users, DollarSign, Wallet, Percent, ArrowRightLeft } from "lucide-react";

export default function DashboardStats() {
    const stats = [
        {
            label: "Total Customers",
            value: "3,456",
            change: "+12.5%",
            trend: "up",
            period: "Last 7 days",
            icon: User,
            color: "bg-[#2A7E74]/10 text-[#2A7E74]",
        },
        {
            label: "Active Customers",
            value: "2,839",
            change: "-1.5%",
            trend: "down",
            period: "Last 7 days",
            icon: Users,
            color: "bg-purple-100 text-purple-600",
        },
        {
            label: "Profit Total",
            value: "$7,254",
            change: "+12.8%",
            trend: "up",
            period: "Last 7 days",
            icon: DollarSign,
            color: "bg-pink-100 text-pink-600",
        },
        {
            label: "Expense Total",
            value: "$4,578",
            change: "-18%",
            trend: "down",
            period: "Last 7 days",
            icon: Wallet,
            color: "bg-orange-100 text-orange-600",
        },
        {
            label: "Conversion Rate",
            value: "14.57%",
            change: "+5.8%",
            trend: "up",
            period: "Last 7 days",
            icon: Percent,
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Total Deals",
            value: "8,754",
            change: "+4.5%",
            trend: "up",
            period: "Last 7 days",
            icon: ArrowRightLeft,
            color: "bg-gray-100 text-gray-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-full ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                        <div className="text-right">
                            <span className="text-gray-500 text-sm font-medium block mb-1">{stat.label}</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        <div className="text-right">
                            <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center gap-0.5 justify-end`}>
                                {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                            </span>
                            <span className="text-[10px] text-gray-400 block">{stat.period}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

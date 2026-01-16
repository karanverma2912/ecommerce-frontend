"use client";

import DashboardStats from "@/app/components/admin/DashboardStats";
import SalesChart from "@/app/components/admin/SalesChart";
import RecentTransactions from "@/app/components/admin/RecentTransactions";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">NextGen</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm text-[#2A7E74]">Dashboard</span>
                </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart - Left Side (2/3) */}
                <div className="lg:col-span-2 min-h-[600px]">
                    <SalesChart />
                </div>

                {/* Stats Grid - Right Side (1/3) */}
                <div className="lg:col-span-1">
                    <DashboardStats />
                </div>
            </div>

            {/* Transactions Row (Kept as is) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <RecentTransactions />
                </div>
            </section>
        </div>
    );
}

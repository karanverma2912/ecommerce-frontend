"use client";

import { useState } from "react";
import AdminHeader from "@/app/components/admin/AdminHeader";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-neutral-50">
            {/* Sidebar - Pass props */}
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Header - Pass toggle handler */}
                <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

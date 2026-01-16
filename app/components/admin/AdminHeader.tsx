"use client";

import { Bell, Maximize, Search, Menu } from "lucide-react";

interface AdminHeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function AdminHeader({ collapsed, setCollapsed }: AdminHeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left: Toggle & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg hover:text-[#2A7E74] transition-colors"
                >
                    <Menu size={20} />
                </button>
                <h2 className="text-gray-700 font-medium">Good Morning, John Smith</h2>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-[#2A7E74]/30 focus-within:ring-2 focus-within:ring-[#2A7E74]/10 transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none w-full ml-2"
                    />
                </div>

                {/* Fullscreen Toggle */}
                <button className="hidden md:flex p-2 text-gray-400 hover:text-[#2A7E74] hover:bg-gray-50 rounded-lg transition-colors">
                    <Maximize size={20} />
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-[#2A7E74] hover:bg-gray-50 rounded-lg transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                        {/* Placeholder for Avatar */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300"></div>
                        {/* <Image src="/avatar.jpg" alt="User" width={36} height={36} /> */}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-700 leading-tight">John Smith</p>
                        <p className="text-xs text-gray-400">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

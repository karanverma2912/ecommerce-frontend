"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    FileText,
    Settings,
    Calendar,
    MessageSquare,
    ListTodo,
    Component,
    PanelLeftClose,
} from "lucide-react";
import clsx from "clsx";

interface AdminSidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({ collapsed, setCollapsed }: AdminSidebarProps) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const menuItems = [
        {
            category: "MENU",
            items: [
                { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
                { label: "Analytics", href: "/admin/analytics", icon: FileText },
                { label: "eCommerce", href: "/admin/ecommerce", icon: ShoppingCart },
            ]
        },
        {
            category: "APPS",
            items: [
                { label: "Todo List", href: "/admin/todo", icon: ListTodo },
                { label: "Contacts", href: "/admin/contacts", icon: Users },
                { label: "Calendar", href: "/admin/calendar", icon: Calendar },
                { label: "Chat", href: "/admin/chat", icon: MessageSquare },
            ]
        },
        {
            category: "GENERAL",
            items: [
                { label: "Components", href: "/admin/components", icon: Component },
                { label: "Settings", href: "/admin/settings", icon: Settings },
            ]
        }
    ];

    return (
        <aside className={clsx(
            "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-[800ms] ease-in-out sticky top-0 left-0 z-40 overflow-x-hidden",
            collapsed ? "w-20" : "w-64"
        )}>
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-50 shrink-0">
                <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
                    {/* Collapsed Icon Logo */}
                    <div
                        className={clsx(
                            "w-8 h-8 rounded bg-[#2A7E74] flex items-center justify-center text-white font-bold transition-all duration-[800ms]",
                            collapsed ? "opacity-100 scale-100" : "opacity-0 scale-0 w-0 hidden"
                        )}
                    >
                        N
                    </div>

                    {/* Full Logo Text */}
                    <span
                        className={clsx(
                            "text-xl font-bold transition-all duration-[800ms] ease-in-out whitespace-nowrap",
                            collapsed ? "opacity-0 w-0 -translate-x-4" : "opacity-100 w-auto translate-x-0"
                        )}
                    >
                        <span className="text-gray-900">Next</span>
                        <span className="text-[#2A7E74]">Gen</span>
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                {menuItems.map((section, idx) => (
                    <div key={idx}>
                        <h3
                            className={clsx(
                                "px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 transition-all duration-[800ms] ease-in-out whitespace-nowrap overflow-hidden",
                                collapsed ? "opacity-0 h-0 mb-0" : "opacity-100 h-auto mb-2"
                            )}
                        >
                            {section.category}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group relative",
                                            active
                                                ? "text-[#2A7E74] bg-[#2A7E74]/10"
                                                : "text-gray-600 hover:text-[#2A7E74] hover:bg-gray-50"
                                        )}
                                    >
                                        <item.icon size={20} className={clsx("shrink-0 transition-colors duration-300", active ? "text-[#2A7E74]" : "text-gray-400 group-hover:text-[#2A7E74]")} />

                                        <span
                                            className={clsx(
                                                "transition-all duration-[800ms] ease-in-out whitespace-nowrap overflow-hidden",
                                                collapsed ? "opacity-0 w-0 -translate-x-2" : "opacity-100 w-auto translate-x-0"
                                            )}
                                        >
                                            {item.label}
                                        </span>

                                        {/* Tooltip for collapsed state */}
                                        {collapsed && (
                                            <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transition-opacity duration-200">
                                                {item.label}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Toggle */}
            <div className="p-4 border-t border-gray-50 flex justify-end shrink-0">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 text-gray-400 hover:text-[#2A7E74] hover:bg-gray-50 rounded-lg transition-colors duration-300"
                >
                    <PanelLeftClose size={20} className={clsx("transition-transform duration-[800ms] ease-in-out", collapsed && "rotate-180")} />
                </button>
            </div>
        </aside>
    );
}

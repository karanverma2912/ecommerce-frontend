import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { notifications } from "@/app/data/notifications";
import { Bell, Check, Trash2, Package, Tag, Info } from "lucide-react";

export function NotificationDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [filter, setFilter] = useState<"all" | "unread">("all");

    // Helper to get icon based on title/type (simulated logic)
    const getIcon = (title: string) => {
        const text = title.toLowerCase();
        if (text.includes("order") || text.includes("shipped")) return <Package size={18} className="text-cyan-400" />;
        if (text.includes("discount") || text.includes("sale") || text.includes("offer")) return <Tag size={18} className="text-pink-400" />;
        return <Info size={18} className="text-blue-400" />;
    };

    const filteredNotifications = filter === "all"
        ? notifications
        : notifications.filter(n => !n.read);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 top-full mt-6 w-96 max-w-[90vw] bg-white/10 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(34,211,238,0.1)] z-[100] overflow-hidden ring-1 ring-white/10"
                >
                    {/* Header with Glass Effect */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 dark:bg-white/5">
                        <div className="flex items-center gap-2">
                            <Bell className="text-gray-700 dark:text-cyan-400" size={18} />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">
                                Notifications
                            </h3>
                            {notifications.some(n => !n.read) && (
                                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            )}
                        </div>
                        <button className="text-xs text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                            <Check size={14} className="group-hover:scale-110 transition-transform" />
                            Mark all read
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-2 gap-2 border-b border-white/10 bg-white/5 dark:bg-black/20">
                        {["all", "unread"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab as "all" | "unread")}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${filter === tab
                                    ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)] ring-1 ring-cyan-500/20"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-white/5 dark:hover:bg-white/5"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {filteredNotifications.length === 0 ? (
                            <div className="py-12 px-6 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-3">
                                <div className="p-3 rounded-full bg-gray-100/50 dark:bg-white/5">
                                    <Bell size={24} className="opacity-50" />
                                </div>
                                <p className="text-sm">No new notifications</p>
                            </div>
                        ) : (
                            <ul className="p-2 space-y-1">
                                <AnimatePresence mode="popLayout">
                                    {filteredNotifications.map((n, i) => (
                                        <motion.li
                                            key={n.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: i * 0.05 }}
                                            layout
                                            className={`relative group p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-black/5 dark:hover:border-white/5 ${!n.read ? "bg-cyan-50/50 dark:bg-cyan-900/10" : ""}`}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icon Container */}
                                                <div className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${!n.read
                                                    ? "bg-white dark:bg-white/10 shadow-sm"
                                                    : "bg-gray-100 dark:bg-white/5 opacity-70"
                                                    }`}>
                                                    {getIcon(n.title)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <p className={`text-sm font-semibold truncate ${!n.read ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>
                                                            {n.title}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                                                        {n.message}
                                                    </p>
                                                </div>

                                                {/* Unread Indicator */}
                                                {!n.read && (
                                                    <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                                )}
                                            </div>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-white/10 bg-gray-50/50 dark:bg-black/20 backdrop-blur-md">
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-center text-xs font-medium text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

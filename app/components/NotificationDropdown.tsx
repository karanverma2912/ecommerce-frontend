import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { notifications } from "@/app/data/notifications";

export function NotificationDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-50"
                >
                    <div className="p-4 max-h-96 overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Notifications</h3>
                        {notifications.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-300">No notifications.</p>
                        ) : (
                            <ul className="space-y-2">
                                {notifications.map((n) => (
                                    <li key={n.id} className="border-b border-gray-200 dark:border-white/10 pb-2 last:border-0">
                                        <p className="font-medium text-gray-900 dark:text-white">{n.title}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-center text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                        Close
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

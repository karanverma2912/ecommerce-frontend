"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User, Search } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 supports-[backdrop-filter]:bg-black/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                                NextGen
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:block flex-1 max-w-lg mx-8">
                        <SearchBar />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <AnimatePresence mode="wait">
                            {user ? (
                                <motion.div
                                    key="user-profile"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-sm font-medium text-gray-300"
                                        >
                                            Hi, {user.first_name || "User"}
                                        </motion.span>
                                        <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                                            {user.first_name?.[0] || "U"}{user.last_name?.[0]}
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="text-sm text-gray-400 hover:text-white transition-colors hover:bg-white/5 px-3 py-1.5 rounded-full"
                                    >
                                        Logout
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="auth-btn"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => setIsAuthOpen(true)}
                                    className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer p-1"
                                >
                                    <span className="sr-only">Profile</span>
                                    <User size={24} />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <button className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer relative">
                            <span className="sr-only">Cart</span>
                            <ShoppingCart size={24} />
                            <span className="absolute -top-1 -right-1 bg-cyan-600 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>
                    </div>

                    {/* Mobile Interactions */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="text-gray-300 hover:text-cyan-400 transition-colors"
                        >
                            <Search size={24} />
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-cyan-400 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar (Expandable) */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b border-white/10 bg-black/95 overflow-hidden"
                    >
                        <div className="p-4">
                            <SearchBar />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-black/95 border-b border-white/10 absolute w-full"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {user ? (
                                <div className="px-3 py-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold">
                                            {user.first_name?.[0] || "U"}{user.last_name?.[0]}
                                        </div>
                                        <div className="text-base font-medium text-white">
                                            {user.first_name || "User"} {user.last_name}
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsAuthOpen(true);
                                    }}
                                    className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                                >
                                    <User size={20} />
                                    Sign In / Sign Up
                                </button>
                            )}
                            <Link
                                href="/cart"
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                            >
                                <ShoppingCart size={20} />
                                Cart
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </nav>
    );
}

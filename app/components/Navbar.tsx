"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Search, Heart, Sun, Moon, Bell } from "lucide-react";
import { NotificationDropdown } from "@/app/components/NotificationDropdown";
import { unreadCount } from "@/app/data/notifications";
import { SearchBar } from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";

import { useRouter } from "next/navigation";


import { useRef } from "react";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";

const API_BASE_URL = "http://localhost:3000/api/v1";

export function Navbar() {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user, isAuthOpen, setIsAuthOpen } = useAuth();
    const { totalItems } = useCart();
    const { wishlistIds } = useWishlist();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const notifRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(notifRef, () => setIsNotifOpen(false));

    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/products" },
        { name: "Categories", href: "/categories" },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-full border border-white/20 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-3xl backdrop-saturate-150 shadow-lg transition-all duration-300 supports-[backdrop-filter]:bg-white/30 dark:supports-[backdrop-filter]:bg-black/30"
        >
            <div className="px-6 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Logo & Links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                            <span className="text-2xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300">
                                <span className="text-gray-900 dark:text-white transition-colors">Next</span>
                                <span className="text-cyan-500">Gen</span>
                            </span>
                        </Link>
                        
                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
                                    onMouseEnter={() => setHoveredLink(link.name)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    {hoveredLink === link.name && (
                                        <motion.span
                                            layoutId="nav-hover"
                                            className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-full -z-10"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-auto justify-center">
                        <Suspense fallback={<div className="h-10 w-full bg-white/5 rounded-full animate-pulse" />}>
                            <SearchBar />
                        </Suspense>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Desktop Icons */}
                        <div className="hidden md:flex items-center gap-2 sm:gap-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleTheme}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (user) {
                                        router.push("/wishlist");
                                    } else {
                                        setIsAuthOpen(true);
                                    }
                                }}
                                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <span className="sr-only">Wishlist</span>
                                <Heart size={20} />
                                {wishlistIds.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-cyan-500 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                        {wishlistIds.length}
                                    </span>
                                )}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (!user) {
                                        setIsAuthOpen(true);
                                    } else {
                                        router.push("/cart");
                                    }
                                }}
                                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <span className="sr-only">Cart</span>
                                <ShoppingCart size={20} />
                                {totalItems > 0 && (
                                    <span className="absolute top-0 right-0 bg-cyan-500 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </motion.button>
                        </div>

                        {/* Mobile & Desktop Icons (Search, Bell, Profile) */}
                        
                        {/* Mobile Search Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                        >
                            <Search size={20} />
                        </motion.button>

                         {/* Notification Bell (Visible on both Mobile & Desktop) */}
                        <div ref={notifRef} className="relative">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={`relative p-2 rounded-full transition-colors ${isNotifOpen ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"}`}
                            >
                                <Bell size={20} className={unreadCount > 0 ? "animate-swing origin-top" : ""} />
                                <AnimatePresence>
                                    {unreadCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center"
                                        >
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center border-2 border-white dark:border-black">
                                                {unreadCount}
                                            </span>
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                        </div>

                        {/* Profile Section */}
                        <AnimatePresence mode="wait">
                            {user ? (
                                <motion.div
                                    key="user-profile"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center gap-3 pl-2 sm:border-l border-gray-200 dark:border-white/10 ml-2"
                                >
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    >
                                        <motion.div 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[2px]"
                                        >
                                            <div className="h-full w-full rounded-full bg-white dark:bg-black overflow-hidden relative border-2 border-transparent">
                                                {user.avatar_url ? (
                                                    <Image
                                                        src={(user.avatar_url.startsWith("http") ? user.avatar_url : `${API_BASE_URL.replace("/api/v1", "")}${user.avatar_url}`)}
                                                        alt="Avatar"
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-xs">
                                                        {(user.first_name?.[0] || "U").toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                        <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[100px]">
                                            {user.first_name || "User"}
                                        </span>
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="auth-btn"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => setIsAuthOpen(true)}
                                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5"
                                >
                                    Log In
                                </motion.button>
                            )}
                        </AnimatePresence>
                        
                         {/* Mobile Auth Icon (Only if not logged in, otherwise Profile avatar shows) */}
                         {!user && (
                             <motion.button
                                 whileHover={{ scale: 1.1 }}
                                 whileTap={{ scale: 0.95 }}
                                 onClick={() => setIsAuthOpen(true)}
                                 className="sm:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                             >
                                 <User size={20} />
                             </motion.button>
                         )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar (Expandable) */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, scale: 0.95 }}
                        animate={{ height: "auto", opacity: 1, scale: 1 }}
                        exit={{ height: 0, opacity: 0, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-3 mx-4 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 md:hidden overflow-hidden"
                    >
                        <Suspense fallback={<div className="h-10 w-full bg-white/5 rounded-full animate-pulse" />}>
                            <SearchBar />
                        </Suspense>
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </motion.nav>
    );
}

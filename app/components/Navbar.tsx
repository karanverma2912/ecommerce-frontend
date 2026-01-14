"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User, Search, Heart } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:3000/api/v1";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user, isAuthOpen, setIsAuthOpen } = useAuth();
    const { totalItems } = useCart();
    const { wishlistIds } = useWishlist();
    const router = useRouter();

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 supports-[backdrop-filter]:bg-black/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex md:grid md:grid-cols-12 items-center justify-between h-16">
                    {/* Logo - Desktop: Col 1-3 */}
                    <div className="flex-shrink-0 md:col-span-3 flex justify-start">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                                NextGen
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    {/* Desktop Search - Desktop: Col 4-9 (Centered) */}
                    <div className="hidden md:flex md:col-span-6 justify-center w-full">
                        <div className="w-full max-w-lg">
                            <Suspense fallback={<div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />}>
                                <SearchBar />
                            </Suspense>
                        </div>
                    </div>

                    {/* Desktop Menu - Desktop: Col 10-12 (Right Aligned) */}
                    <div className="hidden md:flex md:col-span-3 items-center justify-end gap-6">
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
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    >
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-sm font-medium text-gray-300 whitespace-nowrap"
                                        >
                                            Hi, {(user.first_name || "User").length > 15 ? (user.first_name || "User").slice(0, 15) + "..." : (user.first_name || "User")}
                                        </motion.span>
                                        <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)] overflow-hidden relative">
                                            {user.avatar_url ? (
                                                <Image
                                                    src={(user.avatar_url.startsWith("http") ? user.avatar_url : `${API_BASE_URL.replace("/api/v1", "")}${user.avatar_url}`)}
                                                    alt="Avatar"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <>{user.first_name?.[0] || "U"}{user.last_name?.[0]}</>
                                            )}
                                        </div>
                                    </Link>
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

                        <button
                            onClick={() => {
                                if (user) {
                                    router.push("/wishlist");
                                } else {
                                    setIsAuthOpen(true);
                                }
                            }}
                            className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer relative"
                        >
                            <span className="sr-only">Wishlist</span>
                            <Heart size={24} />
                            <span className="absolute -top-1 -right-1 bg-cyan-600 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">
                                {wishlistIds.length}
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                if (!user) {
                                    setIsAuthOpen(true);
                                } else {
                                    router.push("/cart");
                                }
                            }}
                            className="text-gray-300 hover:text-cyan-400 transition-colors cursor-pointer relative"
                        >
                            <span className="sr-only">Cart</span>
                            <ShoppingCart size={24} />
                            <span className="absolute -top-1 -right-1 bg-cyan-600 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">
                                {totalItems}
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
                            <Suspense fallback={<div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />}>
                                <SearchBar />
                            </Suspense>
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
                                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold overflow-hidden relative">
                                                {user.avatar_url ? (
                                                    <Image
                                                        src={(user.avatar_url.startsWith("http") ? user.avatar_url : `${API_BASE_URL.replace("/api/v1", "")}${user.avatar_url}`)}
                                                        alt="Avatar"
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <>{user.first_name?.[0] || "U"}{user.last_name?.[0]}</>
                                                )}
                                            </div>
                                            <div className="text-base font-medium text-white">
                                                {user.first_name || "User"} {user.last_name}
                                            </div>
                                        </div>
                                    </Link>
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
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    if (!user) {
                                        setIsAuthOpen(true);
                                    } else {
                                        router.push("/cart");
                                    }
                                }}
                                className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <ShoppingCart size={20} />
                                Cart
                                <span className="ml-auto bg-cyan-600 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </nav>
    );
}

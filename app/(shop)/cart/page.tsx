"use client";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Loader2 } from "lucide-react";

export default function CartPage() {
    const { items, totalPrice, totalItems, updateQuantity, removeFromCart, loading, processingItems } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [activeAction, setActiveAction] = useState<string | null>(null);

    const handleQuantityUpdate = async (itemId: number, newQuantity: number, action: 'plus' | 'minus') => {
        setActiveAction(`${itemId}-${action}`);
        await updateQuantity(itemId, newQuantity);
        setActiveAction(null);
    };

    const handleRemove = async (itemId: number) => {
        setActiveAction(`${itemId}-delete`);
        await removeFromCart(itemId);
        setActiveAction(null);
    };

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [user, router]);

    if (!user) return null;

    if (loading && items.length === 0) {
        return (
            <div className="h-[calc(100vh-64px)] w-full bg-black text-white flex justify-center items-center mt-16">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Variants for page entry/exit animation
    const pageVariants = {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" as const } }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.main
                key="cart-page"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-[calc(100vh-64px)] bg-black text-white overflow-hidden flex flex-col"
            >
                {/* Fixed Header */}
                <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 border-b border-white/5 bg-black/50 backdrop-blur-xl z-10">
                    <div className="max-w-7xl mx-auto flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-cyan-400">
                                The Quantum Cart
                            </h1>
                            <p className="text-cyan-400/80 text-sm font-mono mt-1 tracking-wider">
                                SYSTEM STATUS: <span className="text-green-400">ONLINE</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-neutral-400 text-sm">Total Units</p>
                            <p className="text-2xl font-mono font-bold text-white">{totalItems}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-12 rounded-[2rem] bg-neutral-900/30 border border-white/5 backdrop-blur-sm"
                            >
                                <div className="w-24 h-24 mx-auto rounded-full bg-white/5 flex items-center justify-center text-gray-600 border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                    <ShoppingBag size={48} />
                                </div>
                                <p className="text-2xl text-neutral-300 font-light mb-2">Subspace Storage Empty</p>
                                <p className="text-neutral-500 mb-8">No quantum entanglements detected in your cart.</p>
                                <Link
                                    href="/"
                                    className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
                                >
                                    <span>Initialize Acquisition</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="h-full grid lg:grid-cols-12 gap-8">
                            {/* Scrollable Product List */}
                            <div className="lg:col-span-8 h-full overflow-y-auto pr-2 custom-scrollbar pb-20">
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" as const }}
                                            className="group relative bg-neutral-900/20 border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:bg-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]"
                                        >
                                            <div className="flex gap-5">
                                                {/* Image */}
                                                <div className="relative w-28 h-28 rounded-xl bg-black/40 overflow-hidden border border-white/10 flex-shrink-0 group-hover:border-cyan-500/50 transition-colors">
                                                    {item.images_urls?.[0] ? (
                                                        <Image
                                                            src={item.images_urls[0]}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                            <ShoppingBag size={24} />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div>
                                                        <div className="flex justify-between items-start gap-4">
                                                            <h3 className="text-lg font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-cyan-400 font-mono font-bold text-lg whitespace-nowrap">
                                                                ₹{Number(item.discount_price || item.price).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <p className="text-gray-500 text-sm mt-1 line-clamp-2 pr-8">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
                                                            <button
                                                                onClick={() => {
                                                                    if (item.cart_quantity > 1) {
                                                                        handleQuantityUpdate(item.id, item.cart_quantity - 1, 'minus');
                                                                    }
                                                                }}
                                                                className={`text-gray-400 hover:text-cyan-400 transition-colors ${item.cart_quantity <= 1 ? "opacity-30 cursor-not-allowed" : ""} ${activeAction === `${item.id}-minus` ? "animate-pulse text-cyan-400" : ""}`}
                                                                disabled={processingItems.has(item.id) || item.cart_quantity <= 1}
                                                            >
                                                                {activeAction === `${item.id}-minus` ? <Loader2 size={14} className="animate-spin" /> : <Minus size={14} />}
                                                            </button>
                                                            <span className="text-sm font-mono text-white w-6 text-center tabular-nums">
                                                                {item.cart_quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQuantityUpdate(item.id, item.cart_quantity + 1, 'plus')}
                                                                className={`text-gray-400 hover:text-cyan-400 transition-colors ${activeAction === `${item.id}-plus` ? "animate-pulse text-cyan-400" : ""}`}
                                                                disabled={processingItems.has(item.id)}
                                                            >
                                                                {activeAction === `${item.id}-plus` ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => handleRemove(item.id)}
                                                            className={`text-gray-600 hover:text-red-400 transition-colors flex items-center gap-2 text-xs font-medium uppercase tracking-wider px-3 py-1.5 hover:bg-red-500/10 rounded-full ${activeAction === `${item.id}-delete` ? "text-red-400 bg-red-500/10" : ""}`}
                                                            disabled={processingItems.has(item.id)}
                                                        >
                                                            {activeAction === `${item.id}-delete` ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                            <span className="hidden sm:inline">{activeAction === `${item.id}-delete` ? "Discarding..." : "Discard"}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Fixed Summary Panel */}
                            <div className="lg:col-span-4 h-full relative">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-neutral-900/30 border border-white/10 rounded-[1.5rem] p-8 backdrop-blur-xl h-fit shadow-2xl"
                                >
                                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                        Deployment Summary
                                    </h2>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-gray-400 text-sm">
                                            <span>Subtotal</span>
                                            <span className="font-mono text-white">₹{Number(totalPrice).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400 text-sm">
                                            <span>Processing Fee</span>
                                            <span className="text-cyan-500 font-mono">0.00</span>
                                        </div>
                                        <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                                            <span className="text-base font-medium text-white">Total Estimate</span>
                                            <span className="text-3xl font-bold text-cyan-400 font-mono tracking-tight">
                                                ₹{Number(totalPrice).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full relative group overflow-hidden rounded-xl bg-cyan-600 p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x" />
                                        <div className="relative bg-black rounded-xl py-5 flex items-center justify-center gap-3 transition-colors group-hover:bg-transparent/20">
                                            <span className="font-bold text-white tracking-widest uppercase text-sm">Initiate Checkout</span>
                                            <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>

                                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-mono">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Quantum Encryption Active
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.main>
        </AnimatePresence >
    );
}

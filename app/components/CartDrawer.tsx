"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import Image from "next/image";

export function CartDrawer() {
    const { items, isCartOpen, setIsCartOpen, totalPrice, totalItems, removeFromCart } = useCart();

    // Backdrop variants
    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    // Drawer variants
    const drawerVariants: Variants = {
        hidden: { x: "100%", transition: { type: "spring", damping: 25, stiffness: 200 } },
        visible: { x: 0, transition: { type: "spring", damping: 25, stiffness: 200 } },
    };

    // Item variants
    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.1 },
        }),
    };
    // Scroll lock and layout shift fix
    useEffect(() => {
        if (isCartOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
        }
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
        };
    }, [isCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-black/40 backdrop-blur-2xl border-l border-white/10 z-[101] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                    <ShoppingBag size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight pb-1">Quantum Cart</h2>
                                    <p className="text-xs text-cyan-400/70 font-mono italic">Syncing with nebula-nexus v2.4</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer border border-transparent hover:border-white/20"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-600 border border-white/10">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <p className="text-gray-400 font-medium">Your subspace storage is empty</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-cyan-400 text-sm hover:underline cursor-pointer"
                                    >
                                        Explore Items
                                    </button>
                                </div>
                            ) : (
                                items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        custom={index}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                    >
                                        <div className="flex gap-4">
                                            {/* Product Image Placeholder with Neon Frame */}
                                            <div className="relative w-20 h-20 rounded-xl bg-black/40 overflow-hidden border border-white/10 flex-shrink-0 group-hover:border-cyan-500/50 transition-colors">
                                                {item.images_urls?.[0] ? (
                                                    <Image
                                                        src={item.images_urls[0]}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                        <ShoppingBag size={24} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none" />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-semibold truncate group-hover:text-cyan-400 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-2 line-clamp-1">{item.description}</p>

                                                <div className="flex items-center justify-between">
                                                    <p className="text-cyan-400 font-mono font-bold">
                                                        ₹{Number(item.discount_price || item.price).toLocaleString()}
                                                    </p>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-3 bg-black/30 border border-white/10 rounded-full px-2 py-1">
                                                        <button
                                                            className="p-1 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-xs font-mono text-white w-4 text-center">
                                                            {item.cart_quantity}
                                                        </span>
                                                        <button
                                                            className="p-1 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-400 active:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer (Summary) */}
                        <div className="p-8 border-t border-white/10 bg-white/5 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal Units</span>
                                    <span className="font-mono">{totalItems} ENTS</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Neural Logic Fee</span>
                                    <span className="font-mono">₹0.00</span>
                                </div>
                                <div className="pt-4 flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-cyan-400/50 uppercase tracking-widest font-mono">Total Credit Requirement</p>
                                        <p className="text-3xl font-bold text-white tracking-tighter">
                                            ₹{Number(totalPrice).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="h-10 w-1 bg-gradient-to-b from-cyan-400 to-transparent rounded-full" />
                                </div>
                            </div>

                            <button className="relative w-full group overflow-hidden rounded-2xl bg-cyan-600 p-[1px] cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x" />
                                <div className="relative bg-black rounded-2xl py-4 flex items-center justify-center gap-3 transition-colors group-hover:bg-transparent">
                                    <span className="font-bold text-white uppercase tracking-widest text-sm">Initiate Checkout</span>
                                    <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <p className="text-[10px] text-center text-gray-500 font-mono uppercase tracking-tighter">
                                Secured via end-to-end quantum encryption
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

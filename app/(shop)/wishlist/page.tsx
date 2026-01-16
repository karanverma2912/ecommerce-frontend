"use client";

import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { ProductCard } from "../../components/ProductCard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
    const { wishlistItems, loading, fetchWishlist } = useWishlist();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    useEffect(() => {
        if (!user) {
            router.push("/");
            // Or open auth modal
        }
    }, [user, router]);

    if (!user) return null;

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 bg-black text-white flex justify-center">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                        My Wishlist
                    </h1>
                    <p className="text-neutral-400 mt-2">
                        {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
                    </p>
                </motion.div>

                {wishlistItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-white/5"
                    >
                        <p className="text-xl text-neutral-400 mb-4">Your wishlist is empty</p>
                        <p className="text-sm text-neutral-500">
                            Explore our collection and find something you love!
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {wishlistItems.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </main>
    );
}

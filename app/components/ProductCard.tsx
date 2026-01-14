"use client";

import { Product } from "@/app/types";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useWishlist } from "../context/WishlistContext";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { user, setIsAuthOpen } = useAuth();
    const { isInWishlist, syncWishlist } = useWishlist();
    const [added, setAdded] = useState(false);

    // Wishlist Logic
    const [isLiked, setIsLiked] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const initialLikeStateRef = useRef<boolean>(false);

    // Sync local state with global context on mount/update
    useEffect(() => {
        const liked = isInWishlist(product.id);
        if (liked !== isLiked) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLiked(liked);
        }
        initialLikeStateRef.current = liked;
    }, [product.id, isInWishlist]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleLikePrototype = () => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }

        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer (Debounce 500ms)
        debounceTimerRef.current = setTimeout(() => {
            // Only sync if final state is different from initial state (or last synced state)
            // But simplify: just sync the final state. Context handles API call.
            syncWishlist(product.id, newIsLiked);
        }, 500);
    };


    const primaryImage = product.images_urls[0] || "https://placehold.co/400x400/png";
    // Fallback image if none

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-colors duration-300 shadow-xl"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-neutral-800">
                <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
                    <button
                        onClick={handleLikePrototype}
                        className={cn("transition-colors p-2 rounded-full hover:bg-white/10", isLiked ? "text-red-500" : "text-white hover:text-red-400")}
                    >
                        <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={async () => {
                            if (!user) {
                                setIsAuthOpen(true);
                                return;
                            }
                            await addToCart(product);
                            setAdded(true);
                            setTimeout(() => setAdded(false), 2000);
                        }}
                        className={cn(
                            "px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300",
                            added ? "bg-green-600 text-white" : "bg-cyan-600 hover:bg-cyan-700 text-white"
                        )}
                    >
                        {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                        {added ? "Added!" : "Add to Cart"}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <h3 className="text-xl font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                    {product.name}
                </h3>
                <p className="text-neutral-400 text-sm line-clamp-2 min-h-[40px]">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        {product.discount_percentage ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">
                                    ₹{Number(product.discount_price).toFixed(2)}
                                </span>
                                <span className="text-sm text-neutral-500 line-through">
                                    ₹{Number(product.price).toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-white">
                                ₹{Number(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className={cn("px-2 py-1 rounded text-xs font-semibold",
                        product.in_stock ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    )}>
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

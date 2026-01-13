"use client";

import { Product } from "@/app/types";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
                    <button className="text-white hover:text-cyan-400 transition-colors">
                        <Heart size={24} />
                    </button>
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors">
                        <ShoppingCart size={16} />
                        Add to Cart
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
                                    ${Number(product.discount_price).toFixed(2)}
                                </span>
                                <span className="text-sm text-neutral-500 line-through">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-white">
                                ${Number(product.price).toFixed(2)}
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

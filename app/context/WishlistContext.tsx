"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Product } from "../types";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
    wishlistIds: number[];
    wishlistItems: Product[];
    loading: boolean;
    isInWishlist: (productId: number) => boolean;
    syncWishlist: (productId: number, isLiked: boolean) => Promise<void>;
    fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:3000/api/v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setLoading(false);
            setWishlistIds([]);
            setWishlistItems([]);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Extract product IDs from the wishlist items
                const ids = data.wishlists.map((item: { product: Product }) => item.product.id);
                const items = data.wishlists.map((item: { product: Product }) => item.product);
                setWishlistIds(ids);
                setWishlistItems(items);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const isInWishlist = useCallback((productId: number) => {
        return wishlistIds.includes(productId);
    }, [wishlistIds]);

    const syncWishlist = useCallback(async (productId: number, isLiked: boolean) => {
        if (!user) return;

        // Optimistic update local state
        if (isLiked) {
            setWishlistIds(prev => [...prev, productId]);
            // Optimistic item add is hard without full product data, skipping items update
        } else {
            setWishlistIds(prev => prev.filter(id => id !== productId));
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
        }

        try {
            const token = localStorage.getItem("token");
            if (isLiked) {
                // Add to wishlist
                await fetch(`${API_BASE_URL}/wishlist`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ product_id: productId }),
                });
            } else {
                // Remove from wishlist
                await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error("Failed to sync wishlist:", error);
            // Revert on error
            if (isLiked) {
                setWishlistIds(prev => prev.filter(id => id !== productId));
            } else {
                setWishlistIds(prev => [...prev, productId]);
                fetchWishlist();
            }
        }
    }, [user, fetchWishlist]);

    return (
        <WishlistContext.Provider value={{
            wishlistIds,
            wishlistItems,
            loading,
            isInWishlist,
            syncWishlist,
            fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}

"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { Product } from "../types";
import { useAuth } from "./AuthContext";

interface CartItem extends Product {
    cart_quantity: number;
}

interface BackendCartItem {
    id: number;
    quantity: number;
    product: Product;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
    totalItems: number;
    totalPrice: number;
    loading: boolean;
    processingItems: Set<number>;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:3000/api/v1";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [processingItems, setProcessingItems] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user } = useAuth();
    const isFirstFetch = useRef(true);

    const fetchCart = useCallback(async () => {
        if (!user) {
            setItems([]);
            return;
        }

        // Initial load only if empty
        if (isFirstFetch.current) setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/cart`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const mappedItems = data.cart_items.map((ci: BackendCartItem) => ({
                    ...ci.product,
                    cart_quantity: ci.quantity,
                }));
                setItems(mappedItems);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setLoading(false);
            isFirstFetch.current = false;
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (product: Product) => {
        if (!user) return;

        setProcessingItems(prev => new Set(prev).add(product.id));
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/cart/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: product.id, quantity: 1 }),
            });

            if (response.ok) {
                await fetchCart();
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setProcessingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }
    };

    const removeFromCart = async (productId: number) => {
        if (!user) return;

        setProcessingItems(prev => new Set(prev).add(productId));
        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            await fetchCart();
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        } finally {
            setProcessingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        if (!user) return;
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        setProcessingItems(prev => new Set(prev).add(productId));
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/cart`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            const cartItem = data.cart_items.find((ci: BackendCartItem) => ci.product.id === productId);

            if (cartItem) {
                await fetch(`${API_BASE_URL}/cart/items/${cartItem.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ quantity }),
                });
                await fetchCart();
            }
        } catch (error) {
            console.error("Failed to update quantity:", error);
        } finally {
            setProcessingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const clearCart = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_BASE_URL}/cart/clear`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            setItems([]);
        } catch (error) {
            console.error("Failed to clear cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalItems = items.reduce((sum, item) => sum + item.cart_quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
        const price = item.discount_price || item.price;
        return sum + Number(price) * item.cart_quantity;
    }, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            fetchCart,
            totalItems,
            totalPrice,
            loading,
            processingItems,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

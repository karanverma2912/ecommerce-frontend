"use client";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <WishlistProvider>
                <Navbar />
                <div className="pt-28 min-h-screen bg-black">
                    {children}
                </div>
                <Footer />
            </WishlistProvider>
        </CartProvider>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/app/types";
import { ProductCard } from "./ProductCard";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaginationMeta {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
}

export function ProductGrid() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch params
    const query = searchParams.get("q") || "";
    const page = searchParams.get("page") || "1";

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            setError(null);

            const baseUrl = "http://localhost:3000/api/v1/products";
            // Determine endpoint based on query
            const endpoint = query
                ? `${baseUrl}/search?q=${encodeURIComponent(query)}&page=${page}`
                : `${baseUrl}?page=${page}`;

            try {
                const res = await fetch(endpoint);
                if (!res.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await res.json();

                // Handle different response structures from index vs search if any
                // Our implementation plan ensured consistency but checking just in case
                setProducts(data.products || []);
                setMeta(data.meta || null);
            } catch (err) {
                console.error(err);
                setError("Failed to load products. Please check your connection.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [query, page]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-red-400">
                {error}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center text-gray-500 min-h-[400px] flex flex-col items-center justify-center gap-4">
                <p>No products found for &quot;{query}&quot;.</p>
                {query && (
                    <button
                        onClick={() => router.push("/")}
                        className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                        Clear search
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination Controls */}
            {meta && meta.total_pages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => handlePageChange(meta.current_page - 1)}
                        disabled={meta.current_page === 1}
                        className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-white"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <span className="text-sm text-gray-600 dark:text-neutral-400">
                        Page <span className="text-gray-900 dark:text-white font-medium">{meta.current_page}</span> of <span className="text-gray-900 dark:text-white font-medium">{meta.total_pages}</span>
                    </span>

                    <button
                        onClick={() => handlePageChange(meta.current_page + 1)}
                        disabled={meta.current_page === meta.total_pages}
                        className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-white"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

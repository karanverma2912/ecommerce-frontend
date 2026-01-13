"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Initialize state from URL param only on first render
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

    // We do NOT sync back from URL to state automatically to avoid overwriting 
    // user input during debounce delays. The input drives the URL, not vice versa 
    // while the user is interacting.

    const handleSearch = useCallback(
        (term: string) => {
            const currentTerm = searchParams.get("q") || "";
            if (term === currentTerm) return;

            const params = new URLSearchParams(searchParams.toString());
            if (term) {
                params.set("q", term);
            } else {
                params.delete("q");
            }
            params.delete("page"); // Reset to page 1 on new search
            router.replace(`/?${params.toString()}`);
        },
        [router, searchParams]
    );

    // Debounce the URL update
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, handleSearch]);

    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black/50 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 sm:text-sm transition-all duration-300"
                placeholder="Search for products..."
            />
        </div>
    );
}

"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="z-[2] bg-gray-100/90 dark:bg-black/90 backdrop-blur-md border-t border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 py-12 px-6 lg:px-8 relative z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold">
                                <span className="text-gray-900 dark:text-white transition-colors">Next</span>
                                <span className="text-cyan-600 dark:text-cyan-400">Gen</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">
                            Experience the future of shopping with NextGen. Curated tech, seamless checkout, and quantum-speed delivery.
                        </p>
                    </div>

                    {/* Company Column - Right Aligned on Desktop */}
                    <div className="md:flex md:justify-end">
                        <div className="text-left md:text-right">
                            <h3 className="text-gray-900 dark:text-white font-bold mb-4 transition-colors">Company</h3>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs transition-colors">
                    <div>
                        &copy; 2026 NextGen Ecommerce. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

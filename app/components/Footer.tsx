"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 text-gray-400 py-12 px-6 lg:px-8 relative z-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold">
                                <span className="text-white">Next</span>
                                <span className="text-cyan-400">Gen</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">
                            Experience the future of shopping with NextGen. Curated tech, seamless checkout, and quantum-speed delivery.
                        </p>
                    </div>

                    {/* Company Column - Right Aligned on Desktop */}
                    <div className="md:flex md:justify-end">
                        <div className="text-left md:text-right">
                            <h3 className="text-white font-bold mb-4">Company</h3>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <div>
                        &copy; 2026 NextGen Ecommerce. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-white transition-colors cursor-pointer">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Server } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-gray-300 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Privacy Policy</h1>
                    <p className="text-cyan-400 text-lg mb-12">Last Updated: January 15, 2026</p>

                    <div className="space-y-12">
                        {/* Introduction */}
                        <section className="bg-neutral-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                            <p className="leading-relaxed">
                                At NextGen Ecommerce (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website nextgen-ecommerce.com and use our services.
                            </p>
                        </section>

                        {/* Data Collection */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Eye className="text-cyan-400" />
                                Information We Collect
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                                    <h3 className="text-white font-semibold mb-2">Personal Data</h3>
                                    <p className="text-sm">Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the site or when you choose to participate in various activities related to the site.</p>
                                </div>
                                <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                                    <h3 className="text-white font-semibold mb-2">Derivative Data</h3>
                                    <p className="text-sm">Information our servers automatically collect when you access the site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the site.</p>
                                </div>
                                <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                                    <h3 className="text-white font-semibold mb-2">Financial Data</h3>
                                    <p className="text-sm">Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</p>
                                </div>
                            </div>
                        </section>

                        {/* Use of Information */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Server className="text-purple-400" />
                                How We Use Your Information
                            </h2>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                                <li>Process your payments and fulfill your orders.</li>
                                <li>Personalize your experience with AI-driven recommendations.</li>
                                <li>Create and manage your account.</li>
                                <li>Send you an email confirmation for your order.</li>
                                <li>Communicate with you about your account or order status.</li>
                                <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                            </ul>
                        </section>

                        {/* Security */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Shield className="text-green-400" />
                                Security of Your Information
                            </h2>
                            <p className="leading-relaxed mb-4">
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                            <p>
                                If you have questions or comments about this Privacy Policy, please contact us at: <br />
                                <span className="text-cyan-400">privacy@nextgen-ecommerce.com</span>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

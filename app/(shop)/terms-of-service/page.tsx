"use client";

import { motion } from "framer-motion";
import { FileText, ShoppingBag, AlertTriangle, Gavel } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-black text-gray-300 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Terms of Service</h1>
                    <p className="text-cyan-400 text-lg mb-12">Last Updated: January 15, 2026</p>

                    <div className="space-y-12">
                        {/* Agreement */}
                        <section className="bg-neutral-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                            <p className="leading-relaxed">
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&ldquo;you&rdquo;) and NextGen Ecommerce (&quot;we,&quot; &quot;us&quot; or &quot;our&quot;), concerning your access to and use of the nextgen-ecommerce.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the &ldquo;Site&rdquo;).
                            </p>
                        </section>

                        {/* Account */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <FileText className="text-cyan-400" />
                                User Representations
                            </h2>
                            <p className="mb-4">By using the Site, you represent and warrant that:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                                <li>You are not a minor in the jurisdiction in which you reside.</li>
                                <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                            </ul>
                        </section>

                        {/* Purchases */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <ShoppingBag className="text-purple-400" />
                                Purchases and Payment
                            </h2>
                            <p className="leading-relaxed mb-4">
                                We accept the following forms of payment: Visa, Mastercard, American Express, Discover, and PayPal. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in U.S. dollars.
                            </p>
                        </section>

                        {/* Prohibited Activities */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <AlertTriangle className="text-red-400" />
                                Prohibited Activities
                            </h2>
                            <p className="mb-4">You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
                            <p>As a user of the Site, you agree not to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 mt-4 text-gray-300">
                                <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                                <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email.</li>
                                <li>Use the Site to advertise or offer to sell goods and services.</li>
                                <li>Engage in unauthorized framing of or linking to the Site.</li>
                            </ul>
                        </section>

                        {/* Governing Law */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Gavel className="text-green-400" />
                                Governing Law
                            </h2>
                            <p className="leading-relaxed">
                                These Terms shall be governed by and defined following the laws of the State of California. NextGen Ecommerce and yourself irrevocably consent that the courts of California shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="border-t border-white/10 pt-8">
                            <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                            <p>
                                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <br />
                                <span className="text-cyan-400">legal@nextgen-ecommerce.com</span>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

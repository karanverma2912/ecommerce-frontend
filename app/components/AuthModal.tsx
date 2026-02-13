"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login, register, verifyOtp, resendOtp, error: authError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // OTP State
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);

    const [localError, setLocalError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightVerify, setHighlightVerify] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('form');
            setIsLogin(true);
            setOtp("");
            setLocalError(null);
            setTimer(30);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setFirstName("");
            setLastName("");
            setHighlightVerify(false);
        }
    }, [isOpen]);

    const handleVerifyEmailClick = async () => {
        if (!email) {
            setLocalError("Please enter your email to verify");
            return;
        }

        setLocalError(null);
        setIsLoading(true);

        try {
            await resendOtp(email);
            setStep('otp');
            setTimer(30);
            setHighlightVerify(false);
        } catch (err: unknown) {
            setLocalError(err instanceof Error ? err.message : "Failed to send verification code");
        } finally {
            setIsLoading(false);
        }
    };

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setIsLoading(true);
        setHighlightVerify(false);

        // Slight artificial delay to show animation if the API is too fast (optional, but good for "feel")
        // await new Promise(resolve => setTimeout(resolve, 500)); 

        try {
            if (isLogin) {
                await login({ email, password });
                onClose();
            } else {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }

                // Register triggers email sending
                await register({ email, password, confirmPassword, firstName, lastName });
                setStep('otp'); // Switch to OTP view
                setTimer(30);   // Start timer
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Authentication failed";
            setLocalError(errorMessage);

            if (errorMessage === "Please verify your email address before logging in.") {
                setHighlightVerify(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setIsLoading(true);

        try {
            await verifyOtp(email, otp);
            onClose(); // Close modal on success
        } catch (err: unknown) {
            setLocalError(err instanceof Error ? err.message : "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setLocalError(null);
        setTimer(30); // Optimistic update
        try {
            await resendOtp(email);
        } catch (err: unknown) {
            setLocalError(err instanceof Error ? err.message : "Failed to resend code");
            setTimer(0); // Revert if failed
        }
    };

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            console.log("AuthModal unmounting");
        };
    }, [isOpen]);

    if (!isOpen) return null;

    if (typeof window === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                {/* Backdrop - Transparent Blur */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                {/* Modal - Glossy Glassmorphism */}
                <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-[101] w-full max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-3xl border border-black/10 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="p-8 pb-0 text-center">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-neutral-400 mb-6">
                            {step === 'otp'
                                ? "Verify Email"
                                : (isLogin ? "Welcome Back" : "Create Account")}
                        </h2>

                        {(localError || authError) && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {localError || authError}
                            </div>
                        )}

                        {step === 'form' && (
                            <>
                                <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl mb-6">
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer duration-200 ${isLogin
                                            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20"
                                            : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                                            }`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer duration-200 ${!isLogin
                                            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20"
                                            : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                                            }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                {/* Google Login Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-white dark:bg-white/10 text-gray-700 dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/20 font-medium py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-6 group"
                                    onClick={() => { /* Placeholder for future Google Auth integration */ }}
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            className="text-[#4285F4]"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            className="text-[#34A853]"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            className="text-[#FBBC05]"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            className="text-[#EA4335]"
                                        />
                                    </svg>
                                    <span>Continue with Google</span>
                                </motion.button>

                                <div className="relative flex items-center gap-4 mb-6">
                                    <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
                                    <span className="text-xs text-gray-400 dark:text-neutral-500 font-medium whitespace-nowrap">
                                        Or continue with email
                                    </span>
                                    <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Form Container */}
                    <div className="p-8 pt-0">
                        <AnimatePresence mode="wait">
                            {step === 'otp' ? (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <p className="text-gray-600 dark:text-neutral-400 text-sm text-center mb-6">
                                        We sent a 6-digit code to <span className="text-gray-900 dark:text-white">{email}</span>.
                                        Enter it below to confirm your account.
                                    </p>
                                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="000000"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-3 text-center text-2xl tracking-[0.5em] text-cyan-600 dark:text-cyan-400 font-mono focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-gray-400 dark:placeholder:text-neutral-700"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading || otp.length !== 6}
                                            className="w-full bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-cyan-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Verify Account"}
                                        </button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={timer > 0}
                                                className={`text-xs ${timer > 0 ? 'text-gray-500 dark:text-neutral-600' : 'text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-white'} transition-colors`}
                                            >
                                                {timer > 0 ? `Resend code in ${timer}s` : "Resend Verification Code"}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <form className="space-y-4" onSubmit={handleSubmit} key="auth-form">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={isLogin ? "login" : "signup"}
                                            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {!isLogin && (
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">First Name</label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                                                            <input
                                                                type="text"
                                                                placeholder="John"
                                                                name="firstName"
                                                                autoComplete="given-name"
                                                                value={firstName}
                                                                onChange={(e) => setFirstName(e.target.value)}
                                                                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-gray-500 dark:placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:black] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Last Name</label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                                                            <input
                                                                type="text"
                                                                placeholder="Doe"
                                                                name="lastName"
                                                                autoComplete="family-name"
                                                                value={lastName}
                                                                onChange={(e) => setLastName(e.target.value)}
                                                                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-gray-500 dark:placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:black] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-2 mb-4">
                                                <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                                                    <input
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        name="email"
                                                        autoComplete="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-gray-500 dark:placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:black] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        name="password"
                                                        autoComplete={isLogin ? "current-password" : "new-password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-10 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-gray-500 dark:placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:black] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-2.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-white transition-colors focus:outline-none"
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {!isLogin && (
                                                <div className="space-y-2 mb-6">
                                                    <label className="text-xs font-medium text-gray-500 dark:text-neutral-400">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            name="confirmPassword"
                                                            autoComplete="new-password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className={`w-full bg-gray-100 dark:bg-white/5 border rounded-lg pl-9 pr-10 py-2 text-sm text-gray-900 dark:text-white focus:outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:black] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white] ${!isLogin && confirmPassword && password !== confirmPassword
                                                                ? "border-red-500/50 focus:border-red-500"
                                                                : "border-gray-200 dark:border-white/10 focus:border-cyan-500/50"
                                                                }`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-2.5 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-white transition-colors focus:outline-none"
                                                        >
                                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                    {!isLogin && confirmPassword && password !== confirmPassword && (
                                                        <p className="text-xs text-red-400 mt-1 ml-1">Passwords do not match</p>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:from-cyan-700 active:to-blue-700 active:scale-95 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-cyan-900/20 transition-all cursor-pointer duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={18} />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    isLogin ? "Sign In" : "Create Account"
                                                )}
                                            </button>
                                        </motion.div>
                                    </AnimatePresence>
                                </form>
                            )}
                        </AnimatePresence>

                        {step === 'form' && (
                            <div className="mt-6 flex flex-col items-center gap-2">
                                <p className="text-center text-xs text-gray-500 dark:text-neutral-500">
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                                    >
                                        {isLogin ? "Sign up" : "Sign in"}
                                    </button>
                                </p>
                                <AnimatePresence>
                                    {(highlightVerify || isLogin) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-center text-xs text-gray-500 dark:text-neutral-500 mt-2">
                                                Status not verified?{" "}
                                                <button
                                                    onClick={handleVerifyEmailClick}
                                                    className={`font-medium transition-all duration-300 cursor-pointer ${highlightVerify
                                                        ? "text-rose-600 dark:text-rose-400 animate-pulse font-bold drop-shadow-[0_0_8px_rgba(225,29,72,0.5)]"
                                                        : "text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300"
                                                        }`}
                                                >
                                                    Verify Email
                                                </button>
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}

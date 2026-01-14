"use client";

import { useState, useEffect } from "react";
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
        }
    }, [isOpen]);

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
            setLocalError(err instanceof Error ? err.message : "Authentication failed");
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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] h-screen w-screen flex items-center justify-center p-4">
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
                    className="relative w-full max-w-md bg-neutral-900/60 backdrop-blur-3xl border border-white/10 ring-1 ring-white/5 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-neutral-400 hover:text-cyan-400 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="p-8 pb-0 text-center">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 mb-6">
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
                            <div className="flex p-1 bg-white/5 rounded-xl">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer duration-200 ${isLogin
                                        ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20"
                                        : "text-neutral-400 hover:text-white"
                                        }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer duration-200 ${!isLogin
                                        ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20"
                                        : "text-neutral-400 hover:text-white"
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Form Container */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {step === 'otp' ? (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <p className="text-neutral-400 text-sm text-center mb-6">
                                        We sent a 6-digit code to <span className="text-white">{email}</span>.
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
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 text-center text-2xl tracking-[0.5em] text-cyan-400 font-mono focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-neutral-700"
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
                                                className={`text-xs ${timer > 0 ? 'text-neutral-600' : 'text-cyan-400 hover:text-white'} transition-colors`}
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
                                                        <label className="text-xs font-medium text-neutral-400">First Name</label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                                                            <input
                                                                type="text"
                                                                placeholder="John"
                                                                name="firstName"
                                                                autoComplete="given-name"
                                                                value={firstName}
                                                                onChange={(e) => setFirstName(e.target.value)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-medium text-neutral-400">Last Name</label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                                                            <input
                                                                type="text"
                                                                placeholder="Doe"
                                                                name="lastName"
                                                                autoComplete="family-name"
                                                                value={lastName}
                                                                onChange={(e) => setLastName(e.target.value)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-2 mb-4">
                                                <label className="text-xs font-medium text-neutral-400">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                                                    <input
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        name="email"
                                                        autoComplete="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <label className="text-xs font-medium text-neutral-400">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        name="password"
                                                        autoComplete={isLogin ? "current-password" : "new-password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-10 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-2.5 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {!isLogin && (
                                                <div className="space-y-2 mb-6">
                                                    <label className="text-xs font-medium text-neutral-400">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            name="confirmPassword"
                                                            autoComplete="new-password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className={`w-full bg-white/5 border rounded-lg pl-9 pr-10 py-2 text-sm text-white focus:outline-none transition-colors placeholder:text-neutral-600 [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white] ${!isLogin && confirmPassword && password !== confirmPassword
                                                                ? "border-red-500/50 focus:border-red-500"
                                                                : "border-white/10 focus:border-cyan-500/50"
                                                                }`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-2.5 text-neutral-500 hover:text-white transition-colors focus:outline-none"
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
                            <p className="mt-6 text-center text-xs text-neutral-500">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                                >
                                    {isLogin ? "Sign up" : "Sign in"}
                                </button>
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

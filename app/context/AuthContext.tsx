"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    // Add other fields as needed
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<any>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check for existing token and user on mount
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = async (data: any) => {
        setError(null);
        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Login failed");
            }

            // Save to local storage
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            setUser(result.user);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const register = async (data: any) => {
        setError(null);
        try {
            // Rails expects user: { ... } wrapper
            const payload = {
                user: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.confirmPassword
                }
            };

            const response = await fetch("http://localhost:3000/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.errors ? result.errors.join(", ") : "Registration failed");
            }

            // Registration successful (OTP sent), do NOT auto-login yet
            return result;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const verifyOtp = async (email: string, otp: string) => {
        setError(null);
        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Verification failed");
            }

            // Save to local storage (Login successful)
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            setUser(result.user);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const resendOtp = async (email: string) => {
        setError(null);
        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/resend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Resend failed");
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, resendOtp, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

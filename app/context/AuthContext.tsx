"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string | null;
    // Add other fields as needed
}

interface LoginData {
    email?: string;
    password?: string;
}

interface RegisterData {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
    logout: () => void;
    error: string | null;
    isAuthOpen: boolean;
    setIsAuthOpen: (isOpen: boolean) => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

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

    const updateUser = (userData: Partial<User>) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const newUser = { ...prevUser, ...userData };
            localStorage.setItem("user", JSON.stringify(newUser));
            return newUser;
        });
    };

    const login = async (data: LoginData) => {
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
            throw err;
        }
    };

    const register = async (data: RegisterData) => {
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
            // return result;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            verifyOtp,
            resendOtp,
            logout,
            error,
            isAuthOpen,
            setIsAuthOpen,
            updateUser
        }}>
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

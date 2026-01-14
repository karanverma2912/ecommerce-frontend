"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogOut, Save, Camera, User as UserIcon, MapPin, Mail, Phone, Globe } from "lucide-react";
import toast from "react-hot-toast";

interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    avatar_url: string | null;
}

const API_BASE_URL = "http://localhost:3000/api/v1";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile>({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        avatar_url: null,
    });
    const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial Fetch
    useEffect(() => {
        if (!user) {
            router.push("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_BASE_URL}/user`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const userProfile = {
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        address: data.address || "",
                        city: data.city || "",
                        state: data.state || "",
                        zip_code: data.zip_code || "",
                        country: data.country || "",
                        avatar_url: data.avatar_url,
                    };
                    setProfile(userProfile);
                    setInitialProfile(userProfile);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        const loadingToast = toast.loading("Uploading avatar...");

        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/user`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                // Append timestamp to force refresh
                const newAvatarUrl = `${data.avatar_url}?v=${Date.now()}`;

                const updatedProfile = { ...profile, avatar_url: newAvatarUrl };
                setProfile(updatedProfile);

                // Update initialProfile as well since the avatar is effectively "saved"
                if (initialProfile) {
                    setInitialProfile({ ...initialProfile, avatar_url: newAvatarUrl });
                }

                toast.success("Avatar updated successfully", { id: loadingToast });
            } else {
                const errorData = await response.json();
                const errorMessage = Array.isArray(errorData.errors) ? errorData.errors.join(", ") : "Failed to upload avatar";
                toast.error(errorMessage, { id: loadingToast });
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("Error uploading avatar. Please try again.", { id: loadingToast });
        } finally {
            setSaving(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const loadingToast = toast.loading("Saving changes...");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/user`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    phone: profile.phone,
                    address: profile.address,
                    city: profile.city,
                    state: profile.state,
                    zip_code: profile.zip_code,
                    country: profile.country,
                })
            });

            if (response.ok) {
                const data = await response.json();
                const newProfile = { ...profile, ...data };
                setProfile(newProfile);
                setInitialProfile(newProfile);
                toast.success("Profile updated successfully", { id: loadingToast });
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.errors ? (Array.isArray(errorData.errors) ? errorData.errors.join(", ") : errorData.errors) : "Failed to update profile";
                toast.error(errorMessage, { id: loadingToast });
            }
        } catch (error) {
            console.error("Update error", error);
            toast.error("Network error. Please try again.", { id: loadingToast });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success("Disconnected successfully");
        router.push("/");
    };

    // Check if profile is modified (ignoring avatar_url for dirty check as it's separate)
    const isModified = initialProfile && JSON.stringify({ ...profile, avatar_url: null }) !== JSON.stringify({ ...initialProfile, avatar_url: null });

    const getAvatarUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        // Construct absolute URL from relative path
        const origin = API_BASE_URL.replace("/api/v1", "");
        return `${origin}${url}`;
    };

    if (!user) return null;

    if (loading) {
        return (
            <div className="h-[calc(100vh-64px)] w-full bg-black text-white flex justify-center items-center mt-16">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[calc(100vh-64px)] bg-black text-white pt-24 px-4 sm:px-6 lg:px-8 pb-12"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] bg-neutral-900 flex items-center justify-center relative">
                            {profile.avatar_url ? (
                                <Image
                                    src={getAvatarUrl(profile.avatar_url) || ""}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                    onError={() => setProfile(prev => ({ ...prev, avatar_url: null }))} // Fallback on error
                                />
                            ) : (
                                <span className="text-4xl font-bold text-cyan-400 select-none">
                                    {(profile.first_name?.[0] || "U").toUpperCase()}{(profile.last_name?.[0] || "").toUpperCase()}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleAvatarClick}
                            className="absolute bottom-0 right-0 p-2 bg-cyan-600 rounded-full text-white shadow-lg hover:bg-cyan-500 transition-colors border-2 border-black group-hover:scale-110 cursor-pointer"
                        >
                            <Camera size={16} />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    {/* Basic Info & Logout */}
                    <div className="flex-1 w-full flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                                {profile.first_name || "User"} {profile.last_name}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                <Mail size={16} />
                                <span className="font-mono">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-cyan-400/80 text-sm">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                QUANTUM ID: {user?.id?.toString().padStart(8, '0') || "UNKNOWN"}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/50 cursor-pointer"
                        >
                            <LogOut size={18} />
                            <span>Disconnect</span>
                        </button>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <UserIcon size={20} className="text-cyan-400" />
                        Personal Data
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={profile.first_name}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={profile.last_name}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                                <Phone size={14} /> Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>

                        <div className="md:col-span-2 border-t border-white/5 my-2 pt-4">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-purple-400" />
                                Shipping Coordinates
                            </h3>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm text-gray-400 font-medium">Address Line</label>
                            <input
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium">City</label>
                            <input
                                type="text"
                                name="city"
                                value={profile.city}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium">State / Province</label>
                            <input
                                type="text"
                                name="state"
                                value={profile.state}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium">Zip / Postal Code</label>
                            <input
                                type="text"
                                name="zip_code"
                                value={profile.zip_code}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                                <Globe size={14} /> Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={profile.country}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>

                        <div className="md:col-span-2 pt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving || !isModified}
                                className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save Modifications</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

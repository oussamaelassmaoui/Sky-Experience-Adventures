'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function AdminLogin({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data && response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data.user));
                router.push(`/${lang}/admin`);
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Image & Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
                <Image
                    src="/images/balloon-landscape.webp"
                    alt="Sky Experience Balloons"
                    fill
                    className="object-cover opacity-60"
                    priority
                    sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />

                <div className="relative z-10 flex flex-col justify-end p-16 pb-24 h-full text-white">
                    <h1 className="text-5xl font-playfair font-bold mb-6 leading-tight">
                        Elevate Your <br />
                        <span className="text-[#C04000]">Management</span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                        Welcome to the Sky Experience control center. Manage flights, reservations, and create unforgettable memories for our guests.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FDFBF7]">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">

                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <div className="inline-block p-3 rounded-full bg-orange-100 mb-6">
                            <Image
                                src="/images/logo.webp"
                                alt="Sky Experience Logo"
                                width={48}
                                height={48}
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <h2 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">
                            Admin Portal
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Please sign in to access your dashboard.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 text-red-600 animate-in shake">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#C04000] transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#C04000] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 shadow-sm"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#C04000] transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#C04000] focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#C04000] to-[#D84A1B] hover:to-[#B03A00] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 text-center text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Sky Experience. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}

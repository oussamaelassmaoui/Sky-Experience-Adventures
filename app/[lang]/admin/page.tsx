'use client';

import React, { useEffect, useState, use } from 'react';
import { Users, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import api from '@/services/api';
import PriceDisplay from '@/components/PriceDisplay';

interface DashboardStats {
    totalRevenue: number;
    totalFlights: number;
    totalReservations: number;
    pendingBookings: number;
    revenueGrowth: number;
    flightsGrowth: number;
    reservationsGrowth: number;
    recentBookings: any[];
}

export default function AdminDashboard({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/overview');
                // Backend returns { stats: {...}, recentBookings: [...] } 
                // We need to map this correctly
                setStats({
                    ...response.data.stats,
                    recentBookings: response.data.recentReservations
                });
            } catch (err: any) {
                console.error('Error fetching dashboard stats:', err);
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#C04000]/20 border-t-[#C04000] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
                <h3 className="text-red-800 font-bold mb-2">Error Loading Dashboard</h3>
                <p className="text-red-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-white border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, Admin</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={<PriceDisplay amount={stats?.totalRevenue || 0} showSymbol={true} />}
                    icon={DollarSign}
                    trend={`+${stats?.revenueGrowth || 0}%`}
                    color="text-green-600"
                    bgColor="bg-green-100/50"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats?.totalReservations?.toString() || '0'}
                    icon={Calendar}
                    trend={`+${stats?.reservationsGrowth || 0}%`}
                    color="text-blue-600"
                    bgColor="bg-blue-100/50"
                />
                <StatCard
                    title="Pending Requests"
                    value={stats?.pendingBookings?.toString() || '0'}
                    icon={Users}
                    color="text-orange-600"
                    bgColor="bg-orange-100/50"
                />
                <StatCard
                    title="Growth Rate"
                    value={`${stats?.revenueGrowth || 0}%`}
                    icon={TrendingUp}
                    color="text-purple-600"
                    bgColor="bg-purple-100/50"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-gray-800">Recent Bookings</h2>
                    <button className="text-[#C04000] text-sm font-semibold hover:underline">View All</button>
                </div>

                {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Flight</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentBookings.map((booking: any) => (
                                    <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{booking.fullName || 'Guest'}</div>
                                            <div className="text-xs text-gray-500">{booking.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {booking.flight?.title || 'Unknown Flight'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(booking.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <PriceDisplay amount={booking.total} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'}
                                            `}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        No recent bookings found.
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, color, bgColor }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bgColor} ${color}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        {trend} <TrendingUp size={12} />
                    </span>
                )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
    );
}

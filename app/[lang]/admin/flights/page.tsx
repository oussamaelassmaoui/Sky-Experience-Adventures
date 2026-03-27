'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, MoreVertical, AlertCircle } from 'lucide-react';
import api from '@/services/api';

interface Flight {
    _id: string;
    title: string;
    price: number;
    category: string;
    mainImage: string;
    rating?: number;
}

export default function FlightsList({ params }: { params: Promise<{ lang: string }> }) {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { lang } = use(params);

    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await api.get('/flights');
            setFlights(response.data.flights || []);
        } catch (err) {
            console.error('Error fetching flights:', err);
            setError('Failed to load flights.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this flight?')) return;

        try {
            await api.delete(`/flights/${id}`);
            setFlights(flights.filter(f => f._id !== id));
        } catch (err) {
            console.error('Error deleting flight:', err);
            alert('Failed to delete flight.');
        }
    };

    const filteredFlights = flights.filter(flight =>
        flight.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#C04000]/20 border-t-[#C04000] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Flights Management</h1>
                    <p className="text-gray-500">Manage your hot air balloon packages</p>
                </div>
                <Link
                    href={`/${lang}/admin/flights/new`}
                    className="bg-[#C04000] hover:bg-[#a33600] text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-orange-900/20"
                >
                    <Plus size={20} />
                    Add New Flight
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search flights..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#C04000] focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                </div>
            </div>

            {/* Flights Grid/Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 w-20">Image</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredFlights.length > 0 ? (
                                filteredFlights.map((flight) => (
                                    <tr key={flight._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="w-16 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                                                {flight.mainImage ? (
                                                    <Image
                                                        src={flight.mainImage}
                                                        alt={flight.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 font-medium text-gray-900">
                                            {flight.title}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                                                {flight.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 font-semibold text-gray-900">
                                            ${flight.price}
                                        </td>
                                        <td className="px-6 py-3 text-gray-600">
                                            {flight.rating || 0} / 5
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/${lang}/admin/flights/${flight._id}`}
                                                    className="p-2 text-gray-500 hover:text-[#C04000] hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(flight._id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        {searchTerm ? 'No flights found matching your search.' : 'No flights created yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

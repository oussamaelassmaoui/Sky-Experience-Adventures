'use client';

import React, { useEffect, useState, use } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle, XCircle, Clock, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import api from '@/services/api';
import PriceDisplay from '@/components/PriceDisplay';

interface Reservation {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    pickUpLocation: string;
    date: string;
    total: number;
    travelers: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    flight: {
        title: string;
        price: number;
    } | null;
}

export default function ReservationsList({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Status update loading state per item
    const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await api.get('/reservations');
            setReservations(response.data);
        } catch (err) {
            console.error('Error fetching reservations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingStatus(prev => ({ ...prev, [id]: true }));
        try {
            await api.patch(`/reservations/${id}/status`, { status: newStatus });
            // Optimistic update
            setReservations(prev => prev.map(res =>
                res._id === id ? { ...res, status: newStatus as any } : res
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status.');
        } finally {
            setUpdatingStatus(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this reservation?')) return;

        try {
            await api.delete(`/reservations/${id}`);
            setReservations(prev => prev.filter(res => res._id !== id));
        } catch (err) {
            console.error('Error deleting reservation:', err);
            alert('Failed to delete reservation.');
        }
    };

    const filteredReservations = reservations.filter(res => {
        const matchesSearch =
            res.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res._id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

        // Date filtering
        let matchesDate = true;
        if (startDate || endDate) {
            const resDate = new Date(res.date);
            resDate.setHours(0, 0, 0, 0); // Normalize to midnight

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                matchesDate = resDate >= start && resDate <= end;
            } else if (startDate) {
                const start = new Date(startDate);
                matchesDate = resDate >= start;
            } else if (endDate) {
                const end = new Date(endDate);
                matchesDate = resDate <= end;
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#C04000]" size={40} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
                    <p className="text-gray-500">Manage bookings and customer requests</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#C04000] focus:ring-2 focus:ring-orange-100 outline-none"
                    />
                </div>

                {/* Date Range Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C04000] focus:ring-2 focus:ring-orange-100 outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#C04000] focus:ring-2 focus:ring-orange-100 outline-none"
                        />
                    </div>
                    {(startDate || endDate) && (
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                }}
                                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors whitespace-nowrap"
                            >
                                Clear Dates
                            </button>
                        </div>
                    )}
                </div>

                {/* Status Filters */}
                <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${statusFilter === status
                                ? 'bg-[#1a2632] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reservations List */}
            <div className="space-y-4">
                {filteredReservations.length > 0 ? (
                    filteredReservations.map((res) => (
                        <div key={res._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col lg:flex-row gap-6 hover:shadow-md transition-shadow">

                            {/* Main Info */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{res.fullName}</h3>
                                        <p className="text-sm text-gray-500">ID: {res._id}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(res.status)}`}>
                                        {res.status}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                                    <div className="flex items-center gap-2" title="Email">
                                        <Mail size={16} /> {res.email}
                                    </div>
                                    {res.phoneNumber && (
                                        <div className="flex items-center gap-2" title="Phone">
                                            <Phone size={16} /> {res.phoneNumber}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2" title="Pickup Location">
                                        <MapPin size={16} /> {res.pickUpLocation}
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4 space-y-2 text-sm border border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Flight:</span>
                                    <span className="font-medium text-gray-900 text-right">{res.flight?.title || 'Unknown Flight'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(res.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Travelers:</span>
                                    <span className="font-medium text-gray-900">{res.travelers} People</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-gray-900 font-bold">Total:</span>
                                    <span className="font-bold text-[#C04000]">
                                        <PriceDisplay amount={res.total} />
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex lg:flex-col justify-end gap-2 lg:border-l lg:border-gray-100 lg:pl-6">
                                <label className="text-xs font-semibold text-gray-500 lg:mb-1">Update Status</label>
                                <div className="relative">
                                    <select
                                        value={res.status}
                                        onChange={(e) => handleStatusUpdate(res._id, e.target.value)}
                                        disabled={updatingStatus[res._id]}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:ring-2 focus:ring-orange-100 outline-none disabled:opacity-50"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {updatingStatus[res._id] && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <Loader2 size={16} className="animate-spin text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleDelete(res._id)}
                                    className="mt-auto p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    title="Delete Reservation"
                                >
                                    <Trash2 size={18} />
                                    <span className="lg:hidden text-sm">Delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No reservations found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

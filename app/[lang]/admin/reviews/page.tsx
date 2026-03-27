'use client';

import React, { useState, useEffect, use } from 'react';
import {
    MessageSquare,
    Star,
    Trash2,
    CheckCircle,
    XCircle,
    Plus,
    Loader2,
    Home,
    Plane,
    Edit2
} from 'lucide-react';
import api from '@/services/api';

interface Flight {
    _id: string;
    title: string;
}

interface Review {
    _id: string;
    name: string;
    rating: number;
    text: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    avatar?: string;
    showOnHome: boolean;
    flightId?: { _id: string; title: string } | null;
}

export default function ReviewsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        rating: 5,
        text: '',
        date: new Date().toISOString().split('T')[0],
        status: 'approved',
        showOnHome: false,
        flightId: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reviewsRes, flightsRes] = await Promise.all([
                api.get('/reviews?limit=100'),
                api.get('/flights')
            ]);
            // Safely extract data based on API response structure
            setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : reviewsRes.data.reviews || []);
            setFlights(Array.isArray(flightsRes.data) ? flightsRes.data : flightsRes.data.flights || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/reviews/${id}/status`, { status: newStatus });
            setReviews(reviews.map(r =>
                r._id === id ? { ...r, status: newStatus as any } : r
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        }
    };

    const handleToggleHome = async (review: Review) => {
        try {
            const newShowOnHome = !review.showOnHome;
            await api.patch(`/reviews/${review._id}/status`, { showOnHome: newShowOnHome });
            setReviews(reviews.map(r =>
                r._id === review._id ? { ...r, showOnHome: newShowOnHome } : r
            ));
        } catch (error) {
            console.error('Failed to update home status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
        } catch (error) {
            console.error('Failed to delete review:', error);
            alert('Failed to delete review');
        }
    };

    const openModal = (review?: Review) => {
        if (review) {
            setEditingReview(review);
            setFormData({
                name: review.name,
                rating: review.rating,
                text: review.text,
                date: new Date(review.date).toISOString().split('T')[0],
                status: review.status,
                showOnHome: review.showOnHome || false,
                flightId: review.flightId?._id || ''
            });
        } else {
            setEditingReview(null);
            setFormData({
                name: '',
                rating: 5,
                text: '',
                date: new Date().toISOString().split('T')[0],
                status: 'approved',
                showOnHome: false,
                flightId: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            // Prepare payload - convert empty flightId to null
            const payload = {
                ...formData,
                flightId: formData.flightId || null
            };

            if (editingReview) {
                // Update
                const res = await api.patch(`/reviews/${editingReview._id}/status`, payload);
                // Need to re-fetch to get populated flight info correctly or manually update state logic
                // For simplicity, re-fetching all or updating list with response
                // Since response returns populated, we can use it.
            } else {
                // Create
                await api.post('/reviews', payload);
            }

            await fetchData(); // Refresh list to ensure consistency
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save review:', error);
            alert('Failed to save review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="text-[#C04000]" />
                        Reviews Management
                    </h1>
                    <p className="text-gray-500">Manage reviews, assign to flights, or highlight on home page</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C04000] text-white rounded-lg hover:bg-[#A03000] transition-colors shadow-sm font-medium"
                >
                    <Plus size={18} />
                    Add Manual Review
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader2 className="animate-spin" size={32} />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No reviews found. Click "Add Manual Review" to create one.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Author & Rating</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 w-1/4">Comment</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-center">Home</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Assigned Flight</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{review.name}</div>
                                            <div className="flex text-yellow-400 my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        fill={i < review.rating ? "currentColor" : "none"}
                                                        className={i < review.rating ? "" : "text-gray-300"}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(review.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <p className="line-clamp-2 text-xs leading-relaxed" title={review.text}>{review.text}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleHome(review)}
                                                className={`p-2 rounded-full transition-colors ${review.showOnHome ? 'bg-orange-100 text-[#C04000]' : 'text-gray-300 hover:bg-gray-100'}`}
                                                title={review.showOnHome ? "Shown on Home" : "Hidden from Home"}
                                            >
                                                <Home size={18} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            {review.flightId ? (
                                                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                                                    <Plane size={14} />
                                                    <span className="text-xs font-medium truncate max-w-[150px]">{review.flightId.title}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">General Review</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={review.status}
                                                onChange={(e) => handleStatusChange(review._id, e.target.value)}
                                                className={`text-xs font-medium px-2 py-1 rounded-full border-none outline-none cursor-pointer
                                                    ${review.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(review)}
                                                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingReview ? 'Edit Review' : 'Add New Review'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C04000] outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <select
                                        value={formData.rating}
                                        onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C04000] outline-none"
                                    >
                                        {[5, 4, 3, 2, 1].map(num => (
                                            <option key={num} value={num}>{num} Stars</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C04000] outline-none"
                                    />
                                </div>
                            </div>

                            {/* New Fields: Home & Flight Assignment */}
                            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Visibility & Assignment</h4>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, showOnHome: !formData.showOnHome })}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.showOnHome ? 'bg-[#C04000]' : 'bg-gray-200'}`}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.showOnHome ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                    <span className="text-sm text-gray-700">Show on Home Page (Testimonials)</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Flight (Optional)</label>
                                    <select
                                        value={formData.flightId}
                                        onChange={e => setFormData({ ...formData, flightId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C04000] outline-none text-sm"
                                    >
                                        <option value="">-- General Review (Not Assigned) --</option>
                                        {flights.map(flight => (
                                            <option key={flight._id} value={flight._id}>
                                                {flight.title}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Assigned reviews appear on the specific flight detail page.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.text}
                                    onChange={e => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C04000] outline-none resize-none"
                                />
                            </div>
                        </form>

                        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-6 py-2 bg-[#C04000] text-white rounded-lg hover:bg-[#A03000] font-bold flex items-center gap-2 disabled:opacity-70"
                            >
                                {submitting && <Loader2 className="animate-spin" size={18} />}
                                {editingReview ? 'Update Review' : 'Save Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

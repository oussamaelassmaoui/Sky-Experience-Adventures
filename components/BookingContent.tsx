'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, AlertCircle, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import BookingProcessContent from './BookingProcessContent';
import PriceDisplay from './PriceDisplay';

// Define Flight interface (mirroring what's needed)
interface Flight {
    _id: string;
    id?: string; // Handle both
    title: string;
    price: number;
    mainImage: string;
    category: string;
    rating?: number;
    duration?: string;
    description?: string;
}

interface BookingContentProps {
    lang: string;
    dict: any;
}

export default function BookingContent({ lang, dict }: BookingContentProps) {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

    const t = dict.booking;

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/flights`);
                // Fix: Correctly extract flights array
                const flightsData = response.data.flights || response.data || [];

                // Filter active flights and normalize
                const activeFlights = Array.isArray(flightsData)
                    ? flightsData.map((f: any) => ({
                        ...f,
                        _id: f._id || f.id
                    }))
                    : [];

                setFlights(activeFlights);
            } catch (err) {
                console.error('Error fetching flights:', err);
                setError(t.error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [t]);

    // If a flight is selected, render the Booking Process
    if (selectedFlightId) {
        return (
            <div className="min-h-screen bg-gray-50 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-sky-900 text-white py-4 px-4 shadow-md sticky top-0 z-40">
                    <div className="container mx-auto">
                        <button
                            onClick={() => setSelectedFlightId(null)}
                            className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors font-medium text-sm md:text-base"
                        >
                            <ChevronLeft size={20} />
                            {dict.flights_page.filters.reset_all || "Choose another flight"}
                        </button>
                    </div>
                </div>
                <BookingProcessContent id={selectedFlightId} lang={lang} dict={dict} />
            </div>
        );
    }

    // Default View: Flight Selection (Step 1)
    return (
        <main className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-sky-900 pt-32 pb-16 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{t.title || "Start Your Journey"}</h1>
                    <p className="text-xl text-sky-200 max-w-2xl mx-auto font-light">
                        {t.subtitle || "Select an experience below to begin your reservation"}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-10 relative z-20 pb-24">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl shadow-sm max-w-4xl mx-auto flex items-center">
                        <AlertCircle className="text-red-500 mr-3" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                        <p className="text-gray-500 font-medium">{t.loading}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {flights.map((flight, index) => (
                            <motion.div
                                key={flight._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col border border-gray-100 cursor-pointer"
                                onClick={() => setSelectedFlightId(flight._id)}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={flight.mainImage?.startsWith('http') ? flight.mainImage : `/images/${flight.mainImage || 'one.jpg'}`}
                                        alt={flight.title || "Flight Experience"}
                                        fill
                                        priority={index < 6}
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-sky-900 shadow-sm uppercase tracking-wide border border-white/20">
                                        {flight.category || "Experience"}
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
                                        <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-orange-200 transition-colors">{flight.title}</h3>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded text-xs">
                                            <Star size={12} className="mr-1 fill-current" />
                                            {flight.rating || 4.9}
                                        </div>
                                        <span className="text-gray-400 text-xs">•</span>
                                        <span className="text-gray-500 text-xs">{flight.duration || '60 min'}</span>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                                        {flight.description || t.experience}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                        <div className="text-xl font-bold text-sky-900">
                                            <PriceDisplay amount={flight.price} />
                                        </div>
                                        <button
                                            className="flex items-center gap-2 bg-gradient-to-r from-sky-900 to-sky-800 hover:from-orange-600 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-md group-hover:shadow-lg"
                                        >
                                            {t.book_button || "Select"} <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

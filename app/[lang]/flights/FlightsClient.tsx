'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';
import { useSearchParams } from 'next/navigation';
import SuggestionCard from '@/components/SuggestionCard';
import { getActiveFlights, Flight } from '@/app/data/flights';
import { SlidersHorizontal, X } from 'lucide-react';
import PriceDisplay from '@/components/PriceDisplay';

interface FlightsClientProps {
    lang: string;
    dict: any;
}

export default function FlightsClient({ lang, dict }: FlightsClientProps) {
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedDestination, setSelectedDestination] = useState<string>('all');
    const [selectedTourType, setSelectedTourType] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 600]);
    const [sortBy, setSortBy] = useState<string>('title');
    const [showFilters, setShowFilters] = useState(false);

    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch flights from API
    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/flights`);
                if (!response.ok) {
                    throw new Error('Failed to fetch flights');
                }
                const data = await response.json();

                // The API returns { success: true, flights: [...] }
                const flightsArray = data.flights || [];

                // Map _id to id if necessary and ensure status is active
                const activeFlights = flightsArray
                    .filter((f: any) => f.status === 'active')
                    .map((f: any) => ({
                        ...f,
                        id: f._id || f.id,
                        image: f.mainImage || f.image // Ensure main image property match
                    }));

                setFlights(activeFlights);
            } catch (err) {
                console.error('Error fetching flights:', err);
                setError('Failed to load flights.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    // Get active flights from STATE instead of static file
    // Helper to get localized flight content
    const getLocalizedFlight = (flight: Flight) => ({
        ...flight,
        title: lang === 'fr' ? flight.title_fr || flight.title : flight.title,
        description: lang === 'fr' ? flight.description_fr || flight.description : flight.description,
        tourType: flight.tourType,
        destination: flight.destination,
    });

    // Apply URL query parameters on mount
    useEffect(() => {
        if (loading || flights.length === 0) return;

        const destination = searchParams.get('destination');
        const activity = searchParams.get('activity');

        if (destination) {
            setSelectedDestination(destination);
        }

        if (activity) {
            const matchingFlight = flights.find(f => f.title === activity);
            if (matchingFlight) {
                setSelectedDestination(matchingFlight.destination);
                setSelectedTourType(matchingFlight.tourType);
            }
        }
    }, [searchParams, flights, loading]);

    // Extract unique values for filters from STATE
    const destinations = useMemo(() => {
        const unique = Array.from(new Set(flights.map(f => f.destination)));
        return unique.sort();
    }, [flights]);

    const tourTypes = useMemo(() => {
        const unique = Array.from(new Set(flights.map(f => f.tourType)));
        return unique.sort();
    }, [flights]);

    // Filter and sort flights
    const filteredFlights = useMemo(() => {
        let filtered = flights
            .map(getLocalizedFlight)
            .filter(flight => {
                const searchLower = searchQuery.toLowerCase();
                const matchesSearch = searchQuery === '' ||
                    flight.title.toLowerCase().includes(searchLower) ||
                    (flight.description && flight.description.toLowerCase().includes(searchLower)) ||
                    flight.destination.toLowerCase().includes(searchLower);

                const matchesDestination = selectedDestination === 'all' || flight.destination === selectedDestination;
                const matchesTourType = selectedTourType === 'all' || flight.tourType === selectedTourType;
                const matchesPrice = flight.price >= priceRange[0] && flight.price <= priceRange[1];

                return matchesSearch && matchesDestination && matchesTourType && matchesPrice;
            });

        // Sort flights
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'title':
                default:
                    return a.title.localeCompare(b.title);
            }
        });

        return filtered;
    }, [searchQuery, selectedDestination, selectedTourType, priceRange, sortBy, lang, flights]);

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedDestination('all');
        setSelectedTourType('all');
        setPriceRange([0, 600]);
        setSortBy('title');
    };

    const hasActiveFilters = searchQuery !== '' || selectedDestination !== 'all' || selectedTourType !== 'all' || priceRange[1] < 600;

    if (loading) {
        return (
            <main className="min-h-screen bg-[#FDFBF7] font-sans flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C04000]"></div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7] font-sans">
            <PageHeader
                title={dict.flights_page.title}
                subtitle={dict.flights_page.subtitle}
                backgroundImage="/images/hero.webp"
                waveColor="#FDFBF7"
            />

            {/* Main Content Area with Side-by-Side Layout */}
            <div className="container mx-auto px-4 py-8 pb-20">
                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="mb-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">{dict.flights_page.filters.active_filters}:</span>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="bg-[#C04000] text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-[#A03000] transition-colors"
                                >
                                    "{searchQuery.substring(0, 20)}{searchQuery.length > 20 ? '...' : ''}"
                                    <X size={14} />
                                </button>
                            )}
                            {selectedDestination !== 'all' && (
                                <button
                                    onClick={() => setSelectedDestination('all')}
                                    className="bg-[#C04000] text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-[#A03000] transition-colors"
                                >
                                    {selectedDestination}
                                    <X size={14} />
                                </button>
                            )}
                            {selectedTourType !== 'all' && (
                                <button
                                    onClick={() => setSelectedTourType('all')}
                                    className="bg-[#C04000] text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-[#A03000] transition-colors"
                                >
                                    {selectedTourType}
                                    <X size={14} />
                                </button>
                            )}
                            {priceRange[1] < 600 && (
                                <button
                                    onClick={() => setPriceRange([0, 600])}
                                    className="bg-[#C04000] text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-[#A03000] transition-colors"
                                >
                                    ${priceRange[0]}-${priceRange[1]}
                                    <X size={14} />
                                </button>
                            )}
                            <button
                                onClick={resetFilters}
                                className="text-sm text-gray-600 hover:text-[#C04000] underline ml-2"
                            >
                                {dict.flights_page.filters.clear_all}
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white px-6 py-3 rounded-xl font-bold shadow-lg"
                        >
                            <SlidersHorizontal size={18} />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>

                    {/* Sidebar Filters */}
                    <aside className={`lg:block w-full lg:w-80 ${showFilters ? 'block' : 'hidden'}`}>
                        <div className="bg-white rounded-3xl p-6 shadow-lg lg:sticky lg:top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-extrabold text-[#C04000]">{dict.flights_page.filters.title}</h2>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-gray-500 hover:text-[#C04000] font-medium underline"
                                >
                                    {dict.flights_page.filters.reset_all}
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Price Range */}
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-4">{dict.flights_page.filters.price}</h3>
                                    <div className="space-y-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="600"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C04000]"
                                        />
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-gray-600">${priceRange[0]}</span>
                                            <span className="text-[#C04000]">${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Destinations */}
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-4">{dict.flights_page.filters.destinations}</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="destination"
                                                value="all"
                                                checked={selectedDestination === 'all'}
                                                onChange={(e) => setSelectedDestination(e.target.value)}
                                                className="w-4 h-4 text-[#C04000] accent-[#C04000]"
                                            />
                                            <span className="text-gray-700 group-hover:text-[#C04000] font-medium">{dict.flights_page.filters.all_destinations}</span>
                                        </label>
                                        {destinations.map((dest) => (
                                            <label key={dest} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="destination"
                                                    value={dest}
                                                    checked={selectedDestination === dest}
                                                    onChange={(e) => setSelectedDestination(e.target.value)}
                                                    className="w-4 h-4 text-[#C04000] accent-[#C04000]"
                                                />
                                                <span className="text-gray-700 group-hover:text-[#C04000] font-medium">{dest}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Tour Types */}
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-4">{dict.flights_page.filters.tour_type}</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="tourType"
                                                value="all"
                                                checked={selectedTourType === 'all'}
                                                onChange={(e) => setSelectedTourType(e.target.value)}
                                                className="w-4 h-4 text-[#C04000] accent-[#C04000]"
                                            />
                                            <span className="text-gray-700 group-hover:text-[#C04000] font-medium">{dict.flights_page.filters.all_types}</span>
                                        </label>
                                        {tourTypes.map((type) => (
                                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="tourType"
                                                    value={type}
                                                    checked={selectedTourType === type}
                                                    onChange={(e) => setSelectedTourType(e.target.value)}
                                                    className="w-4 h-4 text-[#C04000] accent-[#C04000]"
                                                />
                                                <span className="text-gray-700 group-hover:text-[#C04000] font-medium">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                {/* Contact Info */}
                                <div className="bg-gradient-to-br from-[#C04000] to-[#D84A1B] rounded-2xl p-6 text-white">
                                    <h3 className="font-bold text-lg mb-3">{dict.flights_page.help.title}</h3>
                                    <p className="text-sm text-white/90 mb-4">
                                        {dict.flights_page.help.content}
                                    </p>
                                    <a
                                        href="tel:+212751622180"
                                        className="block text-center bg-white text-[#C04000] px-4 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        +212 751 622 180
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Flights Grid */}
                    <div className="flex-1">
                        {/* Sort & Results Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <p className="text-base text-gray-700 font-medium">
                                {dict.flights_page.results.showing} <span className="font-bold text-[#C04000]">{filteredFlights.length}</span> {dict.flights_page.results.results_count}
                            </p>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                    {dict.flights_page.sort.label}
                                </label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C04000] bg-white cursor-pointer"
                                >
                                    <option value="title">{dict.flights_page.sort.title}</option>
                                    <option value="price-low">{dict.flights_page.sort.price_low}</option>
                                    <option value="price-high">{dict.flights_page.sort.price_high}</option>
                                </select>
                            </div>
                        </div>

                        {/* Flights Grid */}
                        {filteredFlights.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredFlights.map((flight, index) => (
                                    <motion.div
                                        key={flight.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                    >
                                        <SuggestionCard
                                            title={flight.title}
                                            subtitle={`${flight.destination}`}
                                            image={flight.image}
                                            rating={`${flight.rating || 4.9}/5`}
                                            price={<PriceDisplay amount={flight.price} />}
                                            badgeType={
                                                flight.id === 'top-vip' ? 'most-reserved' :
                                                    flight.id === 'vip' ? 'vip' :
                                                        undefined
                                            }
                                            link={`/${lang}/flights/${(lang === 'fr' ? (flight.slug_fr || flight.slug) : flight.slug) || flight.id}`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto">
                                    <div className="text-gray-400 mb-4">
                                        <X size={64} className="mx-auto" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{dict.flights_page.results.no_flights}</h3>
                                    <p className="text-base text-gray-600 mb-6">
                                        {dict.flights_page.results.try_adjusting}
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                                    >
                                        {dict.flights_page.results.reset_filters}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </main>
    );
}

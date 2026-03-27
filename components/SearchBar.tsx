'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Activity, ChevronDown, Minus, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

import { Flight, FlightCache } from '../services/flightService';

interface SearchBarProps {
    lang?: string;
    dict?: any;
    initialFlights?: Flight[]; // Flights from SSR
}

export default function SearchBar({ lang = 'en', dict, initialFlights = [] }: SearchBarProps) {
    const router = useRouter();
    const t = dict?.search_bar || {};

    // State for managing dropdown visibility
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Form State
    const [destination, setDestination] = useState('');
    const [activity, setActivity] = useState('');
    const [guests, setGuests] = useState({ adults: 0, children: 0 });
    const [date, setDate] = useState<Date | null>(null);

    // Flights state with SSR data priority
    const [flights, setFlights] = useState<Flight[]>(initialFlights);
    const [isLoadingFlights, setIsLoadingFlights] = useState(false);

    // Cache flights when received from SSR
    useEffect(() => {
        if (initialFlights && initialFlights.length > 0) {
            setFlights(initialFlights);
            FlightCache.set(initialFlights);
        }
    }, [initialFlights]);

    // Close dropdowns when clicking outside
    const searchBarRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    // Get unique destinations from flights
    const availableDestinations = React.useMemo(() => {
        const destinations = flights
            .map(f => f.destination)
            .filter(Boolean);
        return Array.from(new Set(destinations)).sort();
    }, [flights]);

    // Filter flights by selected destination
    const filteredFlights = React.useMemo(() => {
        if (!destination) return [];
        return flights.filter(f => 
            f.destination.toLowerCase() === destination.toLowerCase()
        );
    }, [flights, destination]);

    // Reset activity when destination changes
    useEffect(() => {
        if (destination && activity) {
            const activityExists = filteredFlights.some(f => {
                const title = lang === 'fr' && f.title_fr ? f.title_fr : f.title;
                return title === activity;
            });
            if (!activityExists) {
                setActivity('');
            }
        }
    }, [destination, filteredFlights, activity, lang]);

    // Calendar Data Helper - Dynamic
    const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
    const [currentDate, setCurrentDate] = useState(new Date());
    const currentMonth = currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const emptyDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Monday = 0
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if we can navigate to previous month
    const canGoPrevMonth = () => {
        const prevMonth = new Date(year, month - 1, 1);
        const firstOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return prevMonth >= firstOfCurrentMonth;
    };

    // Check if a date is in the past
    const isPastDate = (day: number) => {
        const checkDate = new Date(year, month, day);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    };

    // Handle Search - Redirect to flights page with query params
    const handleSearch = () => {
        const params = new URLSearchParams();

        if (destination) params.append('destination', destination);
        if (activity) params.append('activity', activity);
        if (date) params.append('date', date.toISOString());
        if (guests.adults > 0) params.append('adults', guests.adults.toString());
        if (guests.children > 0) params.append('children', guests.children.toString());

        router.push(`/flights?${params.toString()}`);
    };

    return (
        <div ref={searchBarRef} className="bg-white rounded-2xl xs:rounded-[2rem] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.3)] mx-auto max-w-5xl relative z-[60] flex flex-col md:flex-row items-stretch overflow-visible border-4 border-white/40 backdrop-blur-xl bg-white/98">

            {/* Mobile Header - Shows only on mobile */}
            <div className="md:hidden bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white px-4 py-3 rounded-t-2xl xs:rounded-t-[2rem] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Search size={18} strokeWidth={2.5} />
                    <span className="font-bold text-sm xs:text-base">{t.search_title || 'Search Your Flight'}</span>
                </div>
                <div className="text-[10px] xs:text-xs font-medium opacity-90 bg-white/20 px-2 py-1 rounded-full">
                    {t.easy_booking || 'Easy Booking'}
                </div>
            </div>

            {/* --- DESTINATIONS --- */}
            <div
                className={`flex-1 relative border-b md:border-b-0 md:border-r border-gray-100 p-3 xs:p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-tl-2xl rounded-bl-2xl md:rounded-bl-none md:rounded-tl-[2rem] md:rounded-tr-none ${activeDropdown === 'destinations' ? 'bg-gray-50' : ''}`}
                onClick={() => toggleDropdown('destinations')}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 xs:gap-3">
                        <MapPin className="text-[#C04000]" size={20} />
                        <span className="font-bold text-gray-800 text-base xs:text-lg">{t.destinations || 'Destinations'}</span>
                    </div>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${activeDropdown === 'destinations' ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-xs xs:text-sm text-gray-500 pl-7 xs:pl-9 truncate font-medium">
                    {destination || t.where_going || 'Where are you going?'}
                </p>

                {/* Dropdown Menu */}
                {activeDropdown === 'destinations' && (
                    <div className="absolute top-full left-0 right-0 md:w-full md:min-w-[280px] bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(192,64,0,0.3)] mt-2 xs:mt-3 md:mt-4 py-2 z-[100] border-2 border-[#C04000]/20 max-h-[280px] overflow-y-auto">
                        <div className="px-4 xs:px-6 py-2 xs:py-3 text-[10px] xs:text-xs font-bold text-gray-400 uppercase tracking-wider cursor-default bg-gray-50/50">— {t.all_destinations || 'All Destinations'} —</div>
                        {availableDestinations.length > 0 ? (
                            availableDestinations.map(city => (
                                <div
                                    key={city}
                                    className="px-4 xs:px-6 py-3 xs:py-3.5 hover:bg-orange-50 cursor-pointer text-gray-700 font-medium transition-all hover:text-[#C04000] hover:pl-5 xs:hover:pl-7 border-b border-gray-100 last:border-b-0"
                                    onClick={(e) => { e.stopPropagation(); setDestination(city); setActiveDropdown(null); }}
                                >
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-[#C04000] opacity-0 group-hover:opacity-100" />
                                        <span className="text-sm xs:text-base">{city}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 xs:px-6 py-4 text-center text-gray-500 text-sm">
                                {t.no_destinations || 'No destinations available'}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- ACTIVITY --- */}
            <div
                className={`flex-1 relative border-b md:border-b-0 md:border-r border-gray-100 p-3 xs:p-4 md:p-6 cursor-pointer transition-colors rounded-t-2xl md:rounded-none ${
                    !destination ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                } ${activeDropdown === 'activity' ? 'bg-gray-50' : ''}`}
                onClick={() => destination && toggleDropdown('activity')}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 xs:gap-3">
                        <Activity className="text-[#C04000]" size={20} />
                        <span className="font-bold text-gray-800 text-base xs:text-lg">{t.activity || 'Activity'}</span>
                    </div>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${activeDropdown === 'activity' ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-xs xs:text-sm text-gray-500 pl-7 xs:pl-9 truncate font-medium">
                    {!destination 
                        ? (t.select_destination_first || 'Select destination first') 
                        : (activity || t.all_activity || 'All Activity')
                    }
                </p>

                {/* Dropdown Menu */}
                {activeDropdown === 'activity' && destination && (
                    <div className="absolute top-full left-0 right-0 md:w-full md:min-w-[320px] bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(192,64,0,0.3)] mt-2 xs:mt-3 md:mt-4 py-2 z-[100] border-2 border-[#C04000]/20 max-h-[320px] overflow-y-auto">
                        <div className="px-4 xs:px-6 py-2 xs:py-3 text-[10px] xs:text-xs font-bold text-gray-400 uppercase tracking-wider cursor-default bg-gray-50/50 sticky top-0">
                            — {t.activities_in || 'Activities in'} {destination} —
                        </div>
                        {isLoadingFlights ? (
                            <div className="px-4 xs:px-6 py-4 text-center text-gray-500 text-sm">
                                <div className="animate-pulse">Loading activities...</div>
                            </div>
                        ) : filteredFlights.length > 0 ? (
                            filteredFlights.map(item => (
                                <div
                                    key={item._id || item.slug}
                                    className="px-4 xs:px-6 py-2.5 xs:py-3 hover:bg-orange-50 cursor-pointer text-gray-700 font-medium transition-all hover:text-[#C04000] hover:pl-5 xs:hover:pl-7 border-b border-gray-100 last:border-b-0"
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        const title = lang === 'fr' && item.title_fr ? item.title_fr : item.title;
                                        setActivity(title); 
                                        setActiveDropdown(null); 
                                    }}
                                >
                                    <span className="text-xs xs:text-sm line-clamp-2">
                                        {lang === 'fr' && item.title_fr ? item.title_fr : item.title}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 xs:px-6 py-4 text-center text-gray-500 text-sm">
                                {t.no_activities_destination || `No activities in ${destination}`}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- WHEN --- */}
            <div
                className={`flex-1 relative border-b md:border-b-0 md:border-r border-gray-100 p-3 xs:p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-2xl md:rounded-none ${activeDropdown === 'date' ? 'bg-gray-50' : ''}`}
                onClick={() => toggleDropdown('date')}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 xs:gap-3">
                        <Calendar className="text-[#C04000]" size={20} />
                        <span className="font-bold text-gray-800 text-base xs:text-lg">{t.when || 'When'}</span>
                    </div>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${activeDropdown === 'date' ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-xs xs:text-sm text-gray-500 pl-7 xs:pl-9 font-medium">
                    {date ? date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }) : t.date_from || 'Select date'}
                </p>

                {/* Date Picker Dropdown */}
                {activeDropdown === 'date' && (
                    <div className="absolute top-full left-0 right-0 md:left-auto md:right-auto bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(192,64,0,0.3)] mt-2 xs:mt-3 md:mt-4 p-4 xs:p-5 z-[100] border-2 border-[#C04000]/20 w-full md:w-[320px] max-w-[320px] mx-auto cursor-default" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-5">
                            <span className="font-bold text-gray-800 text-lg">{currentMonth}</span>
                            <div className="flex gap-2">
                                <ChevronLeft
                                    size={20}
                                    className={`transition-colors ${
                                        canGoPrevMonth() 
                                            ? 'text-gray-400 cursor-pointer hover:text-black' 
                                            : 'text-gray-200 cursor-not-allowed'
                                    }`}
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (canGoPrevMonth()) {
                                            setCurrentDate(new Date(year, month - 1, 1)); 
                                        }
                                    }}
                                />
                                <ChevronRight
                                    size={20}
                                    className="text-gray-400 cursor-pointer hover:text-black transition-colors"
                                    onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year, month + 1, 1)); }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-sm mb-2">
                            {(lang === 'fr' ? ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'] : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']).map(d => <div key={d} className="font-bold text-gray-400 text-xs">{d}</div>)}

                            {/* Empty slots for start of month alignment */}
                            {Array.from({ length: emptyDays }).map((_, i) => <div key={`empty-${i}`} className="p-2" />)}

                            {days.map(d => {
                                const isDisabled = isPastDate(d);
                                const isSelected = date && d === date.getDate() && month === date.getMonth() && year === date.getFullYear();
                                
                                return (
                                    <div 
                                        key={d}
                                        className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all
                                            ${
                                                isDisabled 
                                                    ? 'text-gray-300 cursor-not-allowed' 
                                                    : isSelected
                                                        ? 'bg-[#C04000] text-white shadow-md shadow-orange-200 cursor-pointer'
                                                        : 'hover:bg-gray-100 text-gray-700 cursor-pointer'
                                            }
                                        `}
                                        onClick={() => { 
                                            if (!isDisabled) {
                                                setDate(new Date(year, month, d)); 
                                                setActiveDropdown(null);
                                            }
                                        }}
                                    >
                                        {d}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* --- GUESTS --- */}
            <div
                className={`flex-1 relative p-3 xs:p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-2xl md:rounded-tr-[2rem] md:rounded-tl-none ${activeDropdown === 'guests' ? 'bg-gray-50' : ''}`}
                onClick={() => toggleDropdown('guests')}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 xs:gap-3">
                        <Users className="text-[#C04000]" size={20} />
                        <span className="font-bold text-gray-800 text-base xs:text-lg">{t.guests || 'Guests'}</span>
                    </div>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${activeDropdown === 'guests' ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-xs xs:text-sm text-gray-500 pl-7 xs:pl-9 font-medium">
                    {guests.adults + guests.children > 0 ? `${guests.adults + guests.children} ${t.guests || 'Guests'}` : `0 ${t.guests || 'Guests'}`}
                </p>

                {/* Dropdown Menu */}
                {activeDropdown === 'guests' && (
                    <div className="absolute top-full left-0 right-0 md:right-0 md:left-auto bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(192,64,0,0.3)] mt-2 xs:mt-3 md:mt-4 p-4 xs:p-6 z-[100] border-2 border-[#C04000]/20 w-full md:w-[300px] cursor-default" onClick={(e) => e.stopPropagation()}>
                        {/* Adults */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-700 font-bold text-lg">{t.adults || 'Adults'}</span>
                            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
                                <button className="p-1 hover:text-[#C04000] transition-colors" onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(0, prev.adults - 1) }))}>
                                    <Minus size={18} strokeWidth={2.5} />
                                </button>
                                <span className="w-4 text-center font-bold text-gray-800">{guests.adults}</span>
                                <button className="p-1 hover:text-[#C04000] transition-colors" onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}>
                                    <Plus size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                        {/* Children */}
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-gray-700 font-bold text-lg">{t.children || 'Children'}</span>
                            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
                                <button className="p-1 hover:text-[#C04000] transition-colors" onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}>
                                    <Minus size={18} strokeWidth={2.5} />
                                </button>
                                <span className="w-4 text-center font-bold text-gray-800">{guests.children}</span>
                                <button className="p-1 hover:text-[#C04000] transition-colors" onClick={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}>
                                    <Plus size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                        <button
                            className="w-full bg-[#C04000] text-white font-bold py-3.5 rounded-xl hover:bg-[#A03000] transition-all transform active:scale-95 shadow-lg shadow-orange-500/30"
                            onClick={() => setActiveDropdown(null)}
                        >
                            {t.apply || 'Apply'}
                        </button>
                    </div>
                )}
            </div>

            {/* SEARCH BUTTON */}
            <div className="p-2 xs:p-2.5 md:p-3 flex items-center rounded-b-2xl xs:rounded-b-[2rem] md:rounded-b-none md:rounded-r-[2rem] bg-gradient-to-b from-transparent to-orange-50/30 md:bg-none">
                <button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-[#C04000] to-[#D84A1B] hover:from-[#A03000] hover:to-[#C04000] text-white px-6 xs:px-8 py-3.5 xs:py-4 md:h-full rounded-xl xs:rounded-2xl font-bold flex items-center justify-center gap-2 xs:gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-2xl shadow-orange-600/30 w-full md:w-auto text-base xs:text-lg min-w-[120px] xs:min-w-[140px]"
                >
                    <Search size={20} className="xs:w-[22px] xs:h-[22px]" strokeWidth={2.5} />
                    <span className="font-extrabold">{t.search || 'Search'}</span>
                </button>
            </div>

        </div>
    );
}

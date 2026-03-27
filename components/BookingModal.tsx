'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, User, Mail, Phone, MapPin, Calendar, Check, Loader2, AlertCircle } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    flightTitle: string;
    flightId: string;
    pricePerPerson: number;
    dict: any;
}

export default function BookingModal({ isOpen, onClose, flightTitle, flightId, pricePerPerson, dict }: BookingModalProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingData, setBookingData] = useState({
        date: new Date(),
        travelers: 1,
        name: '',
        email: '',
        phone: '',
        location: ''
    });
    const { formatPrice } = useCurrency();

    if (!isOpen) return null;

    // Use booking dictionary
    const t = dict.booking;

    const total = pricePerPerson * bookingData.travelers;

    const validateStep = (currentStep: number) => {
        setError(null);
        if (currentStep === 1) {
            if (!bookingData.date) {
                setError(t.errors?.date_required || "Please select a date");
                return false;
            }
            if (bookingData.date < new Date()) {
                setError(t.errors?.date_past || "Date cannot be in the past");
                return false;
            }
        }
        if (currentStep === 2) {
            if (!bookingData.name || bookingData.name.length < 3) {
                setError(t.errors?.name_required || "Name is required (min 3 chars)");
                return false;
            }
            if (!bookingData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
                setError(t.errors?.email_invalid || "Valid email is required");
                return false;
            }
            if (!bookingData.location || bookingData.location.length < 3) {
                setError(t.errors?.location_required || "Pickup location is required");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleConfirm = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                flight: flightId,
                date: bookingData.date,
                travelers: bookingData.travelers,
                total: pricePerPerson * bookingData.travelers,
                fullName: bookingData.name,
                email: bookingData.email,
                phoneNumber: bookingData.phone,
                pickUpLocation: bookingData.location,
                status: 'pending'
            };

            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/reservations`, payload);
            setStep(4); // Success step
        } catch (err: any) {
            console.error('Booking failed:', err);
            setError(err.response?.data?.message || t.errors?.submit_error || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#FFF9F2] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-6 md:p-8 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">{flightTitle}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200/50 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Stepper */}
                <div className="px-8 py-6 flex justify-center items-center">
                    {[1, 2, 3, 4].map((s, idx) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                        ${step >= s ? 'bg-[#22C55E] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {step > s ? <Check size={16} strokeWidth={3} /> : s}
                            </div>
                            {idx < 3 && (
                                <div className={`w-12 md:w-20 h-1 mx-2 rounded-full transition-colors duration-300 ${step > idx + 1 ? 'bg-[#22C55E]' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center text-gray-500 mb-6 font-medium">
                    {step === 1 && t.dates_travelers}
                    {step === 2 && t.your_details}
                    {step === 3 && t.summary}
                    {step === 4 && t.success_title}
                </div>

                {error && (
                    <div className="mx-8 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
                        <AlertCircle size={20} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}


                {/* Content */}
                <div className="flex-1 px-6 md:px-12 pb-8">

                    {/* Step 1: Date & Travelers */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Calendar Widget */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                                <h3 className="font-bold text-lg mb-4 w-full text-left">{t.select_date || "Select Date"}</h3>
                                <DatePicker
                                    selected={bookingData.date}
                                    onChange={(date: Date | null) => date && setBookingData({ ...bookingData, date })}
                                    inline
                                    minDate={new Date()}
                                    calendarClassName="!border-0 !font-sans"
                                    dayClassName={date =>
                                        date.getDate() === bookingData.date?.getDate() && date.getMonth() === bookingData.date?.getMonth()
                                            ? "bg-[#C04000] !text-white rounded-full"
                                            : "hover:bg-orange-50 rounded-full"
                                    }
                                />
                            </div>

                            {/* Summary Card */}
                            <div className="bg-[#FFE4C4]/40 p-6 md:p-8 rounded-2xl border border-orange-100/50 h-fit">
                                <h3 className="font-bold text-xl mb-6 text-gray-900">{t.reservation_summary}</h3>

                                <div className="bg-white p-4 rounded-xl mb-6 shadow-sm border border-gray-100 cursor-pointer flex items-center gap-3">
                                    <Calendar size={18} className="text-gray-400" />
                                    <div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">{t.date}</div>
                                        <div className="font-semibold text-gray-900">
                                            {bookingData.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="text-sm font-bold text-gray-700 mb-2 block">{t.travelers_count}</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setBookingData(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                                            className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold hover:bg-orange-200 transition-colors"
                                        >-</button>
                                        <span className="text-xl font-bold w-4 text-center">{bookingData.travelers}</span>
                                        <button
                                            onClick={() => setBookingData(prev => ({ ...prev, travelers: Math.min(10, prev.travelers + 1) }))}
                                            className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center font-bold hover:bg-gray-50 transition-colors"
                                        >+</button>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-orange-200/50 space-y-3">
                                    <div className="flex justify-between items-center text-gray-700">
                                        <span>{t.unit_price}</span>
                                        <span className="font-bold">{formatPrice(pricePerPerson)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-700">
                                        <span>{t.travelers}</span>
                                        <span className="font-bold">×{bookingData.travelers}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#D93F3F] text-xl font-extrabold pt-3">
                                        <span>{t.total}</span>
                                        <span>{formatPrice(pricePerPerson * bookingData.travelers)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="w-full mt-8 bg-[#22C55E] hover:bg-[#1ea851] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                                >
                                    {t.continue}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Contact Information */}
                    {step === 2 && (
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold mb-8 text-gray-900 border-b pb-4">{t.your_details}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <User size={16} /> {t.full_name} *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t.full_name}
                                        value={bookingData.name}
                                        onChange={e => setBookingData({ ...bookingData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail size={16} /> {t.email} *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder={t.email}
                                        value={bookingData.email}
                                        onChange={e => setBookingData({ ...bookingData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone size={16} /> {t.phone}
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder={t.phone}
                                        value={bookingData.phone}
                                        onChange={e => setBookingData({ ...bookingData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin size={16} /> {t.pickup} *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={t.pickup}
                                        value={bookingData.location}
                                        onChange={e => setBookingData({ ...bookingData, location: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={prevStep}
                                    className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl transition-colors"
                                >
                                    {t.back}
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="flex-1 bg-[#22C55E] hover:bg-[#1ea851] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                                >
                                    {t.continue}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold mb-8 text-gray-900 border-b pb-4">{t.summary}</h3>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <span className="font-semibold text-gray-600">{t.flight}:</span>
                                    <span className="font-bold text-gray-900 text-right">{flightTitle}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <span className="font-semibold text-gray-600">{t.date}:</span>
                                    <span className="font-bold text-gray-900 text-right">{bookingData.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <span className="font-semibold text-gray-600">{t.travelers}:</span>
                                    <span className="font-bold text-gray-900 text-right">{bookingData.travelers} {t.travelers.toLowerCase()}</span>
                                </div>
                                <div className="my-4 border-t border-dashed border-gray-200" />
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <span className="font-semibold text-gray-600">{t.full_name}:</span>
                                    <span className="font-bold text-gray-900 text-right">{bookingData.name || '-'}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <span className="font-semibold text-gray-600">{t.email}:</span>
                                    <span className="font-bold text-gray-900 text-right break-all">{bookingData.email || '-'}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <span className="font-semibold text-gray-600">{t.phone}:</span>
                                    <span className="font-bold text-gray-900 text-right">{bookingData.phone || '-'}</span>
                                </div>
                                <div className="grid grid-cols-[140px_1fr] gap-4 items-center">
                                    <span className="font-semibold text-gray-600">{t.pickup}:</span>
                                    <span className="font-bold text-gray-900 text-right">{bookingData.location || '-'}</span>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-xl font-bold text-[#D93F3F]">{t.total_pay}:</span>
                                    <span className="text-2xl font-extrabold text-[#D93F3F]">{formatPrice(pricePerPerson * bookingData.travelers)}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={prevStep}
                                    className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl transition-colors"
                                >
                                    {t.back}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="flex-1 bg-[#22C55E] hover:bg-[#1ea851] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : t.confirm}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={48} className="text-green-600" strokeWidth={3} />
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">{t.success_title}</h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-8">
                                {t.success_msg.replace('{name}', bookingData.name).replace('{email}', bookingData.email)}
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-[#C04000] text-white font-bold py-3 px-12 rounded-xl shadow-lg hover:bg-[#A03000] transition-colors"
                            >
                                {t.return_home || 'Close'}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

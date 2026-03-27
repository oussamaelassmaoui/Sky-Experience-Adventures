'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
    onCheckAvailability?: () => void;
    onContact?: () => void;
    lang?: string;
    dict?: any;
}

export default function BookingCalendar({ onCheckAvailability, onContact, lang = 'en', dict }: BookingCalendarProps) {
    const t = dict?.booking_calendar || {};
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // 0=Sun..6=Sat → convert to Mon-start (0=Mon..6=Sun)
    const firstDay = new Date(year, month, 1).getDay();
    const emptySlots = firstDay === 0 ? 6 : firstDay - 1;

    const days: (number | null)[] = [];
    for (let i = 0; i < emptySlots; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
    const monthLabel = currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

    const weekdays = t.weekdays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-xl w-full max-w-sm mx-auto border border-gray-100">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => canGoPrevMonth() && setCurrentDate(new Date(year, month - 1, 1))}
                    disabled={!canGoPrevMonth()}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                        canGoPrevMonth()
                            ? 'border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 cursor-pointer'
                            : 'border-gray-200 text-gray-200 cursor-not-allowed'
                    }`}
                >
                    <ChevronLeft size={16} strokeWidth={2} />
                </button>
                <div className="text-base font-bold text-gray-800 capitalize">
                    {monthLabel}
                </div>
                <button
                    onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
                >
                    <ChevronRight size={16} strokeWidth={2} />
                </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 mb-4">
                {weekdays.map((day: string) => (
                    <div key={day} className="text-center text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-8">
                {days.map((day, index) => {
                    const isDisabled = day ? isPastDate(day) : false;
                    const isSelected = selectedDate === day;
                    
                    return (
                        <div key={index} className="flex justify-center">
                            {day ? (
                                <button
                                    onClick={() => !isDisabled && setSelectedDate(day)}
                                    disabled={isDisabled}
                                    className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-full transition-all duration-200 ${
                                        isDisabled
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : isSelected
                                                ? 'bg-black text-white shadow-md cursor-pointer'
                                                : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                                    }`}
                                >
                                    {day}
                                </button>
                            ) : (
                                <div />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={onCheckAvailability}
                    className="w-full bg-[#5D9B38] hover:bg-[#4a802a] text-white font-bold py-3 rounded-lg uppercase text-sm tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                    {t.check_availability || 'Check Availability'}
                </button>
                <button
                    onClick={onContact}
                    className="w-full bg-[#3B41E3] hover:bg-[#2f34b9] text-white font-bold py-3 rounded-lg uppercase text-sm tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                    {t.contact || 'Contact'}
                </button>
            </div>
        </div>
    );
}

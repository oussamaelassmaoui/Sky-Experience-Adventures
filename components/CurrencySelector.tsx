'use client';

import { useCurrency, Currency } from '@/context/CurrencyContext';
import { useState, useEffect } from 'react';

const currencies: { code: Currency; symbol: string; name: string }[] = [
    { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export default function CurrencySelector() {
    const { currency, setCurrency } = useCurrency();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) return null;

    return (
        <div className="flex items-center bg-gray-50 rounded-full px-1 py-1 border border-gray-200">
            {currencies.map((c) => (
                <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${currency === c.code
                        ? 'bg-[#C04000] text-white shadow-sm scale-105'
                        : 'text-gray-600 hover:text-[#C04000] hover:bg-gray-100'
                        }`}
                    aria-label={`Select ${c.name}`}
                >
                    {c.code}
                </button>
            ))}
        </div>
    );
}

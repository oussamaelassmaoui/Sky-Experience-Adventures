'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'MAD' | 'EUR' | 'USD' | 'GBP';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (c: Currency) => void;
    convertPrice: (amount: number, baseCurrency?: Currency) => number;
    formatPrice: (amount: number, baseCurrency?: Currency) => string;
    symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange Rates (Base: USD)
// You should update these periodically or fetch from an API
const RATES: Record<Currency, number> = {
    USD: 1,
    MAD: 10.0, // 1 USD = 10.0 MAD
    EUR: 0.93, // 1 USD = 0.93 EUR
    GBP: 0.79, // 1 USD = 0.79 GBP
};

const SYMBOLS: Record<Currency, string> = {
    MAD: 'MAD',
    EUR: '€',
    USD: '$',
    GBP: '£',
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrencyState] = useState<Currency>('USD');

    useEffect(() => {
        // Load from local storage
        const saved = localStorage.getItem('sky_currency') as Currency;
        if (saved && RATES[saved]) {
            setCurrencyState(saved);
        }
    }, []);

    const setCurrency = (c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('sky_currency', c);
    };

    const convertPrice = (amount: number, baseCurrency: Currency = 'USD') => {
        if (baseCurrency === currency) return amount;

        // Convert base to USD first (if base is not USD)
        const amountInUSD = baseCurrency === 'USD' ? amount : amount / RATES[baseCurrency];

        // Convert USD to target currency
        return amountInUSD * RATES[currency];
    };

    const formatPrice = (amount: number, baseCurrency: Currency = 'USD') => {
        const converted = convertPrice(amount, baseCurrency);
        // Round to nearest integer for clean look, or 2 decimals
        const rounded = Math.round(converted);
        return `${SYMBOLS[currency]} ${rounded}`; // e.g. "€ 150"
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice, symbol: SYMBOLS[currency] }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

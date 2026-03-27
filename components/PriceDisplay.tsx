'use client';

import { useCurrency, Currency } from '@/context/CurrencyContext';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PriceDisplayProps {
    amount: number;
    sourceCurrency?: Currency; // The currency the amount is in (default: MAD)
    className?: string;
    showSymbol?: boolean;
}

export default function PriceDisplay({
    amount,
    sourceCurrency = 'USD',
    className = '',
    showSymbol = true
}: PriceDisplayProps) {
    const { formatPrice, currency } = useCurrency();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by rendering a placeholder or the base price first
    if (!mounted) {
        return <span className={className}>...</span>;
    }

    if (amount === undefined || amount === null || isNaN(amount)) {
        return <span className={className}>{showSymbol ? `${currency} ...` : '...'}</span>;
    }

    return (
        <span className={className}>
            {formatPrice(amount, sourceCurrency)}
        </span>
    );
}

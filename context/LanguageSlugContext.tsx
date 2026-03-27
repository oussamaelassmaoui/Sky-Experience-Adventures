'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Slugs {
    en?: string;
    fr?: string;
}

interface LanguageSlugContextType {
    slugs: Slugs | null;
    setSlugs: (slugs: Slugs | null) => void;
}

const LanguageSlugContext = createContext<LanguageSlugContextType | undefined>(undefined);

export function LanguageSlugProvider({ children }: { children: ReactNode }) {
    const [slugs, setSlugs] = useState<Slugs | null>(null);

    return (
        <LanguageSlugContext.Provider value={{ slugs, setSlugs }}>
            {children}
        </LanguageSlugContext.Provider>
    );
}

export function useLanguageSlug() {
    const context = useContext(LanguageSlugContext);
    if (context === undefined) {
        throw new Error('useLanguageSlug must be used within a LanguageSlugProvider');
    }
    return context;
}

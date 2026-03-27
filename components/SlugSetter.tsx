'use client';

import { useEffect } from 'react';
import { useLanguageSlug } from '../context/LanguageSlugContext';

interface Slugs {
    en?: string;
    fr?: string;
}

export default function SlugSetter({ slugs }: { slugs: Slugs }) {
    const { setSlugs } = useLanguageSlug();

    useEffect(() => {
        setSlugs(slugs);
        // Clean up on unmount or navigation away
        return () => setSlugs(null);
    }, [slugs, setSlugs]);

    return null; // This component renders nothing
}

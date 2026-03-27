'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useLanguageSlug } from '../context/LanguageSlugContext';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get current language from URL (first segment)
    const currentLang = pathname.split('/')[1] === 'fr' ? 'fr' : 'en';

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
    ];

    const { slugs } = useLanguageSlug();

    const handleLanguageChange = (langCode: string) => {
        if (langCode === currentLang) {
            setIsOpen(false);
            return;
        }

        // If we have a specific slug for the target language (Blog or Flight)
        if (slugs && slugs[langCode as 'en' | 'fr']) {
            // Check if we are on a blog path
            if (pathname.includes('/blogs/')) {
                const newPath = `/${langCode}/blogs/${slugs[langCode as 'en' | 'fr']}`;
                router.push(newPath, { scroll: false });
                setIsOpen(false);
                return;
            }

            // Check if we are on a flight path
            if (pathname.includes('/flights/')) {
                const newPath = `/${langCode}/flights/${slugs[langCode as 'en' | 'fr']}`;
                router.push(newPath, { scroll: false });
                setIsOpen(false);
                return;
            }
        }

        // Default: Replace the language segment in the URL
        const segments = pathname.split('/');
        segments[1] = langCode;
        const newPath = segments.join('/');

        router.push(newPath, { scroll: false });
        setIsOpen(false);
    };


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-orange-600 transition-colors font-medium text-sm"
                aria-label="Select Language"
            >
                <Globe size={18} />
                <span className="uppercase">{currentLang}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${currentLang === lang.code ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-700'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-lg">{lang.flag}</span>
                                {lang.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

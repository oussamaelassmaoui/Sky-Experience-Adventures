'use client';
// Client component for Navbar interactions

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';

interface NavbarProps {
    variant?: 'fixed' | 'static';
    lang?: string;
    dict?: any;
}

export default function Navbar({ variant = 'fixed', lang = 'en', dict }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Hide Navbar on Admin pages
    if (pathname && pathname.includes('/admin')) return null;

    // Safe fallback if dict is not provided
    const navigation = dict || {
        home: "HOME",
        about: "About us",
        flights: "Flight",
        blog: "Blog",
        contact: "Contact",
        book_now: "Book Now"
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to generate localized links
    // If href starts with #, keep it as is (for anchors on homepage)
    // If href starts with /, prepend lang
    const getLink = (href: string) => {
        if (href.startsWith('#')) return `/${lang}${href}`;
        if (href.startsWith('/#')) return `/${lang}${href.substring(1)}`;
        if (href === '/') return `/${lang}`;
        return `/${lang}${href}`;
    };

    return (
        <header className={`${variant === 'fixed' ? 'fixed' : 'relative'} w-full z-50 ${variant === 'fixed' ? 'pt-3 xs:pt-4 sm:pt-5 md:pt-6 px-3 xs:px-4' : 'py-3 xs:py-4 px-3 xs:px-4'}`}>
            <nav
                className={`mx-auto max-w-7xl rounded-full px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 transition-all duration-300 flex justify-between items-center ${variant === 'static'
                    ? 'bg-white shadow-md'
                    : scrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
                        : 'bg-white/90 backdrop-blur-sm shadow-md'
                    }`}
            >
                {/* Logo */}
                <Link href={`/${lang}`} className="flex items-center gap-2">
                    <div className="relative h-8 xs:h-10 sm:h-12 w-32 xs:w-40 sm:w-48">
                        <Image
                            src="/images/logo.webp"
                            alt="Sky Experience Logo"
                            fill
                            className="object-contain"
                            priority
                            sizes="192px"
                        />
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-6 font-bold text-gray-800 text-sm tracking-wide">
                    <Link href={`/${lang}`} className="hover:text-orange-600 transition-colors flex items-center gap-1">
                        {navigation.home}
                    </Link>
                    <Link href={`/${lang}/about`} className="hover:text-orange-600 transition-colors flex items-center gap-1">
                        {navigation.about}
                    </Link>
                    <Link href={`/${lang}/flights`} className="hover:text-orange-600 transition-colors flex items-center gap-1">
                        {navigation.flights}
                    </Link>
                    <Link href={`/${lang}/blogs`} className="hover:text-orange-600 transition-colors flex items-center gap-1">
                        {navigation.blog}
                    </Link>
                    <Link href={`/${lang}/contact`} className="hover:text-orange-600 transition-colors flex items-center gap-1">
                        {navigation.contact}
                    </Link>
                </div>

                {/* Right Side Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 border-r border-gray-200 pr-4 mr-2">
                        <LanguageSelector />
                        <CurrencySelector />
                    </div>

                    <Link
                        href={`/${lang}/booking`}
                        className="bg-[#C04000] hover:bg-[#A03000] text-white px-6 py-2.5 rounded-full font-bold uppercase text-xs tracking-wider transition-transform hover:scale-105 shadow-md flex-shrink-0"
                    >
                        {navigation.book_now}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-gray-800 p-1"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} className="xs:w-7 xs:h-7" /> : <Menu size={24} className="xs:w-7 xs:h-7" />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden fixed top-20 xs:top-24 left-3 xs:left-4 right-3 xs:right-4 bg-white rounded-xl xs:rounded-2xl shadow-xl overflow-y-auto max-h-[80vh] p-5 xs:p-6 flex flex-col gap-3 xs:gap-4 items-center text-gray-800 font-bold z-50"
                    >
                        <Link href={`/${lang}`} onClick={() => setIsOpen(false)} className="hover:text-orange-600 text-base xs:text-base py-1">{navigation.home}</Link>
                        <Link href={`/${lang}/#about`} onClick={() => setIsOpen(false)} className="hover:text-orange-600 text-base xs:text-base py-1">{navigation.about}</Link>
                        <Link href={`/${lang}/#vols`} onClick={() => setIsOpen(false)} className="hover:text-orange-600 text-base xs:text-base py-1">{navigation.flights}</Link>
                        <Link href={`/${lang}/#blog`} onClick={() => setIsOpen(false)} className="hover:text-orange-600 text-base xs:text-base py-1">{navigation.blog}</Link>
                        <Link href={`/${lang}/#contact`} onClick={() => setIsOpen(false)} className="hover:text-orange-600 text-base xs:text-base py-1">{navigation.contact}</Link>

                        <div className="w-full h-px bg-gray-100 my-2"></div>

                        <div className="flex items-center gap-6 py-2">
                            <LanguageSelector />
                            <CurrencySelector />
                        </div>

                        <Link
                            href={`/${lang}/booking`}
                            onClick={() => setIsOpen(false)}
                            className="bg-[#C04000] hover:bg-[#A03000] text-white px-6 xs:px-8 py-2.5 xs:py-3 rounded-full uppercase text-sm w-full text-center mt-2 xs:mt-4 transition-colors"
                        >
                            {navigation.book_now}
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

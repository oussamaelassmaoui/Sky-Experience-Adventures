'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
    lang?: string;
    dict?: any;
}

export default function Footer({ lang = 'en', dict }: FooterProps) {
    const pathname = usePathname();

    // Hide Footer on Admin pages
    if (pathname && pathname.includes('/admin')) return null;

    // Safe fallback
    const t = dict?.footer || {
        description: "The premier hot air balloon adventure in Marrakech.",
        quick_links: "Quick Links",
        contact_us: "Contact Us",
        follow_us: "Follow Us",
        rights: "All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        social_desc: "Stay updated with our latest offers and sky adventures.",
        nav: { home: 'Home', flights: 'Our Flights', about: 'About Us', book_now: 'Book Now' },
        labels: { address: 'Address', email: 'Email', phone: 'Phone' }
    };

    return (
        <footer id="contact" className="bg-[#1a2632] text-white pt-20 pb-10 font-sans relative z-10 before:hidden after:hidden border-t-[6px] border-[#F27A23] outline-none -mt-1" style={{ backgroundImage: 'none' }}>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* 1. Brand & Description */}
                    <div className="space-y-6">
                        <div className="relative w-40 h-12">
                            <Image
                                src="/images/skyexp.webp"
                                alt="Sky Experience"
                                fill
                                className="object-contain brightness-0 invert"
                                sizes="160px"
                            />
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {t.description}
                        </p>
                    </div>

                    {/* 2. Quick Links */}
                    <div className="flex flex-col">
                        <h3 className="font-bold text-lg mb-6 text-[#F27A23] uppercase tracking-wider">{t.quick_links}</h3>
                        <ul className="space-y-4">
                            <li><Link href={`/${lang}`} className="text-gray-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2">{t.nav?.home || 'Home'}</Link></li>
                            <li><Link href={`/${lang}/flights`} className="text-gray-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2">{t.nav?.flights || 'Our Flights'}</Link></li>
                            <li><Link href={`/${lang}/about`} className="text-gray-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2">{t.nav?.about || 'About Us'}</Link></li>
                            <li><Link href={`/${lang}/flights?action=book`} className="text-gray-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2">{t.nav?.book_now || 'Book Now'}</Link></li>
                        </ul>
                    </div>

                    {/* 3. Contact Info */}
                    <div className="flex flex-col">
                        <h3 className="font-bold text-lg mb-6 text-[#F27A23] uppercase tracking-wider">{t.contact_us}</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="bg-[#FFFFFF]/10 p-2 rounded-lg shrink-0">
                                    <MapPin size={20} className="text-[#F27A23]" />
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400 uppercase font-bold mb-1">{t.labels?.address || 'Address'}</span>
                                    <p className="text-sm text-white leading-relaxed">
                                        {t.address_value}
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="bg-[#FFFFFF]/10 p-2 rounded-lg shrink-0">
                                    <Mail size={20} className="text-[#F27A23]" />
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400 uppercase font-bold mb-1">{t.labels?.email || 'Email'}</span>
                                    <a href={`mailto:${t.email_value}`} className="text-sm text-white hover:text-[#F27A23] transition-colors">
                                        {t.email_value}
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="bg-[#FFFFFF]/10 p-2 rounded-lg shrink-0">
                                    <Phone size={20} className="text-[#F27A23]" />
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400 uppercase font-bold mb-1">{t.labels?.phone || 'Phone'}</span>
                                    <a href={`tel:${(t.phone_value || '').replace(/\s/g, '')}`} className="text-sm text-white font-bold hover:text-[#F27A23] transition-colors">
                                        {t.phone_value}
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Social & Newsletter */}
                    <div className="flex flex-col">
                        <h3 className="font-bold text-lg mb-6 text-[#F27A23] uppercase tracking-wider">{t.follow_us}</h3>
                        <p className="text-gray-300 text-sm mb-6">
                            {t.social_desc || 'Stay updated with our latest offers and sky adventures.'}
                        </p>
                        <div className="flex gap-4">
                            <a href="https://web.facebook.com/profile.php?id=61587155890037" target="_blank" rel="noopener noreferrer" className="bg-[#FFFFFF]/10 hover:bg-[#F27A23] text-white p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1">
                                <Facebook size={20} />
                            </a>
                            <a href="https://www.instagram.com/skyexperience_marrakech" target="_blank" rel="noopener noreferrer" className="bg-[#FFFFFF]/10 hover:bg-[#F27A23] text-white p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Copyright */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 mt-8 border-t border-white/10">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} Sky Experience. {t.rights}
                        </p>
                        <p className="text-gray-500 text-xs text-center md:text-left">
                            Developed by{' '}
                            <a 
                                href="https://oussamaassmaoui.serv00.net/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#F27A23] hover:text-white transition-colors font-semibold"
                            >
                                oussama elassmaoui
                            </a>
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t.privacy || 'Privacy Policy'}</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{t.terms || 'Terms of Service'}</Link>
                    </div>
                </div>
            </div>
            {/* Extended background to cover overscroll/bottom bounce issues */}
            <div className="absolute left-0 bottom-0 w-full h-1 bg-[#1a2632] translate-y-full" />
        </footer>
    );
}

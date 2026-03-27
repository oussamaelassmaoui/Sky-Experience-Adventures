'use client';

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, User, Users, ArrowRight } from "lucide-react";
import { Flight } from "@/app/data/flights";
import PriceDisplay from "./PriceDisplay";

interface FlightCardProps {
    flight: Flight;
    lang?: string;
    dict?: any;
}

export default function FlightCard({ flight, lang = 'en', dict }: FlightCardProps) {
    const t = dict?.flight_card || {};
    return (
        <div className="bg-white rounded-xl xs:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group w-full max-w-[450px] mx-auto flex flex-col border border-gray-100/80">
            {/* Image Section */}
            <div className="relative h-[180px] xs:h-[200px] sm:h-[220px] md:h-[240px] w-full shrink-0 overflow-hidden">
                <Image
                    src={flight.image}
                    alt={flight.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Overlay Stats Bar */}
                <div className="absolute bottom-2 xs:bottom-3 md:bottom-4 left-2 xs:left-3 md:left-4 right-2 xs:right-3 md:right-4 bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl p-1.5 xs:p-2 md:p-3 flex justify-between items-center text-[9px] xs:text-[10px] sm:text-xs font-bold text-white border border-white/20 shadow-lg">
                    <div className="flex items-center gap-1 xs:gap-1.5 md:gap-2 px-1 xs:px-1.5 sm:px-2">
                        <Calendar size={12} className="xs:w-[14px] xs:h-[14px] md:w-4 md:h-4" strokeWidth={2.5} />
                        <span className="drop-shadow-sm">{t.one_day || '1 Day'}</span>
                    </div>
                    <div className="w-px h-3 xs:h-4 md:h-5 bg-white/30" />
                    <div className="flex items-center gap-1 xs:gap-1.5 md:gap-2 px-1 xs:px-1.5 sm:px-2">
                        <User size={12} className="xs:w-[14px] xs:h-[14px] md:w-4 md:h-4" strokeWidth={2.5} />
                        <span className="drop-shadow-sm">{t.min_2 || 'Min 2'}</span>
                    </div>
                    <div className="w-px h-3 xs:h-4 md:h-5 bg-white/30" />
                    <div className="flex items-center gap-1 xs:gap-1.5 md:gap-2 px-1 xs:px-1.5 sm:px-2">
                        <Users size={12} className="xs:w-[14px] xs:h-[14px] md:w-4 md:h-4" />
                        <span className="drop-shadow-sm">{t.max || 'Max'} {flight.maxPeople}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 xs:p-5 md:p-6 flex flex-col flex-1 min-h-[200px] xs:min-h-[220px] sm:min-h-[240px]">
                <div className="mb-3 xs:mb-4 md:mb-6">
                    <div className="flex items-start justify-between gap-2 xs:gap-3 md:gap-4 mb-2 md:mb-3">
                        <h3 className="text-base xs:text-lg sm:text-xl font-extrabold text-gray-900 group-hover:text-[#C04000] transition-colors duration-300 leading-snug line-clamp-2 min-h-[40px] xs:min-h-[48px] sm:min-h-[56px]">
                            {flight.title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-1.5 xs:gap-2 text-gray-500 text-[11px] xs:text-xs sm:text-sm font-medium">
                        <MapPin size={12} className="xs:w-[14px] xs:h-[14px] md:w-4 md:h-4 text-[#C04000] shrink-0" />
                        <span className="line-clamp-1">{flight.location}</span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-3 xs:pt-4 md:pt-6 border-t border-gray-100 flex items-center justify-between gap-2 xs:gap-3 md:gap-4">
                    <div className="flex flex-col">
                        <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold text-[#C04000] tracking-tight leading-none">
                            <PriceDisplay amount={flight.price} />
                        </div>
                    </div>

                    <Link
                        href={`/${lang}/flights/${(lang === 'fr' ? (flight.slug_fr || flight.slug) : flight.slug) || flight.id}`}
                        className="flex items-center justify-center gap-1 xs:gap-1.5 md:gap-2 text-[11px] xs:text-xs sm:text-sm font-bold text-white bg-[#C04000] hover:bg-[#A03000] active:scale-95 px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 md:py-3.5 rounded-lg md:rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 group/btn whitespace-nowrap"
                    >
                        {t.explore || 'Explore'}
                        <ArrowRight size={14} className="xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] transition-transform group-hover/btn:translate-x-1" strokeWidth={2.5} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface SuggestionCardProps {
    title: string;
    subtitle: string;
    image: string;
    badgeType?: 'most-reserved' | 'vip';
    rating: string;
    price: React.ReactNode;
    link: string;
}

export default function SuggestionCard({ title, subtitle, image, badgeType, rating, price, link }: SuggestionCardProps) {
    return (
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
            {/* Badge */}
            {badgeType === 'most-reserved' && (
                <div className="absolute top-4 right-[-30px] bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white py-1 px-8 rotate-45 text-xs font-bold shadow-md z-10">
                    MOST RESERVED
                </div>
            )}
            {badgeType === 'vip' && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#C04000] to-[#D84A1B] backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white/20 z-10">
                    VIP
                </div>
            )}

            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Content Section - Below Image */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#C04000] transition-colors">
                    {title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm text-gray-600 mb-4">
                    {subtitle}
                </p>

                {/* Bottom Row: Rating + Price + Button */}
                <div className="flex items-center justify-between">
                    {/* Left: Rating + Price */}
                    <div className="flex items-center gap-3">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">{rating}</span>
                        </div>

                        {/* Price */}
                        <div className="text-[#C04000] font-bold text-xl">
                            {price}
                        </div>
                    </div>

                    {/* Right: Button */}
                    <Link
                        href={link}
                        className="bg-gradient-to-r from-[#C04000] to-[#D84A1B] hover:from-[#A03000] hover:to-[#C04000] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-md transition-all hover:shadow-lg"
                    >
                        CHECK DETAILS
                    </Link>
                </div>
            </div>
        </div>
    );
}

'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

interface ReviewCardProps {
    name: string;
    date: string;
    rating: number; // 0 to 5
    text: string;
    avatar?: string; // If provided, shows image in square avatar
    initial?: string; // If no avatar, shows initial letter
    bgColor?: string; // Background color for initial square
    rotation?: string; // Optional rotation for visual variety (e.g., 'rotate-1', '-rotate-2')
    locale?: string;
}

export default function ReviewCard({
    name,
    date,
    rating,
    text,
    avatar,
    initial,
    bgColor = 'bg-[#3E1C1A]',
    rotation = '',
    locale = 'en'
}: ReviewCardProps) {
    return (
        <div className={`relative bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 min-w-[320px] max-w-[380px] transition-all duration-300 ${rotation}`}>
            <div className="flex items-start gap-4">
                {/* Avatar - ALWAYS SQUARE with rounded corners */}
                <div className="relative shrink-0 -ml-2 -mt-2">
                    {avatar ? (
                        // Square avatar with image
                        <div className="w-20 h-20 rounded-2xl overflow-hidden relative border-4 border-white shadow-lg bg-gray-200">
                            <Image
                                src={avatar}
                                alt={name}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </div>
                    ) : (
                        // Square avatar with initial
                        <div className={`${bgColor} w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold uppercase shadow-lg border-4 border-white`}>
                            {initial || name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1 pt-1">
                    {/* Name & Stars - Same line */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-base font-bold text-gray-900">{name}</span>
                        <div className="flex gap-1 shrink-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={16}
                                    className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <span className="text-xs text-gray-500 font-medium -mt-1">
                        {new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            {/* Review Text */}
            <p className="text-sm leading-relaxed text-gray-700 font-normal mt-4 ml-1">
                {text}
            </p>


        </div>
    );
}

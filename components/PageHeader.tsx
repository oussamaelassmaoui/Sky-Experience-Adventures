'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import StandardWave from './StandardWave';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backgroundImage: string;
    waveColor?: string;
    heightClass?: string;
    withBlur?: boolean;
}

export default function PageHeader({
    title,
    subtitle,
    backgroundImage,
    waveColor = '#FDFBF7',
    heightClass = 'h-[50vh] min-h-[400px]',
    withBlur = false
}: PageHeaderProps) {
    return (
        <div className={`relative w-full ${heightClass} flex items-center justify-center`}>
            {/* Background Image */}
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    className="object-cover object-bottom"
                    priority
                />

                {/* Blur Overlay */}
                {withBlur && (
                    <div className="absolute inset-0 backdrop-blur-[3px] z-[1]" />
                )}

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-black/40 z-[2]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[2]" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center mt-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    {subtitle && (
                        <div className="inline-block mb-4">
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
                                <p className="text-white font-semibold text-xs sm:text-sm uppercase tracking-widest">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-playfair font-bold text-white mb-6 drop-shadow-lg">
                        {title}
                    </h1>
                </motion.div>
            </div>

            {/* Bottom Wave - Built-in for consistency */}
            <div className="absolute bottom-[-1px] left-0 right-0 z-20">
                <StandardWave fillColor={waveColor} className="w-full" />
            </div>
        </div>
    );
}

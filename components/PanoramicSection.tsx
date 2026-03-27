'use client';

import React from 'react';
import { motion } from "framer-motion";
import Image from "next/image";

interface PanoramicSectionProps {
    dict: any;
}

export default function PanoramicSection({ dict }: PanoramicSectionProps) {
    return (
        <section className="relative w-full py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

                    {/* 1. Text Content (Left - ~25%) */}
                    <motion.div
                        className="w-full lg:w-1/4 flex flex-col justify-center"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
                            {dict.panoramic.title}
                        </h2>
                        <h3 className="text-lg md:text-xl font-bold text-[#1a2632] mb-6">
                            {dict.panoramic.subtitle}
                        </h3>
                        <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                            {dict.panoramic.desc}
                        </p>
                    </motion.div>

                    {/* 2. Main Image (Center - ~40%) */}
                    <motion.div
                        className="w-full lg:w-[45%] relative h-[300px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Image
                            src="/images/panoramic.webp"
                            alt="Panoramic View of Hot Air Balloons"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 45vw"
                        />
                    </motion.div>

                    {/* 3. Stacked Images (Right - ~35%) */}
                    <div className="w-full lg:w-[30%] flex flex-col gap-6 h-[500px]">
                        {/* Top Image */}
                        <motion.div
                            className="relative flex-1 rounded-[2rem] overflow-hidden shadow-xl"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Image
                                src="/images/mariage-main.webp"
                                alt="Couple enjoying balloon flight"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 30vw"
                            />
                        </motion.div>

                        {/* Bottom Image */}
                        <motion.div
                            className="relative flex-1 rounded-[2rem] overflow-hidden shadow-xl"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Image
                                src="/images/classic1.webp"
                                alt="Balloons in the sky"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, 30vw"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}

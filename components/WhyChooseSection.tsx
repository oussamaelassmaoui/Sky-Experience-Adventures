'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Calendar, Users } from 'lucide-react';

interface WhyChooseSectionProps {
    dict: any;
}

const WhyChooseSection = ({ dict }: WhyChooseSectionProps) => {
    const features = [
        {
            icon: CreditCard,
            title: dict.why_choose.pricing.title,
            description: dict.why_choose.pricing.desc,
            gradient: 'from-red-50 to-orange-50'
        },
        {
            icon: MapPin,
            title: dict.why_choose.coverage.title,
            description: dict.why_choose.coverage.desc,
            gradient: 'from-orange-50 to-amber-50'
        },
        {
            icon: Calendar,
            title: dict.why_choose.booking.title,
            description: dict.why_choose.booking.desc,
            gradient: 'from-amber-50 to-yellow-50'
        },
        {
            icon: Users,
            title: dict.why_choose.guides.title,
            description: dict.why_choose.guides.desc,
            gradient: 'from-yellow-50 to-orange-50'
        }
    ];

    return (
        <section className="py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" viewBox="0 0 1440 800" preserveAspectRatio="none">
                    <path d="M0,200 Q360,100 720,200 T1440,200 L1440,0 L0,0 Z" fill="#C04000" />
                    <path d="M0,600 Q360,500 720,600 T1440,600 L1440,800 L0,800 Z" fill="#C04000" />
                </svg>
            </div>

            <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20"
                >
                    <h3 className="font-script text-[#C04000] text-xl xs:text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
                        {dict.why_choose.subtitle}
                    </h3>
                    <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#C04000] mb-4 sm:mb-6">
                        {dict.why_choose.title}
                    </h2>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 md:gap-10 lg:gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="flex flex-col items-center text-center p-6 xs:p-7 sm:p-8 rounded-2xl bg-white hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#C04000]/20 hover:-translate-y-2">
                                {/* Icon Container */}
                                <div className={`w-20 h-20 xs:w-24 xs:h-24 md:w-28 md:h-28 mb-5 xs:mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500`}>
                                    {/* Animated circle background */}
                                    <div className="absolute inset-0 bg-[#C04000]/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                                    <feature.icon
                                        className="text-[#C04000] relative z-10 group-hover:rotate-12 transition-transform duration-500"
                                        size={40}
                                        strokeWidth={2}
                                    />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg xs:text-xl md:text-2xl font-bold text-[#C04000] mb-3 xs:mb-4 group-hover:scale-105 transition-transform duration-300">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm xs:text-base md:text-lg text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;

'use client';

import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SEOContentProps {
    dictionary: {
        seo_section: {
            title: string;
            content: string;
            occasions_title?: string;
            occasions?: string[];
        }
    }
}

export default function SEOContent({ dictionary }: SEOContentProps) {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/classic-main.webp"
                                alt="Hot Air Balloon Marrakech Experience"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Decorative Offset Border */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#C04000]/20 rounded-2xl -z-10 hidden lg:block"></div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2"
                    >
                        <span className="text-[#C04000] font-bold tracking-widest text-sm uppercase mb-4 block">
                            Authentic Morocco
                        </span>

                        <h2 className="text-4xl md:text-5xl font-playfair text-gray-900 mb-8 leading-tight">
                            {dictionary.seo_section.title}
                        </h2>

                        <div className="prose prose-lg text-gray-600 prose-headings:font-playfair prose-headings:text-gray-900 mb-10">
                            <ReactMarkdown>
                                {dictionary.seo_section.content}
                            </ReactMarkdown>

                            {/* Occasions List - Long Tail SEO */}
                            {dictionary.seo_section.occasions && (
                                <div className="mt-8 mb-4">
                                    <h4 className="font-playfair font-bold text-xl text-gray-900 mb-4">{dictionary.seo_section.occasions_title}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {dictionary.seo_section.occasions.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-[#C04000]/30 transition-colors">
                                                <span className="text-[#C04000] text-lg">✦</span>
                                                <span className="text-gray-700 font-medium text-sm sm:text-base">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Minimalist Stats */}
                        <div className="grid grid-cols-3 gap-8 py-8 border-t border-gray-100">
                            <div>
                                <span className="block text-4xl font-playfair text-gray-900 mb-1">20+</span>
                                <span className="text-sm text-gray-500 uppercase tracking-wide">Years Experience</span>
                            </div>
                            <div>
                                <span className="block text-4xl font-playfair text-gray-900 mb-1">100%</span>
                                <span className="text-sm text-gray-500 uppercase tracking-wide">Safety Record</span>
                            </div>
                            <div>
                                <span className="block text-4xl font-playfair text-gray-900 mb-1">5k+</span>
                                <span className="text-sm text-gray-500 uppercase tracking-wide">Happy Flyers</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

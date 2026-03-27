'use client';

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
interface FAQItem {
    id: string;
    number: string;
    question: string;
    answer: string;
}

interface FAQSectionProps {
    dict: any;
}

export default function FAQSection({ dict }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null); // All closed by default
    const items: FAQItem[] = dict.faq.items;

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-[#FDFBF7] relative z-10 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[#C04000] font-bold tracking-wider text-sm uppercase mb-3 block">Got Questions?</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-playfair">{dict.faq.title}</h2>
                    <p className="text-gray-600 text-lg md:text-xl font-light max-w-2xl mx-auto">
                        {dict.faq.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {items.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-xl ring-1 ring-[#C04000]/20' : 'shadow-md hover:shadow-lg'}`}
                            >
                                <div
                                    onClick={() => toggleFAQ(index)}
                                    className="flex items-start p-6 cursor-pointer select-none"
                                >
                                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mr-5 transition-all duration-300 ${isOpen ? 'bg-[#C04000] text-white shadow-lg scale-110' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                        {item.number}
                                    </div>

                                    <div className="flex-grow pt-1">
                                        <h3 className={`font-bold text-lg leading-snug transition-colors duration-300 ${isOpen ? 'text-[#C04000]' : 'text-gray-800'}`}>
                                            {item.question}
                                        </h3>
                                    </div>

                                    <div className={`shrink-0 ml-4 pt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                        {isOpen ? (
                                            <div className="bg-[#C04000]/10 rounded-full p-2 text-[#C04000]">
                                                <Minus size={20} />
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-full p-2 text-gray-400 group-hover:bg-gray-100">
                                                <Plus size={20} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-8 pt-0 pl-[4.5rem] text-gray-600 leading-relaxed">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

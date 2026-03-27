'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, ArrowRight } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import axios from 'axios';

interface ContactSectionProps {
    dict: any;
    lang: string;
}

export default function ContactSection({ dict, lang }: ContactSectionProps) {
    const c = dict.contact_section;

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            // Split "name" into firstName + lastName for the backend
            const [firstName, ...rest] = formData.name.trim().split(' ');
            const lastName = rest.join(' ') || '';

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/contact`,
                { firstName, lastName, email: formData.email, message: formData.message }
            );
            setStatus('success');
            setTimeout(() => {
                setFormData({ name: '', email: '', message: '' });
                setStatus('idle');
            }, 3000);
        } catch {
            setStatus('error');
        }
    };


    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="py-20 md:py-28 bg-[#FDFBF7] relative overflow-hidden"
        >
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C04000]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 max-w-7xl relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <span className="text-[#C04000] font-bold tracking-widest text-sm uppercase mb-3 block">
                        {c.label}
                    </span>
                    <h2 id="contact-heading" className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4 leading-tight">
                        {c.title}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        {c.subtitle}
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-10 items-start">

                    {/* LEFT: Info cards + quick contact — desktop only */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-5 hidden lg:block"
                    >
                        {/* Info cards row */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Phone / WA */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#C04000]/20 transition-all duration-300 group">
                                <div className="w-11 h-11 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C04000] transition-colors">
                                    <Phone className="text-[#C04000] group-hover:text-white transition-colors" size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-sm">{c.card_phone_title}</h3>
                                <a href="tel:+212751622180" className="text-gray-600 hover:text-[#C04000] text-sm transition-colors block">+212 751-622180</a>
                                <a href="https://wa.me/212751622180" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 mt-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
                                    <FaWhatsapp size={16} /> WhatsApp
                                </a>
                            </div>

                            {/* Email */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#C04000]/20 transition-all duration-300 group">
                                <div className="w-11 h-11 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C04000] transition-colors">
                                    <Mail className="text-[#C04000] group-hover:text-white transition-colors" size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-sm">{c.card_email_title}</h3>
                                <a href="mailto:skyexperiencemarrakech@gmail.com" className="text-gray-600 hover:text-[#C04000] text-sm break-all transition-colors">
                                    skyexperiencemarrakech@gmail.com
                                </a>
                            </div>

                            {/* Location */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#C04000]/20 transition-all duration-300 group">
                                <div className="w-11 h-11 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C04000] transition-colors">
                                    <MapPin className="text-[#C04000] group-hover:text-white transition-colors" size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-sm">{c.card_location_title}</h3>
                                <p className="text-gray-600 text-sm">{c.card_location_value}</p>
                                <a href="https://maps.app.goo.gl/t7FfvdK91oPT2wAj6" target="_blank" rel="noopener noreferrer"
                                    className="text-[#C04000] hover:underline text-xs mt-1 block transition-colors">{c.card_location_link}</a>
                            </div>

                            {/* Hours */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#C04000]/20 transition-all duration-300 group">
                                <div className="w-11 h-11 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C04000] transition-colors">
                                    <Clock className="text-[#C04000] group-hover:text-white transition-colors" size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-sm">{c.card_hours_title}</h3>
                                <p className="text-gray-600 text-xs">{c.card_hours_weekdays}</p>
                                <p className="text-gray-600 text-xs">{c.card_hours_sunday}</p>
                            </div>
                        </div>

                        {/* Social + CTA */}
                        <div className="bg-gradient-to-r from-[#C04000] to-[#D84A1B] rounded-2xl p-6 text-white">
                            <p className="font-bold text-lg mb-1">{c.cta_box_title}</p>
                            <p className="text-white/80 text-sm mb-5">{c.cta_box_subtitle}</p>
                            <div className="flex flex-wrap gap-3">
                                <a href="https://wa.me/212751622180" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white text-[#C04000] px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow">
                                    <FaWhatsapp size={18} /> WhatsApp
                                </a>
                                <a href="https://www.instagram.com/skyexperience_marrakech" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-white/20 transition-colors">
                                    <FaInstagram size={18} /> Instagram
                                </a>
                                <a href="https://web.facebook.com/profile.php?id=61587155890037" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-white/20 transition-colors">
                                    <FaFacebook size={18} /> Facebook
                                </a>
                                <Link href={`/${lang}/contact`}
                                    className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-white/20 transition-colors">
                                    {c.full_contact_link} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Quick form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="bg-white rounded-2xl p-7 md:p-9 shadow-sm border border-gray-100"
                    >
                        <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-1">{c.form_title}</h3>
                        <p className="text-gray-500 text-sm mb-6">{c.form_subtitle}</p>

                        {/* Response time indicator */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-center gap-2 text-blue-700 text-sm">
                            <Clock size={16} className="flex-shrink-0" />
                            <span>{c.response_time}</span>
                        </div>

                        {status === 'success' && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5" role="status">
                                <p className="text-green-800 font-medium text-sm">✓ {c.success_msg}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="hs-name" className="block text-sm font-medium text-gray-700 mb-1.5">{c.field_name} <span className="text-red-500">*</span></label>
                                    <input
                                        id="hs-name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C04000] focus:border-transparent outline-none transition-all text-sm"
                                        placeholder={c.placeholder_name}
                                        autoComplete="name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hs-email" className="block text-sm font-medium text-gray-700 mb-1.5">{c.field_email} <span className="text-red-500">*</span></label>
                                    <input
                                        id="hs-email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C04000] focus:border-transparent outline-none transition-all text-sm"
                                        placeholder={c.placeholder_email}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="hs-message" className="block text-sm font-medium text-gray-700 mb-1.5">{c.field_message} <span className="text-red-500">*</span></label>
                                <textarea
                                    id="hs-message"
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C04000] focus:border-transparent outline-none transition-all resize-none text-sm"
                                    placeholder={c.placeholder_message}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl transition-all text-white ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C04000] hover:bg-[#A03000] hover:shadow-lg'}`}
                            >
                                {status === 'loading' ? (
                                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{c.btn_sending}</>
                                ) : (
                                    <><Send size={17} />{c.btn_send}</>
                                )}
                            </button>

                            <p className="text-center text-gray-400 text-xs pt-1">
                                {c.form_note}{' '}
                                <Link href={`/${lang}/contact`} className="text-[#C04000] underline hover:text-[#A03000]">
                                    {c.full_contact_link}
                                </Link>
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

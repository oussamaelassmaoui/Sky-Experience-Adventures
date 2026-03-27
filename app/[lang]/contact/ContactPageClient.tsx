'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

interface ContactPageClientProps {
    dict: any;
    lang: string;
}

export default function ContactPageClient({ dict, lang }: ContactPageClientProps) {
    const t = dict.contact_page;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        privacy: false
    });

    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = t.error_name;
        if (!formData.email.trim()) {
            newErrors.email = t.error_email_required;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t.error_email_invalid;
        }
        if (!formData.subject.trim()) newErrors.subject = t.error_subject;
        if (!formData.message.trim()) newErrors.message = t.error_message;
        if (!formData.privacy) newErrors.privacy = t.error_privacy;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSubmitStatus('loading');

        try {
            // Split name into firstName + lastName
            const [firstName, ...rest] = formData.name.trim().split(' ');
            const lastName = rest.join(' ') || '';

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/contact`,
                {
                    firstName,
                    lastName,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    subject: formData.subject,
                    message: formData.message,
                }
            );

            setSubmitStatus('success');
            setTimeout(() => {
                handleReset();
                setSubmitStatus('idle');
            }, 4000);
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
        }
    };

    const handleReset = () => {
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', privacy: false });
        setErrors({});
        setSubmitStatus('idle');
    };


    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

                {/* Contact Information Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-[#C04000]/20 transition-all duration-300 group"
                >
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C04000] transition-colors">
                        <Phone className="text-[#C04000] group-hover:text-white transition-colors" size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">{t.card_contact_title}</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <FaWhatsapp className="text-green-600 mt-1 flex-shrink-0" size={16} />
                            <div>
                                <p className="text-gray-500 text-xs mb-1">WhatsApp:</p>
                                <a href="tel:+212751622180" className="text-gray-900 hover:text-[#C04000] font-medium transition-colors">+212 751-622180</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <Mail className="text-[#C04000] mt-1 flex-shrink-0" size={16} />
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Email:</p>
                                <a href="mailto:skyexperiencemarrakech@gmail.com" className="text-gray-900 hover:text-[#C04000] font-medium break-all transition-colors">skyexperiencemarrakech@gmail.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <MapPin className="text-[#C04000] mt-1 flex-shrink-0" size={16} />
                            <div>
                                <p className="text-gray-500 text-xs mb-1">{t.label_address}:</p>
                                <p className="text-gray-900 font-medium">{t.address_line1}</p>
                                <p className="text-gray-900 font-medium">{t.address_line2}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Social Media Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-[#C04000]/20 transition-all duration-300 group"
                >
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C04000] transition-colors">
                        <MessageSquare className="text-[#C04000] group-hover:text-white transition-colors" size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">{t.card_social_title}</h3>

                    <div className="space-y-3">
                        <a href="https://wa.me/212751622180" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-200 group/social">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center group-hover/social:bg-green-500 transition-colors">
                                <FaWhatsapp className="text-green-600 group-hover/social:text-white transition-colors" size={20} />
                            </div>
                            <span className="text-gray-900 font-medium group-hover/social:text-green-700">WhatsApp</span>
                        </a>

                        <a href="https://www.instagram.com/skyexperience_marrakech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 hover:border-pink-200 border border-transparent transition-all duration-200 group/social">
                            <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center group-hover/social:bg-pink-500 transition-colors">
                                <FaInstagram className="text-pink-600 group-hover/social:text-white transition-colors" size={20} />
                            </div>
                            <span className="text-gray-900 font-medium group-hover/social:text-pink-700">Instagram</span>
                        </a>

                        <a href="https://web.facebook.com/profile.php?id=61587155890037" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200 group/social">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover/social:bg-blue-600 transition-colors">
                                <FaFacebook className="text-blue-600 group-hover/social:text-white transition-colors" size={20} />
                            </div>
                            <span className="text-gray-900 font-medium group-hover/social:text-blue-700">Facebook</span>
                        </a>
                    </div>
                </motion.div>

                {/* Opening Hours Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-[#C04000]/20 transition-all duration-300 group"
                >
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#C04000] transition-colors">
                        <Clock className="text-[#C04000] group-hover:text-white transition-colors" size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-4">{t.card_hours_title}</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-gray-600">{t.hours_weekdays}</span>
                            <span className="text-gray-900 font-medium">{t.hours_value_weekdays}</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-gray-600">{t.hours_saturday}</span>
                            <span className="text-gray-900 font-medium">{t.hours_value_saturday}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t.hours_sunday}</span>
                            <span className="text-gray-900 font-medium">{t.hours_value_sunday}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Map and Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 md:p-8 shadow-md"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.map_title}</h2>
                    <p className="text-gray-600 mb-6 text-sm">{t.map_subtitle}</p>

                    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-md">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4259.5757124776555!2d-8.0163231!3d31.632623600000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafef60458f463d%3A0xa0894400db0e98ab!2sSky%20Experience%20Hot%20Air%20Balloon%20Marrakech!5e1!3m2!1sfr!2sma!4v1772553025425!5m2!1sfr!2sma"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#C04000] text-white p-4 sm:p-5 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3">
                            <MapPin size={24} className="flex-shrink-0" />
                            <div>
                                <p className="font-bold text-sm sm:text-base">{t.address_line1}</p>
                                <p className="text-xs sm:text-sm opacity-90">{t.address_line2}</p>
                            </div>
                        </div>
                        <a
                            href="https://maps.app.goo.gl/t7FfvdK91oPT2wAj6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-[#C04000] px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm hover:bg-gray-100 transition-colors w-full sm:w-auto text-center whitespace-nowrap"
                        >
                            {t.get_directions}
                        </a>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 md:p-8 shadow-md"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.form_title}</h2>
                    <p className="text-gray-600 mb-6 text-sm">{t.form_subtitle}</p>

                    {/* Response Time Indicator */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-blue-800">
                            <Clock size={18} />
                            <p className="font-medium text-sm">{t.response_time}</p>
                        </div>
                    </div>

                    {/* Success Message */}
                    {submitStatus === 'success' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4" role="alert">
                            <p className="text-green-800 font-medium">✓ {t.success_title}</p>
                            <p className="text-green-600 text-sm mt-1">{t.success_msg}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {submitStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4" role="alert">
                            <p className="text-red-800 font-medium">✗ {t.error_title}</p>
                            <p className="text-red-600 text-sm mt-1">{t.error_retry}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.field_name} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                                        className={`w-full px-4 py-3 pl-10 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#C04000] focus:border-transparent outline-none transition-all`}
                                        placeholder={t.placeholder_name}
                                        autoComplete="name"
                                    />
                                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                                {errors.name && <p className="text-red-600 text-xs mt-1" role="alert">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t.field_email} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C04000] focus:border-transparent outline-none transition-all"
                                        placeholder={t.placeholder_email}
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.field_phone} <span className="text-gray-400 text-xs">({t.optional})</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C04000] focus:border-transparent outline-none transition-all"
                                    placeholder={t.placeholder_phone}
                                    autoComplete="tel"
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.field_subject} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => { setFormData({ ...formData, subject: e.target.value }); setErrors({ ...errors, subject: '' }); }}
                                    className={`w-full px-4 py-3 pl-10 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#C04000] focus:border-transparent outline-none transition-all`}
                                    placeholder={t.placeholder_subject}
                                />
                                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                            {errors.subject && <p className="text-red-600 text-xs mt-1" role="alert">{errors.subject}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.field_message} <span className="text-red-500">*</span>
                                <span className="text-gray-400 text-xs ml-2">({formData.message.length}/500)</span>
                            </label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={(e) => { if (e.target.value.length <= 500) { setFormData({ ...formData, message: e.target.value }); setErrors({ ...errors, message: '' }); } }}
                                rows={5}
                                className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#C04000] focus:border-transparent outline-none transition-all resize-none`}
                                placeholder={t.placeholder_message}
                                maxLength={500}
                            ></textarea>
                            {errors.message && <p className="text-red-600 text-xs mt-1" role="alert">{errors.message}</p>}
                        </div>

                        {/* Privacy Checkbox */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <input
                                type="checkbox"
                                id="privacy"
                                checked={formData.privacy}
                                onChange={(e) => { setFormData({ ...formData, privacy: e.target.checked }); setErrors({ ...errors, privacy: '' }); }}
                                className="mt-1 w-4 h-4 text-[#C04000] border-gray-300 rounded focus:ring-[#C04000]"
                            />
                            <label htmlFor="privacy" className="text-sm text-gray-700">
                                {t.privacy_accept} <a href="/privacy" className="text-[#C04000] underline hover:text-[#A03000]">{t.privacy_link}</a>. <span className="text-red-500">*</span>
                            </label>
                        </div>
                        {errors.privacy && <p className="text-red-600 text-xs mt-1" role="alert">{errors.privacy}</p>}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={submitStatus === 'loading'}
                                className={`flex-1 ${submitStatus === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C04000] hover:bg-[#A03000]'} text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2`}
                            >
                                {submitStatus === 'loading' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>{t.btn_sending}</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        {t.btn_send}
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={submitStatus === 'loading'}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.btn_clear}
                            </button>
                        </div>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600 text-sm mb-3">{t.or_contact_directly}</p>
                            <div className="flex justify-center gap-4">
                                <a
                                    href="https://wa.me/212751622180"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                                >
                                    <FaWhatsapp size={20} />
                                    WhatsApp
                                </a>
                                <a
                                    href="mailto:skyexperiencemarrakech@gmail.com"
                                    className="flex items-center gap-2 text-[#C04000] hover:text-[#A03000] font-medium"
                                >
                                    <Mail size={20} />
                                    {t.email_link}
                                </a>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

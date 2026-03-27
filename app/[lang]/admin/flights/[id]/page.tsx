'use client';

import React, { useEffect, useState, use, useCallback, useRef, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    ArrowLeft, Upload, X, Plus, Save, Loader2, AlertCircle,
    Languages, ChevronDown, CheckCircle, Cloud, Database, Check
} from 'lucide-react';
import Link from 'next/link';
import api from '@/services/api';
import DynamicList from '@/components/admin/DynamicList';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProgramItem { time: string; title: string; title_fr: string; description: string; description_fr: string; }
interface FeatureItem { icon: string; title: string; title_fr: string; description: string; description_fr: string; }

interface FlightFormData {
    title: string; slug: string; overview: string;
    highlights: string[]; included: string[]; excluded: string[];
    title_fr: string; slug_fr: string; overview_fr: string;
    highlights_fr: string[]; included_fr: string[]; excluded_fr: string[];
    price: number; currency: string; category: string; tags: string[];
    program: ProgramItem[]; features: FeatureItem[];
    duration: string; location: string; destination: string;
    tourType: string; difficulty: string;
    minPeople: number; maxPeople: number; minAge: number;
    metaDescription: string; metaDescription_fr: string;
    metaKeywords: string[]; metaKeywords_fr: string[];
    featured: boolean; popular: boolean; status: 'active' | 'inactive' | 'seasonal';
    maxCapacityPerDay: number; weatherPolicy: string;
}

type FieldErrors = Partial<Record<keyof FlightFormData | 'mainImage', string>>;
import { toSlug, Section, DropZone, UploadProgress, UploadStep } from '@/components/admin/AdminFormShared';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FlightForm({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { lang, id } = use(params);
    const isNew = id === 'new';
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'en' | 'fr'>('en');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [uploadStep, setUploadStep] = useState<UploadStep>('idle');

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [slugFrManuallyEdited, setSlugFrManuallyEdited] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const defaultFormData: FlightFormData = {
        title: '', slug: '', overview: '',
        highlights: [], included: [], excluded: [],
        title_fr: '', slug_fr: '', overview_fr: '',
        highlights_fr: [], included_fr: [], excluded_fr: [],
        price: 0, currency: 'USD', category: 'vip', tags: [],
        program: [], features: [],
        duration: '1 day', location: 'Ouled El Garne, Bourouss, Morocco',
        destination: 'Marrakech', tourType: 'Royal Flight',
        difficulty: 'easy', minPeople: 2, maxPeople: 16, minAge: 4,
        metaDescription: '', metaDescription_fr: '',
        metaKeywords: [], metaKeywords_fr: [],
        featured: false, popular: false, status: 'active',
        maxCapacityPerDay: 0, weatherPolicy: '',
    };

    const [formData, setFormData] = useState<FlightFormData>(defaultFormData);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [additionalImages, setAdditionalImages] = useState<File[]>([]);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);



    // ── Fetch (edit mode) ──────────────────────────────────────────────────────
    const safeParseJSON = <T = any>(data: any): T[] => {
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') { try { const p = JSON.parse(data); return Array.isArray(p) ? p : []; } catch { return []; } }
        return [];
    };

    useEffect(() => {
        if (!isNew) fetchFlight();
    }, [id]);

    const fetchFlight = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/flights/${id}`);
            const f = data.flight;
            setFormData({
                title: f.title || '', slug: f.slug || '', overview: f.overview || '',
                highlights: safeParseJSON<string>(f.highlights), included: safeParseJSON<string>(f.included), excluded: safeParseJSON<string>(f.excluded),
                title_fr: f.title_fr || '', slug_fr: f.slug_fr || '', overview_fr: f.overview_fr || '',
                highlights_fr: safeParseJSON<string>(f.highlights_fr), included_fr: safeParseJSON<string>(f.included_fr), excluded_fr: safeParseJSON<string>(f.excluded_fr),
                price: f.price || 0, currency: f.currency || 'USD', category: f.category || 'vip',
                tags: safeParseJSON<string>(f.tags), program: safeParseJSON<ProgramItem>(f.program),
                features: safeParseJSON<FeatureItem>(f.features),
                duration: f.duration || '1 day', location: f.location || '', destination: f.destination || 'Marrakech',
                tourType: f.tourType || 'Royal Flight', difficulty: f.difficulty || 'easy',
                minPeople: f.minPeople || 2, maxPeople: f.maxPeople || 16, minAge: f.minAge || 4,
                maxCapacityPerDay: f.maxCapacityPerDay || 0, weatherPolicy: f.weatherPolicy || '',
                metaDescription: f.metaDescription || '', metaDescription_fr: f.metaDescription_fr || '',
                metaKeywords: safeParseJSON<string>(f.metaKeywords), metaKeywords_fr: safeParseJSON<string>(f.metaKeywords_fr),
                featured: f.featured || false, popular: f.popular || false, status: f.status || 'active',
            });
            setMainImagePreview(f.mainImage || '');
            setExistingImages(f.images || []);
            setSlugManuallyEdited(true);
            setSlugFrManuallyEdited(true); // don't auto-overwrite on edit
        } catch { setError('Failed to load flight.'); }
        finally { setLoading(false); }
    };

    // ── Auto-slug from title (EN) ─────────────────────────────────────────────
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            title: value,
            ...(!slugManuallyEdited ? { slug: toSlug(value) } : {}),
        }));
    }, [slugManuallyEdited]);

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugManuallyEdited(true);
        setFormData(prev => ({ ...prev, slug: e.target.value }));
    };

    // ── Auto-slug from title (FR) ─────────────────────────────────────────────
    const handleTitleFrChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            title_fr: value,
            ...(!slugFrManuallyEdited ? { slug_fr: toSlug(value) } : {}),
        }));
    }, [slugFrManuallyEdited]);

    const handleSlugFrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugFrManuallyEdited(true);
        setFormData(prev => ({ ...prev, slug_fr: e.target.value }));
    };

    // ── Generic input handler ──────────────────────────────────────────────────
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name as keyof FlightFormData]) setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    };

    // ── Blur validation ────────────────────────────────────────────────────────
    const validateField = (name: keyof FlightFormData, value: any) => {
        let msg = '';
        if (name === 'title' && !String(value).trim()) msg = 'Title (EN) is required';
        if (name === 'overview' && !String(value).trim()) msg = 'Overview (EN) is required';
        if (name === 'price' && Number(value) <= 0) msg = 'Price must be greater than 0';
        setFieldErrors(prev => ({ ...prev, [name]: msg || undefined }));
    };
    const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        validateField(e.target.name as keyof FlightFormData, e.target.value);
    };

    // ── Program handlers ───────────────────────────────────────────────────────
    const addProgramItem = () => setFormData(p => ({ ...p, program: [...p.program, { time: '', title: '', title_fr: '', description: '', description_fr: '' }] }));
    const removeProgramItem = (i: number) => setFormData(p => ({ ...p, program: p.program.filter((_, idx) => idx !== i) }));
    const handleProgramChange = (i: number, field: keyof ProgramItem, val: string) =>
        setFormData(p => ({ ...p, program: p.program.map((it, idx) => idx === i ? { ...it, [field]: val } : it) }));

    // ── Feature handlers ───────────────────────────────────────────────────────
    const addFeatureItem = () => setFormData(p => ({ ...p, features: [...p.features, { icon: 'check', title: '', title_fr: '', description: '', description_fr: '' }] }));
    const removeFeatureItem = (i: number) => setFormData(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));
    const handleFeatureChange = (i: number, field: keyof FeatureItem, val: string) =>
        setFormData(p => ({ ...p, features: p.features.map((it, idx) => idx === i ? { ...it, [field]: val } : it) }));

    // ── Image handlers ─────────────────────────────────────────────────────────
    const handleMainImageFiles = (files: File[]) => {
        setMainImage(files[0]);
        setMainImagePreview(URL.createObjectURL(files[0]));
        setFieldErrors(prev => ({ ...prev, mainImage: undefined }));
    };
    const handleGalleryFiles = (files: File[]) => {
        setAdditionalImages(prev => [...prev, ...files]);
        setAdditionalImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };
    const removeAdditionalImage = (i: number) => {
        setAdditionalImages(prev => prev.filter((_, idx) => idx !== i));
        setAdditionalImagePreviews(prev => prev.filter((_, idx) => idx !== i));
    };
    const removeExistingImage = (i: number) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));

    // ── Inline error message ───────────────────────────────────────────────────
    const ErrMsg = ({ field }: { field: keyof FieldErrors }) =>
        fieldErrors[field] ? <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors[field]}</p> : null;

    // ── Section completion badges ──────────────────────────────────────────────
    const generalBadge: 'ok' | 'warn' = (formData.title && formData.price > 0 && formData.tourType) ? 'ok' : 'warn';
    const contentBadge: 'ok' | 'warn' = (formData.overview) ? 'ok' : 'warn';
    const imageBadge: 'ok' | 'warn' = (mainImagePreview) ? 'ok' : 'warn';

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Front-end validation sweep
        const errors: FieldErrors = {};
        if (!formData.title.trim()) errors.title = 'Title (EN) is required';
        if (!formData.overview.trim()) errors.overview = 'Overview (EN) is required';
        if (formData.price <= 0) errors.price = 'Price must be greater than 0';
        if (isNew && !mainImage) errors.mainImage = 'Main image is required for new flights';
        if (Object.keys(errors).length) { setFieldErrors(errors); setError('Please fix the highlighted fields before saving.'); return; }

        setSubmitting(true); setError('');
        try {
            // Build FormData
            const data = new FormData();
            const validFeatures = formData.features.filter(i => i.title?.trim() || i.title_fr?.trim());
            const validProgram = formData.program.filter(i => i.title?.trim() || i.title_fr?.trim());

            Object.keys(formData).forEach(key => {
                const value = (formData as any)[key];
                if (key === 'program') { data.append(key, JSON.stringify(validProgram)); }
                else if (key === 'features') { data.append(key, JSON.stringify(validFeatures)); }
                else if (key === 'slug' || key === 'slug_fr') { /* handled below */ }
                else if (key === 'featured' || key === 'popular') { data.append(key, String(value)); }
                else if (Array.isArray(value)) { data.append(key, JSON.stringify(value)); }
                else { data.append(key, String(value)); }
            });
            data.append('slug', formData.slug || toSlug(formData.title));
            data.append('slug_fr', formData.slug_fr || toSlug(formData.title_fr));

            setUploadStep('uploading_images');
            if (mainImage) data.append('mainImage', mainImage);
            additionalImages.forEach(img => data.append('images', img));
            data.append('existingImages', JSON.stringify(existingImages));

            setUploadStep('saving_data');
            if (isNew) {
                await api.post('/flights', data, { headers: { 'Content-Type': null } as any });
            } else {
                await api.put(`/flights/${id}`, data, { headers: { 'Content-Type': null } as any });
            }

            setUploadStep('done');
            setTimeout(() => { router.push(`/${lang}/admin/flights`); }, 800);

        } catch (err: any) {
            setUploadStep('idle');
            // Parse Mongoose validation errors if available
            const serverData = err.response?.data;
            if (serverData?.error) {
                const msg = serverData.error;
                // Try to extract field-level Mongoose errors
                if (msg.includes('validation failed')) {
                    const parts = msg.split(',').map((s: string) => s.trim());
                    const fieldMsgs: FieldErrors = {};
                    parts.forEach((p: string) => {
                        const match = p.match(/Path `(\w+)`/);
                        if (match) fieldMsgs[match[1] as keyof FlightFormData] = p.split(': ').pop() || p;
                    });
                    if (Object.keys(fieldMsgs).length) { setFieldErrors(fieldMsgs); }
                }
                setError(serverData.message || serverData.error || 'Failed to save flight.');
            } else {
                setError(err.message || 'Failed to save flight.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [hasDraft, setHasDraft] = useState(false);

    // ── LocalStorage Draft Persistence ────────────────────────────────────────
    const DRAFT_KEY = `flight-draft-${id}`;

    useEffect(() => {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved && isNew) {
            setHasDraft(true);
        }
    }, [id, isNew]);

    const restoreDraft = () => {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(parsed);
                setHasDraft(false);
                setSlugManuallyEdited(true);
                setSlugFrManuallyEdited(true);
            } catch (e) {
                console.error("Failed to restore draft", e);
            }
        }
    };

    const discardDraft = () => {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
    };

    useEffect(() => {
        if (!formData || loading) return;

        // Don't auto-save if form is empty/default and it's a new flight
        if (isNew && JSON.stringify(formData) === JSON.stringify(defaultFormData)) return;

        const timer = setTimeout(() => {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
            setLastSaved(new Date().toLocaleTimeString());
        }, 10000); // Auto-save every 10s of inactivity

        return () => clearTimeout(timer);
    }, [formData, isNew, loading, id]);

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={40} className="animate-spin text-[#C04000]" />
            <p className="text-gray-500 font-medium">Loading flight…</p>
        </div>
    );

    // ─── Shared input classes ──────────────────────────────────────────────────
    const inputCls = (field?: keyof FieldErrors) =>
        `w-full px-4 py-2.5 rounded-lg border ${fieldErrors[field!] ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-colors`;

    return (
        <div className="max-w-5xl mx-auto pb-32">
            {/* Upload Progress Overlay */}
            <UploadProgress step={uploadStep} />

            {/* Draft Restore Banner */}
            {hasDraft && (
                <div className="mb-6 bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-full text-[#C04000]">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Unsaved draft found!</p>
                            <p className="text-sm text-gray-600">You have an unsaved version of this flight. Would you like to restore it?</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={discardDraft} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Discard</button>
                        <button type="button" onClick={restoreDraft} className="px-4 py-2 bg-[#C04000] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#a33600]">Restore Draft</button>
                    </div>
                </div>
            )}

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href={`/${lang}/admin/flights`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Create New Flight' : 'Edit Flight'}</h1>

                </div>
                {/* Language Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {(['en', 'fr'] as const).map(tab => (
                        <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === tab ? 'bg-white text-[#C04000] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            {tab === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}
                        </button>
                    ))}
                </div>
            </div>




            {/* ── Global Error ────────────────────────────────────────────── */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* ── Visibility & Status ───────────────────────────────── */}
                <Section title="Visibility & Status" defaultOpen badge={formData.status === 'active' ? 'ok' : 'warn'}>
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className={inputCls()}>
                                <option value="active">🟢 Active</option>
                                <option value="inactive">🔴 Inactive</option>
                            </select>
                        </div>

                        {/* Featured */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">⭐ Featured</label>
                            <label htmlFor="featured" className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 bg-white h-[42px] cursor-pointer">
                                <input type="checkbox" id="featured" checked={formData.featured}
                                    onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))} className="sr-only peer" />
                                <div className="relative w-10 h-6 bg-gray-300 rounded-full transition-colors peer-checked:bg-yellow-400
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                    after:bg-white after:rounded-full after:h-5 after:w-5
                                    after:transition-transform peer-checked:after:translate-x-4 after:shadow-sm" />
                                <span className="text-sm text-gray-500 select-none">
                                    {formData.featured ? 'On homepage' : 'Hidden from homepage'}
                                </span>
                            </label>
                        </div>

                        {/* Popular */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">🔥 Popular</label>
                            <label htmlFor="popular" className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 bg-white h-[42px] cursor-pointer">
                                <input type="checkbox" id="popular" checked={formData.popular}
                                    onChange={e => setFormData(p => ({ ...p, popular: e.target.checked }))} className="sr-only peer" />
                                <div className="relative w-10 h-6 bg-gray-300 rounded-full transition-colors peer-checked:bg-blue-500
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                    after:bg-white after:rounded-full after:h-5 after:w-5
                                    after:transition-transform peer-checked:after:translate-x-4 after:shadow-sm" />
                                <span className="text-sm text-gray-500 select-none">
                                    {formData.popular ? 'Badge visible' : 'No badge'}
                                </span>
                            </label>
                        </div>

                    </div>
                </Section>

                {/* ── General Info ───────────────────────────────────────── */}
                <Section title="General Info" defaultOpen badge={generalBadge}>
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                            <div className="flex">
                                <select name="currency" value={formData.currency} onChange={handleInputChange}
                                    className="px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-sm font-bold outline-none focus:border-orange-500">
                                    <option value="USD">USD $</option>
                                    <option value="EUR">EUR €</option>
                                    <option value="MAD">MAD</option>
                                    <option value="GBP">GBP £</option>
                                </select>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} onBlur={onBlur} min="0"
                                    className={`flex-1 px-4 py-2.5 rounded-r-lg border ${fieldErrors.price ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none`} />
                            </div>
                            <ErrMsg field="price" />
                        </div>
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className={inputCls()}>
                                <option value="vip">VIP</option>
                                <option value="romantic offer">Romantic Offer</option>
                                <option value="most reserved">Most Reserved</option>
                                <option value="standard">Standard</option>
                                <option value="classic">Classic</option>
                            </select>
                        </div>
                        {/* Tour Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tour Type *</label>
                            <input type="text" name="tourType" value={formData.tourType} onChange={handleInputChange} placeholder="e.g. Royal Flight" className={inputCls()} />
                        </div>
                        {/* Difficulty */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className={inputCls()}>
                                <option value="easy">Easy</option>
                                <option value="moderate">Moderate</option>
                                <option value="challenging">Challenging</option>
                            </select>
                        </div>
                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                            <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 1 day" className={inputCls()} />
                        </div>
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={inputCls()} />
                        </div>
                        {/* Destination */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
                            <input type="text" name="destination" value={formData.destination} onChange={handleInputChange} className={inputCls()} />
                        </div>
                    </div>

                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider pt-2">Capacity</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Min People', name: 'minPeople', min: 1 },
                            { label: 'Max People', name: 'maxPeople', min: 1 },
                            { label: 'Max / Day', name: 'maxCapacityPerDay', min: 0 },
                            { label: 'Min Age', name: 'minAge', min: 0 },
                        ].map(f => (
                            <div key={f.name}>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{f.label}</label>
                                <input type="number" name={f.name} value={(formData as any)[f.name]} onChange={handleInputChange} min={f.min} className={inputCls()} />
                            </div>
                        ))}
                    </div>
                </Section>

                {/* ── Localized Content ──────────────────────────────────── */}
                <Section title="Localized Content" icon={<Languages size={18} className="text-[#C04000]" />} defaultOpen={true} badge={contentBadge}>
                    <div className="pt-4">
                        {/* Weather Policy (shared) */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Weather Policy (shared)</label>
                            <textarea name="weatherPolicy" value={formData.weatherPolicy} onChange={handleInputChange} rows={2}
                                placeholder="e.g. Flight may be cancelled due to bad weather…" className={inputCls()} />
                        </div>

                        {/* EN Tab */}
                        <div className={activeTab === 'en' ? 'block space-y-6' : 'hidden'}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title (EN) *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleTitleChange} onBlur={onBlur}
                                    className={inputCls('title')} placeholder="e.g. Royal Hot Air Balloon Flight" />
                                <ErrMsg field="title" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL)</label>
                                <div className="flex items-center">
                                    <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg px-3 py-2.5 text-gray-500 text-sm">/flights/</span>
                                    <input type="text" name="slug" value={formData.slug} onChange={handleSlugChange}
                                        placeholder="auto-generated-from-title"
                                        className="flex-1 px-4 py-2.5 rounded-r-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none font-mono text-sm" />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Auto-generated from title. Edit to customise.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Overview (EN) *</label>
                                <textarea name="overview" value={formData.overview} onChange={handleInputChange} onBlur={onBlur} rows={4}
                                    className={inputCls('overview')} />
                                <ErrMsg field="overview" />
                            </div>
                            <DynamicList title="Highlights (EN)" items={formData.highlights}
                                onChange={val => setFormData(p => ({ ...p, highlights: val }))} placeholder="e.g. Sunrise view…" />
                            <DynamicList title="Included (EN)" items={formData.included}
                                onChange={val => setFormData(p => ({ ...p, included: val }))} placeholder="e.g. Breakfast…" />
                            <DynamicList title="Excluded (EN)" items={formData.excluded}
                                onChange={val => setFormData(p => ({ ...p, excluded: val }))} placeholder="e.g. Tips…" />
                            <DynamicList title="Tags" items={formData.tags}
                                onChange={val => setFormData(p => ({ ...p, tags: val }))} placeholder="e.g. romantic, popular…" />
                        </div>

                        {/* FR Tab */}
                        <div className={activeTab === 'fr' ? 'block space-y-6' : 'hidden'}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre (FR)</label>
                                <input type="text" name="title_fr" value={formData.title_fr} onChange={handleTitleFrChange} className={inputCls()} placeholder="ex. Vol en Montgolfière Royal" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (URL FR)</label>
                                <div className="flex items-center">
                                    <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg px-3 py-2.5 text-gray-500 text-sm">/fr/flights/</span>
                                    <input type="text" name="slug_fr" value={formData.slug_fr} onChange={handleSlugFrChange}
                                        placeholder="genere-depuis-titre-fr"
                                        className="flex-1 px-4 py-2.5 rounded-r-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none font-mono text-sm" />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Auto-généré depuis le titre FR. Modifiable.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Aperçu (FR)</label>
                                <textarea name="overview_fr" value={formData.overview_fr} onChange={handleInputChange} rows={4} className={inputCls()} />
                            </div>
                            <DynamicList title="Points Forts (FR)" items={formData.highlights_fr}
                                onChange={val => setFormData(p => ({ ...p, highlights_fr: val }))} placeholder="Ex: Vue lever de soleil…" />
                            <DynamicList title="Inclus (FR)" items={formData.included_fr}
                                onChange={val => setFormData(p => ({ ...p, included_fr: val }))} placeholder="Ex: Petit déjeuner…" />
                            <DynamicList title="Exclus (FR)" items={formData.excluded_fr}
                                onChange={val => setFormData(p => ({ ...p, excluded_fr: val }))} placeholder="Ex: Pourboires…" />
                        </div>
                    </div>
                </Section>

                {/* ── Key Features ───────────────────────────────────────── */}
                <Section title={`Key Features (${formData.features.length})`} badge={formData.features.length > 0 ? 'ok' : null}>
                    <div className="pt-4 flex justify-end">
                        <button type="button" onClick={addFeatureItem}
                            className="text-[#C04000] text-sm font-semibold hover:bg-orange-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                            <Plus size={16} /> Add Feature
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.features.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-xl relative border border-gray-200">
                                <button type="button" onClick={() => removeFeatureItem(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"><X size={18} /></button>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Icon</label>
                                        <select value={item.icon} onChange={e => handleFeatureChange(index, 'icon', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm">
                                            {['check', 'car', 'coffee', 'clock', 'safety', 'camera', 'users'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-12 md:col-span-5">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">English</label>
                                        <input type="text" value={item.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} placeholder="Title (EN)" className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm" />
                                        <textarea value={item.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} placeholder="Description (EN)" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm resize-none" />
                                    </div>
                                    <div className="col-span-12 md:col-span-5">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Français</label>
                                        <input type="text" value={item.title_fr} onChange={e => handleFeatureChange(index, 'title_fr', e.target.value)} placeholder="Titre (FR)" className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm" />
                                        <textarea value={item.description_fr} onChange={e => handleFeatureChange(index, 'description_fr', e.target.value)} placeholder="Description (FR)" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm resize-none" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {formData.features.length === 0 && <p className="text-gray-400 italic text-sm text-center py-4">No features yet. Click "Add Feature" above.</p>}
                    </div>
                </Section>

                {/* ── Program / Itinerary ─────────────────────────────────── */}
                <Section title={`Flight Program / Itinerary (${formData.program.length} steps)`} badge={formData.program.length > 0 ? 'ok' : null}>
                    <div className="pt-4 flex justify-end">
                        <button type="button" onClick={addProgramItem}
                            className="text-[#C04000] text-sm font-semibold hover:bg-orange-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                            <Plus size={16} /> Add Step
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.program.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-xl relative border border-gray-200">
                                <button type="button" onClick={() => removeProgramItem(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"><X size={18} /></button>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Time</label>
                                        <input type="text" value={item.time} onChange={e => handleProgramChange(index, 'time', e.target.value)} placeholder="06:00" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm" />
                                    </div>
                                    <div className="col-span-12 md:col-span-5">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">English</label>
                                        <input type="text" value={item.title} onChange={e => handleProgramChange(index, 'title', e.target.value)} placeholder="Step Title (EN)" className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm" />
                                        <textarea value={item.description} onChange={e => handleProgramChange(index, 'description', e.target.value)} placeholder="Description (EN)" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm resize-none" />
                                    </div>
                                    <div className="col-span-12 md:col-span-5">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Français</label>
                                        <input type="text" value={item.title_fr} onChange={e => handleProgramChange(index, 'title_fr', e.target.value)} placeholder="Titre Étape (FR)" className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm" />
                                        <textarea value={item.description_fr} onChange={e => handleProgramChange(index, 'description_fr', e.target.value)} placeholder="Description (FR)" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 outline-none text-sm resize-none" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {formData.program.length === 0 && <p className="text-gray-400 italic text-sm text-center py-4">No steps yet. Click "Add Step" above.</p>}
                    </div>
                </Section>

                {/* ── SEO ────────────────────────────────────────────────── */}
                <Section title="SEO Settings">
                    <div className="pt-4 space-y-4">
                        <div className={activeTab === 'en' ? 'block space-y-4' : 'hidden'}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description (EN)</label>
                                <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={3} className={inputCls()} placeholder="Brief description for search engines…" />
                                <p className={`text-xs mt-1 ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{formData.metaDescription.length}/160 chars</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Keywords (EN) <span className="text-gray-400 font-normal">comma-separated</span></label>
                                <input type="text" value={formData.metaKeywords.join(', ')} onChange={e => setFormData(p => ({ ...p, metaKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className={inputCls()} placeholder="Marrakech, balloon, sunrise" />
                            </div>
                        </div>
                        <div className={activeTab === 'fr' ? 'block space-y-4' : 'hidden'}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description Meta (FR)</label>
                                <textarea value={formData.metaDescription_fr} onChange={e => setFormData(p => ({ ...p, metaDescription_fr: e.target.value }))} rows={3} className={inputCls()} placeholder="Description pour les moteurs de recherche…" />
                                <p className={`text-xs mt-1 ${formData.metaDescription_fr.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{formData.metaDescription_fr.length}/160 chars</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mots-clés (FR) <span className="text-gray-400 font-normal">séparés par virgule</span></label>
                                <input type="text" value={formData.metaKeywords_fr.join(', ')} onChange={e => setFormData(p => ({ ...p, metaKeywords_fr: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className={inputCls()} placeholder="Montgolfière Marrakech, lever de soleil" />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ── Images ─────────────────────────────────────────────── */}
                <Section title="Images" badge={imageBadge}>
                    <div className="pt-4 space-y-6">
                        {/* Main Image */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Main Image {isNew && <span className="text-red-500">*</span>}
                            </label>
                            <div className="flex items-start gap-6">
                                <div className="w-40 h-32 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200 shrink-0">
                                    {mainImagePreview ? (
                                        <Image src={mainImagePreview} alt="Preview" fill className="object-cover" unoptimized sizes="160px" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300 text-xs">No image</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <DropZone onFiles={handleMainImageFiles} label="Drop main image here or click to choose" />
                                    {fieldErrors.mainImage && <p className="text-red-500 text-xs mt-2 font-medium">{fieldErrors.mainImage}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Gallery ({existingImages.length + additionalImages.length} images)
                            </label>
                            {(existingImages.length > 0 || additionalImages.length > 0) && (
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                                    {existingImages.map((img, idx) => (
                                        <div key={`e-${idx}`} className="h-24 relative rounded-xl overflow-hidden border border-gray-200 group">
                                            <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" unoptimized sizes="110px" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={() => removeExistingImage(idx)} className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"><X size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    {additionalImagePreviews.map((src, idx) => (
                                        <div key={`n-${idx}`} className="h-24 relative rounded-xl overflow-hidden border-2 border-orange-300 ring-2 ring-orange-100">
                                            <Image src={src} alt={`New ${idx}`} fill className="object-cover" unoptimized sizes="110px" />
                                            <button type="button" onClick={() => removeAdditionalImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow"><X size={12} /></button>
                                            <span className="absolute bottom-1 left-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">NEW</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <DropZone onFiles={handleGalleryFiles} multiple label="Drop gallery images here or click to choose (up to 20)" />
                        </div>
                    </div>
                </Section>

                {/* ── Sticky Save Bar ─────────────────────────────────────── */}
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl px-6 py-4">
                    <div className="max-w-5xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            {lastSaved && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-green-500" />
                                    <span>Draft auto-saved {lastSaved}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/${lang}/admin/flights`} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                                Cancel
                            </Link>
                            <button type="submit" disabled={submitting}
                                className="px-8 py-2.5 rounded-xl bg-[#C04000] text-white font-bold hover:bg-[#a33600] shadow-lg shadow-orange-900/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                                {submitting ? <><Loader2 size={18} className="animate-spin" />Saving…</> : <><Save size={18} />{isNew ? 'Create Flight' : 'Update Flight'}</>}
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}

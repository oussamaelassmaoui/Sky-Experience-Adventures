'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Save, Image as ImageIcon,
    Loader2, Eye, Code, Minimize2, Maximize2,
    Crop, Check, X, Tags, Plus
} from 'lucide-react';
import api, { uploadImage } from '@/services/api';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';
import RichTextEditor from './RichTextEditor';
import { toSlug, Section, DropZone, UploadProgress, UploadStep } from './AdminFormShared';
import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface BlogEditorProps {
    postId?: string;
    lang: string;
}

const GUIDE_CONTENT = {
    en: {
        title: "SEO & Structure Guide",
        sections: [
            {
                title: "1. Structure & Headers",
                items: [
                    "Only one <code>&lt;h1&gt;</code> is allowed (it's the Title).",
                    "Use <code>&lt;h2&gt;</code> for main sections.",
                    "Use <code>&lt;h3&gt;</code> for subsections."
                ]
            },
            {
                title: "2. Keywords & Length",
                items: [
                    "Mention 'Hot Air Balloon Marrakech' naturally in the first paragraph.",
                    "Ideal length: 800-1200 words.",
                    "Use short paragraphs (2-3 sentences max)."
                ]
            }
        ],
        template: `<h2>Introduction</h2>
<p>Start with a hook about the sunrise...</p>

<h2>The Flight Experience</h2>
<p>Describe the views of the Atlas Mountains...</p>

<h2>Practical Information</h2>
<ul>
  <li>Duration: 1 hour</li>
  <li>Pickup: 5:00 AM</li>
</ul>`
    },
    fr: {
        title: "Guide SEO & Structure",
        sections: [
            {
                title: "1. Structure & Titres",
                items: [
                    "Un seul <code>&lt;h1&gt;</code> autorisé (c'est le Titre).",
                    "Utilisez <code>&lt;h2&gt;</code> pour les sections principales.",
                    "Utilisez <code>&lt;h3&gt;</code> pour les sous-sections."
                ]
            },
            {
                title: "2. Mots-clés & Longueur",
                items: [
                    "Mentionnez 'Montgolfière Marrakech' naturellement dès le début.",
                    "Longueur idéale: 800-1200 mots.",
                    "Paragraphes courts (2-3 phrases max)."
                ]
            }
        ],
        template: `<h2>Introduction</h2>
<p>Commencez par l'expérience du lever de soleil...</p>

<h2>L'Expérience de Vol</h2>
<p>Décrivez la vue sur l'Atlas...</p>

<h2>Infos Pratiques</h2>
<ul>
  <li>Durée: 1 heure</li>
  <li>Ramassage: 5h00</li>
</ul>`
    }
} as const;

const defaultFormData = {
    title: { en: '', fr: '' },
    content: { en: '', fr: '' },
    excerpt: { en: '', fr: '' },
    slug: { en: '', fr: '' },
    metaDescription: { en: '', fr: '' },
    metaKeywords: { en: '', fr: '' },
    coverImageAlt: { en: '', fr: '' },
    status: 'draft',
    coverImage: '',
    category: 'News',
    readTime: '5 min read'
};

function BlogEditor({ postId, lang }: BlogEditorProps) {
    const isNew = !postId;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'en' | 'fr'>('en');
    const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'html'>('edit');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [uploadStep, setUploadStep] = useState<UploadStep>('idle');

    // Form State (Localized)
    const [title, setTitle] = useState({ en: '', fr: '' });
    const [slug, setSlug] = useState({ en: '', fr: '' });
    const [slugManuallyEdited, setSlugManuallyEdited] = useState({ en: false, fr: false });

    const [content, setContent] = useState({ en: '', fr: '' });
    const [excerpt, setExcerpt] = useState({ en: '', fr: '' });
    const [metaDescription, setMetaDescription] = useState({ en: '', fr: '' });
    const [metaKeywords, setMetaKeywords] = useState({ en: '', fr: '' });
    const [coverImageAlt, setCoverImageAlt] = useState({ en: '', fr: '' });
    const [status, setStatus] = useState<string>('draft');

    // Shared State
    const [coverImage, setCoverImage] = useState('');
    const [readTime, setReadTime] = useState('5 min read');
    const [category, setCategory] = useState('News');
    const [categories, setCategories] = useState<any[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ en: '', fr: '' });

    // ── LocalStorage Draft Persistence ────────────────────────────────────────
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [hasDraft, setHasDraft] = useState(false);
    const DRAFT_KEY = `blog-draft-${postId || 'new'}`;

    useEffect(() => {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved && isNew) setHasDraft(true);
    }, [postId, isNew]);

    const restoreDraft = () => {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
            try {
                const p = JSON.parse(saved);
                setTitle(p.title); setContent(p.content); setExcerpt(p.excerpt);
                setSlug(p.slug); setMetaDescription(p.metaDescription);
                setMetaKeywords(p.metaKeywords); setCoverImageAlt(p.coverImageAlt);
                setStatus(p.status); setCoverImage(p.coverImage);
                setCategory(p.category); setReadTime(p.readTime);
                setHasDraft(false);
                setSlugManuallyEdited({ en: true, fr: true });
            } catch (e) { console.error("Restore failed", e); }
        }
    };

    const discardDraft = () => {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
    };

    useEffect(() => {
        if (loading) return;
        const currentData = { title, content, excerpt, slug, metaDescription, metaKeywords, coverImageAlt, status, coverImage, category, readTime };
        if (isNew && JSON.stringify(currentData) === JSON.stringify(defaultFormData)) return;

        const timer = setTimeout(() => {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(currentData));
            setLastSaved(new Date().toLocaleTimeString());
        }, 10000);
        return () => clearTimeout(timer);
    }, [title, content, excerpt, slug, metaDescription, metaKeywords, coverImageAlt, status, coverImage, category, readTime, isNew, loading]);

    // ── Auto-Slug Logic ───────────────────────────────────────────────────────
    const handleTitleChange = (val: string, l: 'en' | 'fr') => {
        setTitle(prev => ({ ...prev, [l]: val }));
        if (!slugManuallyEdited[l]) {
            setSlug(prev => ({ ...prev, [l]: toSlug(val) }));
        }
    };

    // Image Cropper State
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropping, setIsCropping] = useState(false);


    useEffect(() => {
        fetchCategories();
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            console.log("Categories fetched:", res.data);
            setCategories(res.data);
            // Default to first category if not set
            if (!category && res.data.length > 0) {
                setCategory(res.data[0].value);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const fetchPost = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/posts/id/${postId}`);
            const post = res.data;

            // Helper to safely get localized string
            const getLoc = (field: any, key: 'en' | 'fr') => {
                if (!field) return '';
                if (typeof field === 'string') return key === 'en' ? field : ''; // Legacy
                return String(field[key] || '');
            };

            setTitle({ en: getLoc(post.title, 'en'), fr: getLoc(post.title, 'fr') });
            setContent({ en: getLoc(post.content, 'en'), fr: getLoc(post.content, 'fr') });
            setExcerpt({ en: getLoc(post.excerpt, 'en'), fr: getLoc(post.excerpt, 'fr') });
            setSlug({ en: getLoc(post.slug, 'en'), fr: getLoc(post.slug, 'fr') });
            setMetaDescription({ en: getLoc(post.metaDescription, 'en'), fr: getLoc(post.metaDescription, 'fr') });
            setCoverImageAlt({ en: getLoc(post.coverImageAlt, 'en'), fr: getLoc(post.coverImageAlt, 'fr') });

            // Handle Arrays -> String (Keywords)
            const getKeywords = (field: any, key: 'en' | 'fr') => {
                if (!field) return '';
                if (Array.isArray(field)) return field.join(', '); // If legacy array
                if (field[key] && Array.isArray(field[key])) return field[key].join(', ');
                return String(field[key] || '');
            };
            setMetaKeywords({
                en: getKeywords(post.metaKeywords, 'en'),
                fr: getKeywords(post.metaKeywords, 'fr')
            });

            // Handle Unified Status
            // Supports legacy object if present, defaulting to 'draft'
            let fetchedStatus = 'draft';
            if (post.status) {
                if (typeof post.status === 'string') {
                    fetchedStatus = post.status;
                } else if (post.status.en) {
                    fetchedStatus = post.status.en;
                }
            }
            setStatus(fetchedStatus);


            setCoverImage(post.coverImage || '');
            setCategory(typeof post.category === 'string' ? post.category : String(post.category?.value || 'News'));
            setReadTime(post.readTime || '5 min read');

        } catch (error) {
            console.error('Failed to fetch post', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.en || !newCategory.fr) return;
        try {
            const res = await api.post('/categories', {
                label: { en: newCategory.en, fr: newCategory.fr },
                value: newCategory.en // Simple value derived from EN
            });
            setCategories([...categories, res.data]);
            setCategory(res.data.value);
            setNewCategory({ en: '', fr: '' });
            setShowCategoryModal(false);
        } catch (error) {
            console.error('Failed to create category', error);
            alert('Failed to create category');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c._id !== id));
            if (categories.length > 0) setCategory(categories[0].value);
        } catch (error) {
            console.error('Failed to delete category', error);
        }
    };

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setCropImageSrc(reader.result?.toString() || '');
                setIsCropping(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const saveCroppedImage = async () => {
        if (!cropImageSrc) return;
        try {
            setLoading(true);
            const croppedImage = await getCroppedImg(cropImageSrc, croppedAreaPixels);
            const file = new File([croppedImage!], "cover-image.jpg", { type: "image/jpeg" });
            const url = await uploadImage(file);
            setCoverImage(url);
            setIsCropping(false);
            setCropImageSrc(null);
        } catch (e) {
            console.error(e);
            alert('Failed to crop/upload image');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploadStep('uploading_images');

        const postData = {
            title,
            content,
            excerpt,
            status,
            coverImage,
            coverImageAlt,
            category,
            readTime,
            slug: {
                en: slug.en || undefined,
                fr: slug.fr || undefined
            },
            metaDescription,
            metaKeywords: {
                en: metaKeywords.en.split(',').map(k => k.trim()).filter(Boolean),
                fr: metaKeywords.fr.split(',').map(k => k.trim()).filter(Boolean)
            }
        };

        try {
            setUploadStep('saving_data');
            if (postId) {
                await api.put(`/posts/${postId}`, postData);
            } else {
                await api.post('/posts', postData);
            }
            setUploadStep('done');
            localStorage.removeItem(DRAFT_KEY);
            router.push(`/${lang}/admin/blogs`);
            router.refresh();
        } catch (error) {
            console.error('Failed to save post', error);
            alert('Failed to save post');
            setUploadStep('idle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-32">
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
                            <p className="text-sm text-gray-600">You have an unsaved version of this post. Would you like to restore it?</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={discardDraft} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Discard</button>
                        <button type="button" onClick={restoreDraft} className="px-4 py-2 bg-[#C04000] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#a33600]">Restore Draft</button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            {isNew ? 'New Blog Post' : 'Edit Blog Post'}
                        </h1>
                        <p className="text-gray-500 font-medium">Create engaging content for your audience</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold shadow-sm transition-all"
                    >
                        {viewMode === 'edit' ? <><Eye size={18} /> Preview</> : <><Code size={18} /> Editor</>}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Language Tabs */}
                    <div className="sticky top-20 z-10 bg-gray-50/95 backdrop-blur pb-2">
                        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-200 w-fit">
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'en' ? 'bg-[#C04000] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                🇬🇧 English
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('fr')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'fr' ? 'bg-[#C04000] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                🇫🇷 Français
                            </button>
                        </div>
                    </div>

                    <Section title="Content & Details" icon={<ImageIcon size={20} className="text-[#C04000]" />} defaultOpen={true}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {activeTab === 'en' ? 'Article Title' : 'Titre de l\'article'}
                                </label>
                                <input
                                    type="text"
                                    value={title[activeTab]}
                                    onChange={(e) => handleTitleChange(e.target.value, activeTab)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#C04000] font-bold text-lg transition-all"
                                    placeholder={activeTab === 'en' ? "Enter an engaging title..." : "Entrez un titre accrocheur..."}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {activeTab === 'en' ? 'Excerpt' : 'Extrait (Résumé)'}
                                </label>
                                <textarea
                                    value={excerpt[activeTab]}
                                    onChange={(e) => setExcerpt({ ...excerpt, [activeTab]: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#C04000] h-24 resize-none transition-all"
                                    placeholder={activeTab === 'en' ? "Short summary..." : "Court résumé..."}
                                    required
                                />
                                <p className="text-xs text-gray-400 text-right mt-1">{excerpt[activeTab].length}/300</p>
                            </div>
                        </div>

                        {/* Rich Text Editor (Localized) */}
                        <div className={`transition-all duration-300 flex flex-col ${isExpanded
                            ? 'fixed inset-0 z-50 bg-white p-6 h-screen w-screen'
                            : 'min-h-[500px]'
                            }`}>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {activeTab === 'en' ? 'Article Content' : 'Contenu de l\'article'}
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="text-gray-500 hover:text-[#C04000] p-1.5 rounded-lg hover:bg-gray-100 transition-colors mr-2"
                                        title={isExpanded ? "Collapse" : "Expand Fullscreen"}
                                    >
                                        {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowGuide(true)}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 text-[#C04000] hover:bg-orange-100 font-bold flex items-center gap-1 transition-colors"
                                    >
                                        <Eye size={14} /> Writing Guide
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 relative" data-color-mode="light">
                                <RichTextEditor
                                    value={content[activeTab]}
                                    onChange={(val: string) => setContent({ ...content, [activeTab]: val })}
                                    placeholder={activeTab === 'en' ? "Start writing your story..." : "Commencez votre récit..."}
                                />
                            </div>
                        </div>
                    </Section>

                    <Section title="SEO & URL Settings" icon={<Eye size={20} className="text-blue-500" />}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">URL Slug ({activeTab.toUpperCase()})</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={slug[activeTab]}
                                        onChange={(e) => {
                                            setSlug({ ...slug, [activeTab]: e.target.value });
                                            setSlugManuallyEdited({ ...slugManuallyEdited, [activeTab]: true });
                                        }}
                                        className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C04000] text-sm font-mono text-gray-600"
                                    />
                                    {!slugManuallyEdited[activeTab] && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">AUTO</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description ({activeTab.toUpperCase()})</label>
                                <textarea
                                    value={metaDescription[activeTab]}
                                    onChange={(e) => setMetaDescription({ ...metaDescription, [activeTab]: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C04000] text-sm h-24 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords ({activeTab.toUpperCase()})</label>
                                <input
                                    type="text"
                                    value={metaKeywords[activeTab]}
                                    onChange={(e) => setMetaKeywords({ ...metaKeywords, [activeTab]: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C04000] text-sm"
                                    placeholder="keyword1, keyword2..."
                                />
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <Section title="Publishing" icon={<Save size={20} className="text-green-500" />} defaultOpen={true}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C04000] text-sm font-medium"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => setCategory(cat.value)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${category === cat.value ? 'bg-[#C04000] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {cat.label?.[activeTab] || cat.value}
                                        </button>
                                    ))}
                                    <button type="button" onClick={() => setShowCategoryModal(true)} className="p-1.5 rounded-lg bg-orange-50 text-[#C04000] hover:bg-orange-100 transition-colors"><Plus size={14} /></button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Read Time</label>
                                <input
                                    type="text"
                                    value={readTime}
                                    onChange={(e) => setReadTime(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C04000] text-sm"
                                />
                            </div>
                        </div>
                    </Section>

                    <Section title="Cover Image" icon={<ImageIcon size={20} className="text-purple-500" />} defaultOpen={true}>
                        <div className="space-y-4">
                            {coverImage ? (
                                <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video">
                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => setCoverImage('')} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"><X size={18} /></button>
                                    </div>
                                </div>
                            ) : (
                                <DropZone onFiles={(files) => {
                                    const reader = new FileReader();
                                    reader.onload = () => { setCropImageSrc(reader.result as string); setIsCropping(true); };
                                    reader.readAsDataURL(files[0]);
                                }} label="Drop cover image here" />
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Image Alt ({activeTab.toUpperCase()})</label>
                                <input
                                    type="text"
                                    value={coverImageAlt[activeTab]}
                                    onChange={(e) => setCoverImageAlt({ ...coverImageAlt, [activeTab]: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                                    placeholder="Describe the image..."
                                />
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Sticky Save Bar */}
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl px-6 py-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            {lastSaved && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-green-500" />
                                    <span>Draft auto-saved {lastSaved}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/${lang}/admin/blogs`} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm">
                                Cancel
                            </Link>
                            <button type="submit" disabled={loading}
                                className="px-10 py-2.5 rounded-xl bg-[#C04000] text-white font-black hover:bg-[#a33600] shadow-lg shadow-orange-900/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm">
                                {loading ? <><Loader2 size={18} className="animate-spin" />Saving…</> : <><Save size={18} />{isNew ? 'Publish Post' : 'Update Post'}</>}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {/* Writing Guide Modal */}
            {
                showGuide && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    💡 {GUIDE_CONTENT[activeTab].title}
                                </h3>
                                <button onClick={() => setShowGuide(false)} className="text-gray-400 hover:text-gray-900">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {GUIDE_CONTENT[activeTab].sections.map((section, idx) => (
                                    <section key={idx}>
                                        <h4 className="font-bold text-[#C04000] text-lg mb-2">{section.title}</h4>
                                        {'items' in section ? (
                                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                                {section.items.map((item, i) => (
                                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                                ))}
                                            </ul>
                                        ) : (
                                            <div dangerouslySetInnerHTML={{ __html: (section as any).content || '' }} />
                                        )}
                                    </section>
                                ))}

                                <section>
                                    <h4 className="font-bold text-[#C04000] text-lg mb-2">3. Style Cheatsheet (Copy/Paste)</h4>
                                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm relative group">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(GUIDE_CONTENT[activeTab].template);
                                                alert('Template copied to clipboard!');
                                            }}
                                            className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                                        >
                                            Copy Code
                                        </button>
                                        <pre className="whitespace-pre-wrap font-mono">
                                            {GUIDE_CONTENT[activeTab].template}
                                        </pre>
                                    </div>
                                </section>
                            </div>

                            <div className="mt-6 pt-4 border-t flex justify-end">
                                <button
                                    onClick={() => setShowGuide(false)}
                                    className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }


            {/* Cropper Modal */}
            {
                isCropping && cropImageSrc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Crop size={20} /> Crop Image
                                </h3>
                                <button type="button" onClick={() => setIsCropping(false)} className="text-gray-500 hover:text-black">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 relative bg-gray-900">
                                <Cropper
                                    image={cropImageSrc || ''}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={16 / 9}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>

                            <div className="p-6 border-t bg-white flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-600">Zoom</span>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-32 accent-[#C04000]"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCropping(false)}
                                        className="px-6 py-2 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={saveCroppedImage}
                                        disabled={loading}
                                        className="px-6 py-2 rounded-lg bg-[#C04000] text-white font-bold hover:bg-[#A03000] flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                                        Save & Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default BlogEditor;

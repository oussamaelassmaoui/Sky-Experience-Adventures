'use client';

import { useState, useEffect, useMemo, use } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, Search, X, User, Loader2 } from "lucide-react";
import api from "@/services/api";
import PageHeader from "@/components/PageHeader";
import enDict from "@/dictionaries/en.json";
import frDict from "@/dictionaries/fr.json";

// Define interface matching API response
interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    category: string;
    publishedAt: string;
    createdAt: string;
    author?: {
        username: string;
        avatar?: string;
    };
    readTime?: string;
}

export default function BlogsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const dict = lang === 'fr' ? frDict : enDict;
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<{ value: string, label: string }[]>([]); // Store localized categories
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch for posts and categories
                const [postsRes, catsRes] = await Promise.all([
                    api.get(`/posts?status=published&language=${lang}`),
                    api.get('/categories')
                ]);

                // Process posts: Map to localized content
                const mappedPosts = postsRes.data.map((post: any) => ({
                    ...post,
                    title: (post.title && typeof post.title === 'object' ? post.title[lang] || post.title.en || '' : post.title || ''),
                    slug: (post.slug && typeof post.slug === 'object' ? post.slug[lang] || post.slug.en || '' : post.slug || ''),
                    excerpt: (post.excerpt && typeof post.excerpt === 'object' ? post.excerpt[lang] || post.excerpt.en || '' : post.excerpt || ''),
                }));
                setPosts(mappedPosts);

                // Process categories: Map to { value, label } based on current lang
                const cats = catsRes.data.map((c: any) => ({
                    value: c.value,
                    label: c.label[lang] || c.label['en']
                }));
                setCategories(cats);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [lang]);

    const hasActiveFilters = searchQuery !== "" || selectedCategory !== "All";

    // Filter categories (All + dynamic ones)
    const filterCategories = useMemo(() => {
        return [{ value: "All", label: lang === 'fr' ? "Tout" : "All" }, ...categories];
    }, [categories, lang]);

    // Helper to get label for a category value
    const getCategoryLabel = (catValue: string) => {
        const cat = categories.find(c => c.value === catValue);
        return cat ? cat.label : catValue;
    };

    // Filter blogs based on search and category
    const filteredBlogs = useMemo(() => {
        return posts.filter(post => {
            const titleFn = String(post.title || '').toLowerCase();
            const excerptFn = String(post.excerpt || '').toLowerCase();

            const matchesSearch = titleFn.includes(searchQuery.toLowerCase()) ||
                excerptFn.includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [posts, searchQuery, selectedCategory]);

    return (
        <main className="min-h-screen bg-gray-50">

            {/* Hero Section */}
            <PageHeader
                title="Latest News & Stories"
                subtitle="INSIGHTS & TIPS"
                backgroundImage="/images/hero.webp"
                waveColor="#ffffff"
            />

            {/* Search & Filter Section */}
            <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-4 py-4 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C04000] focus:border-transparent transition-all"
                                aria-label="Search blog posts"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {filterCategories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${selectedCategory === cat.value
                                        ? 'bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    aria-label={`Filter by ${cat.label}`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <div className="mt-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="bg-[#C04000] text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-[#A03000] transition-colors"
                                    >
                                        Search: "{searchQuery.substring(0, 20)}{searchQuery.length > 20 ? '...' : ''}"
                                        <X size={14} />
                                    </button>
                                )}
                                {selectedCategory !== "All" && (
                                    <button
                                        onClick={() => setSelectedCategory("All")}
                                        className="bg-[#C04000] text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-[#A03000] transition-colors"
                                    >
                                        {getCategoryLabel(selectedCategory)}
                                        <X size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedCategory("All");
                                    }}
                                    className="text-sm text-gray-600 hover:text-[#C04000] underline ml-2"
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        {loading ? (
                            <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Loading...</span>
                        ) : (
                            <>Showing <span className="font-bold text-[#C04000]">{filteredBlogs.length}</span> {filteredBlogs.length === 1 ? 'article' : 'articles'}</>
                        )}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="animate-spin text-[#C04000]" size={40} />
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((post, index) => (
                                <motion.article
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                >
                                    <Link href={`/${lang}/blogs/${post.slug}`}>
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                unoptimized
                                            />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#C04000] uppercase tracking-wider">
                                                {getCategoryLabel(post.category)}
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="flex items-center gap-4 text-gray-500 text-sm mb-4 flex-wrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                {post.author && (
                                                    <div className="flex items-center gap-1.5">
                                                        <User size={14} />
                                                        <span>{post.author.username}</span>
                                                    </div>
                                                )}
                                                {post.readTime && (
                                                    <span className="text-[#C04000] font-medium">{post.readTime}</span>
                                                )}
                                            </div>

                                            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#C04000] transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>

                                            <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center text-[#C04000] font-bold text-sm group-hover:translate-x-2 transition-transform duration-300">
                                                Read Article <span className="ml-2">→</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
                            <p className="text-gray-500 text-lg mb-6">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                }}
                                className="bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
}

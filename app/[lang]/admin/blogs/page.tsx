'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Loader2,
    FileText,
    Calendar,
    User,
    BarChart
} from 'lucide-react';
import api from '@/services/api';

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    publishedAt?: string;
    author: {
        username: string;
        avatar?: string;
    };
    category: string;
    views: number;
}

export default function BlogList({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts'); // Fetch all posts (admin view)
            setPosts(response.data.map((post: any) => {
                // Safeguard against objects being passed to render
                const getLoc = (item: any) => {
                    if (!item) return '';
                    if (typeof item === 'string') return item;
                    return item[lang] || item.en || '';
                };

                return {
                    ...post,
                    title: getLoc(post.title),
                    // Handle Category: It might be a string (ID) or Object (Populated)
                    category: (post.category && typeof post.category === 'object')
                        ? (post.category.label?.[lang] || post.category.value || 'Uncategorized')
                        : (post.category || 'Uncategorized'),
                    slug: getLoc(post.slug),
                    excerpt: getLoc(post.excerpt),
                    // Status is now a global string
                    status: post.status || 'draft',
                };
            }));
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

        setProcessingId(id);
        try {
            await api.delete(`/posts/${id}`);
            setPosts(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredPosts = posts.filter(post => {
        const titleStr = String(post.title || '').toLowerCase();
        const categoryStr = String(post.category || '').toLowerCase();
        const searchStr = searchTerm.toLowerCase();

        return titleStr.includes(searchStr) || categoryStr.includes(searchStr);
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-[#C04000]" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                    <p className="text-gray-500">Manage articles, news, and stories</p>
                </div>
                <Link
                    href={`/${lang}/admin/blogs/new`}
                    className="flex items-center gap-2 bg-[#C04000] hover:bg-[#A03000] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-900/20 transition-all active:scale-95"
                >
                    <Plus size={20} /> New Post
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search posts by title or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C04000]/20 focus:border-[#C04000]"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-200 border-dashed">
                        <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                        <h3 className="text-lg font-bold text-gray-900">No posts found</h3>
                        <p className="text-gray-500 mb-6">Start by creating your first blog post.</p>
                        <Link
                            href={`/${lang}/admin/blogs/new`}
                            className="text-[#C04000] font-bold hover:underline"
                        >
                            Create Article
                        </Link>
                    </div>
                ) : (
                    filteredPosts.map(post => (
                        <div key={post._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                            {/* Image */}
                            <div className="relative h-48 bg-gray-100">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    unoptimized
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md ${post.status === 'published' ? 'bg-green-500/90 text-white' :
                                        post.status === 'draft' ? 'bg-gray-500/90 text-white' :
                                            'bg-red-500/90 text-white'
                                        }`}>
                                        {post.status}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#C04000]">
                                    {post.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">{post.excerpt}</p>

                                <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{post.author?.username || 'Admin'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 font-medium" title={`${post.views || 0} views`}>
                                        <BarChart size={14} />
                                        <span>{post.views || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center group">
                                <Link
                                    href={`/${lang}/blogs/${post.slug}`}
                                    target="_blank"
                                    className="p-2 text-gray-400 hover:text-[#C04000] hover:bg-white rounded-lg transition-colors"
                                    title="View Public Page"
                                >
                                    <Eye size={18} />
                                </Link>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/${lang}/admin/blogs/edit/${post._id}`}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-[#C04000] hover:text-[#C04000] text-sm font-medium transition-colors"
                                    >
                                        <Edit size={14} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        disabled={!!processingId}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-red-100 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

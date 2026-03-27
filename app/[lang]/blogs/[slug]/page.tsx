
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, User, ArrowLeft, Calendar, Share2, Facebook, Twitter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SlugSetter from '@/components/SlugSetter';


// Since this is a server component, we can use fetch directly.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

import { cookies } from 'next/headers';

async function getPost(slug: string, lang: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/posts/${slug}?language=${lang}`, {
            headers,
            cache: 'no-store' // Ensure fresh data for security checks
        });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return null;
    }
}

async function getCategories() {
    try {
        const res = await fetch(`${API_URL}/categories`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        return [];
    }
}

async function getRelatedPosts(category: string, currentSlug: string, lang: string) {
    try {
        const res = await fetch(`${API_URL}/posts?category=${category}&limit=4&language=${lang}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return [];

        const posts = await res.json();
        return posts.filter((p: any) => p.slug !== currentSlug).slice(0, 3);
    } catch (error) {
        return [];
    }
}

interface PageProps {
    params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, lang } = await params;
    const post = await getPost(slug, lang);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Sky Experience Blog`,
        description: post.metaDescription || post.excerpt.substring(0, 155),
        keywords: post.metaKeywords || [],
        openGraph: {
            title: post.title,
            description: post.metaDescription || post.excerpt.substring(0, 155),
            type: 'article',
            publishedTime: post.publishedAt || post.createdAt,
            authors: post.author ? [post.author.username] : ['Sky Experience'],
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.coverImageAlt?.[lang] || post.title,
                },
            ],
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug, lang } = await params;
    const post = await getPost(slug, lang);

    if (!post) {
        notFound();
    }

    // Get categories and related posts in parallel
    const [categories, relatedPosts] = await Promise.all([
        getCategories(),
        getRelatedPosts(post.category, slug, lang)
    ]);

    // Resolve category label
    const categoryObj = categories.find((c: any) => c.value === post.category);
    const categoryLabel = categoryObj ? (categoryObj.label[lang] || categoryObj.label['en']) : post.category;

    // JSON-LD for Blog Posting
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.coverImage,
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt,
        author: {
            '@type': 'Person',
            name: post.author?.username || 'Sky Experience Team',
        },
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Set localized slugs for Language Selector */}
            <SlugSetter slugs={post.slugs || {}} />

            <Navbar lang={lang} />

            {/* Hero Section with Featured Image */}
            <section className="relative h-[50vh] min-h-[400px] w-full">
                <Image
                    src={post.coverImage}
                    alt={post.coverImageAlt?.[lang] || post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-24 left-4 md:left-8">
                    <span className="bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                        {categoryLabel}
                    </span>
                </div>
            </section>

            {/* Article Content */}
            <article className="container mx-auto px-4 max-w-4xl -mt-32 relative z-10 pb-20">
                {/* Breadcrumbs */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-white/90" aria-label="Breadcrumb">
                    <Link href={`/${lang}/`} className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight size={16} className="text-white/60" />
                    <Link href={`/${lang}/blogs`} className="hover:text-white transition-colors">
                        Blog
                    </Link>
                    <ChevronRight size={16} className="text-white/60" />
                    <span className="text-white font-medium truncate max-w-[200px]">{post.title}</span>
                </nav>

                {/* Article Header */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 text-sm md:text-base pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-[#C04000]" />
                            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <User size={18} className="text-[#C04000]" />
                                <span>{post.author.username}</span>
                            </div>
                        )}
                        {post.readTime && (
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-[#C04000]" />
                                <span>{post.readTime}</span>
                            </div>
                        )}
                    </div>

                    {/* Share Buttons */}
                    <div className="flex items-center gap-3 mt-6">
                        <span className="text-sm font-medium text-gray-700">Share:</span>
                        <button
                            className="p-2 rounded-full bg-gray-100 hover:bg-[#C04000] hover:text-white transition-colors"
                            aria-label="Share on Facebook"
                        >
                            <Facebook size={18} />
                        </button>
                        <button
                            className="p-2 rounded-full bg-gray-100 hover:bg-[#C04000] hover:text-white transition-colors"
                            aria-label="Share on Twitter"
                        >
                            <Twitter size={18} />
                        </button>
                        <button
                            className="p-2 rounded-full bg-gray-100 hover:bg-[#C04000] hover:text-white transition-colors"
                            aria-label="Share link"
                        >
                            <Share2 size={18} />
                        </button>
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-base md:prose-lg prose-orange max-w-none w-full break-words overflow-hidden mt-8
                        prose-headings:font-playfair prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                        prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-8 prose-h1:leading-tight
                        prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-[#C04000] prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-4
                        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800
                        prose-p:text-gray-700 prose-p:leading-7 md:prose-p:leading-8 prose-p:mb-6
                        prose-a:text-[#C04000] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:border-l-4 prose-blockquote:border-[#C04000] prose-blockquote:bg-orange-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:not-italic:before:content-none prose-blockquote:not-italic:after:content-none
                        prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6 prose-li:mb-2 prose-li:marker:text-[#C04000]
                        prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10 prose-img:w-full
                        prose-strong:text-gray-900 prose-strong:font-bold
                    ">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Back to Blog Link */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <Link
                            href={`/${lang}/blogs`}
                            className="inline-flex items-center gap-2 text-[#C04000] hover:text-[#D84A1B] font-bold transition-colors group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Back to All Articles
                        </Link>
                    </div>
                </div>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost: any) => (
                                <Link
                                    key={relatedPost._id}
                                    href={`/${lang}/blogs/${relatedPost.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                                >
                                    <div className="relative h-48">
                                        <Image
                                            src={relatedPost.coverImage}
                                            alt={relatedPost.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="text-xs font-bold text-[#C04000] uppercase tracking-wider">
                                            {relatedPost.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2 line-clamp-2 group-hover:text-[#C04000] transition-colors">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {relatedPost.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>

        </main>
    );
}

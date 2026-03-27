// ============================================
// BLOG SYSTEM - BACKEND READY STRUCTURE
// ============================================
// This file contains the complete blog data structure ready for backend integration
// Replace static data with API calls when backend is ready

// ============================================
// INTERFACES & TYPES
// ============================================

export interface Author {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    role?: string;
    social?: {
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
}

export interface BlogPost {
    // Core Identifiers
    id: string;
    slug: string;

    // Content
    title: string;
    excerpt: string;
    content: string; // Full blog content (markdown or HTML)

    // Media
    image: string;
    ogImage?: string; // Open Graph image for social sharing

    // Categorization
    category: string;
    tags?: string[];

    // Author Information
    authorId: string;
    author?: Author; // Populated from AUTHORS array

    // Metadata
    readTime?: string;
    published: boolean;
    featured?: boolean;

    // Timestamps (ISO 8601 format)
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;

    // SEO
    metaDescription?: string;
    metaKeywords?: string[];

    // Engagement Metrics
    views?: number;
    likes?: number;
    commentsCount?: number;
}

// ============================================
// AUTHORS DATA
// ============================================

export const AUTHORS: Author[] = [
    {
        id: 'author_001',
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah.jpg',
        bio: 'Travel writer and hot air balloon enthusiast with over 10 years of experience.',
        role: 'Travel Writer',
        social: {
            twitter: '@sarahjohnson',
            instagram: '@sarahtravels'
        }
    },
    {
        id: 'author_002',
        name: 'Ahmed El Fassi',
        avatar: '/images/authors/ahmed.jpg',
        bio: 'Licensed balloon pilot and adventure guide based in Marrakech.',
        role: 'Balloon Pilot',
        social: {
            instagram: '@ahmedelfassi'
        }
    },
    {
        id: 'author_003',
        name: 'Emma Laurent',
        avatar: '/images/authors/emma.jpg',
        bio: 'Romance and luxury travel specialist.',
        role: 'Luxury Travel Expert'
    },
    {
        id: 'author_004',
        name: 'David Martinez',
        avatar: '/images/authors/david.jpg',
        bio: 'Professional photographer specializing in aerial and adventure photography.',
        role: 'Photographer'
    },
    {
        id: 'author_005',
        name: 'Fatima Zahra',
        avatar: '/images/authors/fatima.jpg',
        bio: 'Moroccan culture and history expert.',
        role: 'Cultural Historian'
    }
];

// ============================================
// BLOG POSTS DATA
// ============================================

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 'blog_001',
        slug: 'magic-sunrise-flight',
        title: 'The Magic of a Sunrise Flight Over Marrakech',
        excerpt: 'Discover why the early morning light over the Atlas Mountains creates the most spectacular views for hot air ballooning.',
        content: `# The Magic of a Sunrise Flight Over Marrakech

There's something truly magical about watching the sun rise over the Atlas Mountains from a hot air balloon. As the first rays of light paint the sky in shades of pink and gold, you'll understand why this is considered one of the most spectacular experiences in Morocco.

## Why Sunrise?

The early morning hours offer the perfect conditions for ballooning:
- Calm winds and stable air
- Crystal clear visibility
- Stunning golden hour lighting
- Cooler temperatures for optimal flight

## What to Expect

Your adventure begins before dawn, with hotel pickup around 5:00 AM. After a light breakfast and safety briefing, you'll watch as the massive balloon is inflated against the pre-dawn sky.

As you gently lift off, the world below transforms into a patchwork of colors and textures, with the Atlas Mountains providing a dramatic backdrop.

## The Perfect Photo Opportunity

The golden hour light creates ideal conditions for photography. Don't forget to bring your camera to capture:
- Panoramic views of the Atlas Mountains
- Traditional Berber villages
- The changing colors of the desert landscape
- Your fellow passengers silhouetted against the sunrise

Book your sunrise flight today and experience the magic for yourself!`,
        image: '/images/classic1.webp',
        ogImage: '/images/og/sunrise-flight.jpg',
        category: 'Experience',
        tags: ['sunrise', 'photography', 'atlas mountains', 'marrakech'],
        authorId: 'author_001',
        readTime: '5 min read',
        published: true,
        featured: true,
        createdAt: '2025-10-10T08:00:00Z',
        updatedAt: '2025-10-15T10:30:00Z',
        publishedAt: '2025-10-15T09:00:00Z',
        metaDescription: 'Experience the magic of a sunrise hot air balloon flight over Marrakech and the Atlas Mountains. Book your early morning adventure today!',
        metaKeywords: ['sunrise balloon flight', 'marrakech hot air balloon', 'atlas mountains', 'morocco adventure'],
        views: 1247,
        likes: 89,
        commentsCount: 12
    },
    {
        id: 'blog_002',
        slug: 'prepare-first-flight',
        title: 'How to Prepare for Your First Hot Air Balloon Ride',
        excerpt: 'Everything you need to know before your flight: what to wear, what to bring, and what to expect during the journey.',
        content: `# How to Prepare for Your First Hot Air Balloon Ride

Planning your first hot air balloon adventure? Here's everything you need to know to ensure a comfortable and memorable experience.

## What to Wear

Dress in comfortable, layered clothing:
- Long pants (avoid shorts)
- Closed-toe shoes (sneakers or hiking boots)
- Light jacket for early morning chill
- Hat and sunglasses
- Sunscreen

## What to Bring

- Camera or smartphone
- Small backpack
- Water bottle
- Light snacks
- Valid ID

## What NOT to Bring

- High heels or sandals
- Excessive jewelry
- Large bags
- Drones (restricted in flight zones)

## Safety First

All our flights follow strict safety protocols:
- Pre-flight safety briefing
- Licensed and experienced pilots
- Regular equipment maintenance
- Weather monitoring

Ready for your adventure? Book now and let us take care of the rest!`,
        image: '/images/balloon-basket.webp',
        category: 'Tips',
        tags: ['first flight', 'preparation', 'safety', 'tips'],
        authorId: 'author_002',
        readTime: '7 min read',
        published: true,
        featured: false,
        createdAt: '2025-09-20T10:00:00Z',
        updatedAt: '2025-09-28T14:20:00Z',
        publishedAt: '2025-09-28T12:00:00Z',
        metaDescription: 'Complete guide to preparing for your first hot air balloon ride. Learn what to wear, bring, and expect.',
        metaKeywords: ['hot air balloon preparation', 'first balloon ride', 'balloon flight tips'],
        views: 892,
        likes: 67,
        commentsCount: 8
    },
    {
        id: 'blog_003',
        slug: 'romantic-getaway',
        title: 'A Romantic Getaway in the Clouds',
        excerpt: 'Planning a proposal or anniversary? Learn why a private hot air balloon flight is the ultimate romantic gesture.',
        content: `# A Romantic Getaway in the Clouds

Looking for the perfect way to celebrate your love? A private hot air balloon flight over Marrakech offers an unforgettable romantic experience.

## Why Choose a Balloon Flight?

- Intimate and private setting
- Breathtaking views
- Champagne breakfast included
- Professional photography available
- Unforgettable memories

## Perfect for Special Occasions

Our private flights are ideal for:
- Marriage proposals
- Anniversaries
- Honeymoons
- Valentine's Day
- Birthday celebrations

## The Experience

Your private flight includes:
- Exclusive basket for two
- Champagne toast at sunrise
- Gourmet breakfast
- Flight certificate
- Professional photos

Make your special moment truly magical. Book your romantic flight today!`,
        image: '/images/mariage-main.webp',
        category: 'Romance',
        tags: ['romance', 'proposal', 'anniversary', 'private flight'],
        authorId: 'author_003',
        readTime: '6 min read',
        published: true,
        featured: true,
        createdAt: '2025-09-01T09:00:00Z',
        updatedAt: '2025-09-10T11:15:00Z',
        publishedAt: '2025-09-10T10:00:00Z',
        metaDescription: 'Plan the perfect romantic hot air balloon flight for proposals, anniversaries, or special celebrations in Marrakech.',
        metaKeywords: ['romantic balloon flight', 'marriage proposal balloon', 'anniversary celebration'],
        views: 1543,
        likes: 124,
        commentsCount: 23
    }
    // Add remaining blog posts with full content...
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get blog post by slug
export function getBlogBySlug(slug: string): BlogPost | undefined {
    const blog = BLOG_POSTS.find(post => post.slug === slug);
    if (blog && blog.authorId) {
        // Populate author data
        blog.author = AUTHORS.find(author => author.id === blog.authorId);
    }
    return blog;
}

// Get all published blogs
export function getPublishedBlogs(): BlogPost[] {
    return BLOG_POSTS.filter(post => post.published)
        .map(post => ({
            ...post,
            author: AUTHORS.find(author => author.id === post.authorId)
        }));
}

// Get featured blogs
export function getFeaturedBlogs(limit?: number): BlogPost[] {
    const featured = BLOG_POSTS.filter(post => post.published && post.featured)
        .map(post => ({
            ...post,
            author: AUTHORS.find(author => author.id === post.authorId)
        }));
    return limit ? featured.slice(0, limit) : featured;
}

// Get blogs by category
export function getBlogsByCategory(category: string): BlogPost[] {
    return BLOG_POSTS.filter(post => post.published && post.category === category)
        .map(post => ({
            ...post,
            author: AUTHORS.find(author => author.id === post.authorId)
        }));
}

// Get blogs by tag
export function getBlogsByTag(tag: string): BlogPost[] {
    return BLOG_POSTS.filter(post => post.published && post.tags?.includes(tag))
        .map(post => ({
            ...post,
            author: AUTHORS.find(author => author.id === post.authorId)
        }));
}

// Get related blogs (same category, excluding current)
export function getRelatedBlogs(currentSlug: string, limit: number = 3): BlogPost[] {
    const currentBlog = getBlogBySlug(currentSlug);
    if (!currentBlog) return [];

    return BLOG_POSTS
        .filter(post =>
            post.published &&
            post.slug !== currentSlug &&
            post.category === currentBlog.category
        )
        .slice(0, limit)
        .map(post => ({
            ...post,
            author: AUTHORS.find(author => author.id === post.authorId)
        }));
}

// ============================================
// TODO: BACKEND INTEGRATION
// ============================================

/*
// Example API integration functions:

export async function fetchBlogs(): Promise<BlogPost[]> {
    const response = await fetch('/api/blogs');
    return response.json();
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(`/api/blogs/${slug}`);
    return response.json();
}

export async function createBlog(blog: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog)
    });
    return response.json();
}

export async function updateBlog(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const response = await fetch(`/api/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    return response.json();
}

export async function deleteBlog(id: string): Promise<void> {
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
}
*/

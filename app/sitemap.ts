import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyexperience-marrakech.com';

async function getFlights() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/flights`, {
            next: { revalidate: 3600 } // Cache 1h
        });
        const data = await res.json();
        return data.flights || [];
    } catch (error) {
        console.error('Sitemap: Failed to fetch flights', error);
        return [];
    }
}

async function getPosts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/posts?status=published`, {
            next: { revalidate: 3600 }
        });
        const result = await res.json();
        // Handle both array response and wrapped {posts:[]} response
        return Array.isArray(result) ? result : (result.posts || []);
    } catch (error) {
        console.error('Sitemap: Failed to fetch posts', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const flights = await getFlights();
    const posts = await getPosts();

    // Static routes with priority and frequency
    const staticRoutes = [
        { path: '', priority: 1.0, freq: 'daily' as const },
        { path: '/flights', priority: 0.9, freq: 'daily' as const },
        { path: '/booking', priority: 0.9, freq: 'daily' as const },
        { path: '/blogs', priority: 0.8, freq: 'daily' as const },
        { path: '/contact', priority: 0.7, freq: 'monthly' as const },
        { path: '/about', priority: 0.6, freq: 'monthly' as const },
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // 1. Static pages for each language
    (['en', 'fr'] as const).forEach(lang => {
        staticRoutes.forEach(({ path, priority, freq }) => {
            sitemapEntries.push({
                url: `${BASE_URL}/${lang}${path}`,
                lastModified: new Date(),
                changeFrequency: freq,
                priority,
            });
        });
    });

    // 2. Flight pages — use slug_fr for French URLs (mirrors our routing fix)
    flights.forEach((flight: any) => {
        const slugEn = flight.slug;
        const slugFr = flight.slug_fr || flight.slug; // fallback to EN if no FR slug

        sitemapEntries.push({
            url: `${BASE_URL}/en/flights/${slugEn}`,
            lastModified: new Date(flight.updatedAt || new Date()),
            changeFrequency: 'weekly',
            priority: 0.9,
        });
        sitemapEntries.push({
            url: `${BASE_URL}/fr/flights/${slugFr}`,
            lastModified: new Date(flight.updatedAt || new Date()),
            changeFrequency: 'weekly',
            priority: 0.9,
        });
    });

    // 3. Blog post pages — use localized slugs {en, fr} from BlogPost model
    posts.forEach((post: any) => {
        // BlogPost model stores slug as {en: string, fr: string}
        const slugEn = typeof post.slug === 'object' ? post.slug?.en : post.slug;
        const slugFr = typeof post.slug === 'object' ? post.slug?.fr : post.slug;

        if (slugEn) {
            sitemapEntries.push({
                url: `${BASE_URL}/en/blogs/${slugEn}`,
                lastModified: new Date(post.updatedAt || new Date()),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
        if (slugFr) {
            sitemapEntries.push({
                url: `${BASE_URL}/fr/blogs/${slugFr}`,
                lastModified: new Date(post.updatedAt || new Date()),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    });

    return sitemapEntries;
}

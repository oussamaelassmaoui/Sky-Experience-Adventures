import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FlightDetailClient from '@/components/FlightDetailClient';
import { getDictionary } from '@/app/get-dictionary';
import { Flight } from '@/app/data/flights';
import SlugSetter from '@/components/SlugSetter';

import { cookies } from 'next/headers';

interface PageProps {
    params: Promise<{ id: string; lang: string }>;
}

interface FlightApiResponse {
    flight: Flight;
    suggestedFlights: Flight[];
    slugs: { en: string; fr: string };
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyexperience-marrakech.com';

async function getFlightData(slugOrId: string): Promise<FlightApiResponse | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value;

        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/flights/${slugOrId}`, {
            headers,
            cache: 'no-store',
            next: { tags: [`flight-${slugOrId}`] }
        });

        if (!res.ok) {
            return null;
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching flight:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id, lang } = await params;
    const data = await getFlightData(id);

    if (!data || !data.flight) {
        return { title: 'Flight Not Found' };
    }

    const { flight, slugs } = data;

    const title = lang === 'fr'
        ? `${flight.title_fr || flight.title} | Sky Experience Marrakech`
        : `${flight.title} | Sky Experience Marrakech`;

    const description = lang === 'fr'
        ? (flight.metaDescription_fr || flight.overview_fr || flight.overview || '').substring(0, 160)
        : (flight.metaDescription || flight.overview || '').substring(0, 160);

    const keywords = lang === 'fr'
        ? flight.metaKeywords_fr || []
        : flight.metaKeywords || [];

    const slugEn = slugs?.en || flight.slug;
    const slugFr = slugs?.fr || flight.slug_fr || flight.slug;
    const canonicalSlug = lang === 'fr' ? slugFr : slugEn;

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: `/${lang}/flights/${canonicalSlug}`,
            languages: {
                'en': `/en/flights/${slugEn}`,
                'fr': `/fr/flights/${slugFr}`,
            }
        },
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/${lang}/flights/${canonicalSlug}`,
            siteName: 'Sky Experience Marrakech',
            locale: lang === 'fr' ? 'fr_FR' : 'en_US',
            type: 'website',
            images: [
                {
                    url: flight.mainImage || '/images/hero.webp',
                    width: 1200,
                    height: 630,
                    alt: lang === 'fr' ? (flight.title_fr || flight.title) : flight.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: flight.mainImage ? [flight.mainImage] : ['/images/hero.webp'],
        },
    };
}

export default async function FlightPage({ params }: PageProps) {
    const { id, lang } = await params;
    const data = await getFlightData(id);

    if (!data || !data.flight) {
        notFound();
    }

    const { flight, suggestedFlights, slugs } = data;

    const dict = await getDictionary(lang);

    // Build JSON-LD TouristAttraction schema for Google Rich Results
    const flightTitle = lang === 'fr' ? (flight.title_fr || flight.title) : flight.title;
    const flightDesc = lang === 'fr'
        ? (flight.overview_fr || flight.overview || flight.description_fr || flight.description || '')
        : (flight.overview || flight.description || '');
    const slugEn = slugs?.en || flight.slug;
    const slugFr = slugs?.fr || flight.slug_fr || flight.slug;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: flightTitle,
        description: flightDesc.substring(0, 300),
        url: `${BASE_URL}/${lang}/flights/${lang === 'fr' ? slugFr : slugEn}`,
        image: flight.mainImage,
        touristType: ['Adventure', 'Luxury', 'Sightseeing'],
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 31.6295,
            longitude: -7.9811,
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Marrakech',
            addressLocality: 'Marrakech',
            addressCountry: 'MA',
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: flight.price,
            availability: 'https://schema.org/InStock',
            validFrom: new Date().toISOString().split('T')[0],
            url: `${BASE_URL}/${lang}/flights/${lang === 'fr' ? slugFr : slugEn}`,
        },
        provider: {
            '@type': 'TravelAgency',
            name: 'Sky Experience Marrakech',
            url: BASE_URL,
        },
        inLanguage: [
            {
                '@type': 'Language',
                name: 'English',
                alternateName: 'en',
            },
            {
                '@type': 'Language',
                name: 'French',
                alternateName: 'fr',
            },
        ],
    };

    // Normalize data: map _id to id for frontend compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizedFlight: Flight = { ...flight, id: (flight as any)._id } as Flight;

    const normalizedSuggestions: Flight[] = suggestedFlights.map(f => ({
        ...f,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (f as any)._id,
        image: f.mainImage || f.image || '/images/default-flight.jpg'
    })) as Flight[];

    return (
        <>
            {/* JSON-LD Structured Data — TouristAttraction for Google Rich Results */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Set localized slugs for Language Selector — same pattern as blog */}
            <SlugSetter slugs={slugs || { en: flight.slug, fr: flight.slug_fr || flight.slug }} />
            <FlightDetailClient flight={normalizedFlight} suggestions={normalizedSuggestions} lang={lang} dict={dict} />
        </>
    );
}

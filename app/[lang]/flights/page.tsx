import { Metadata } from 'next';
import FlightsClient from './FlightsClient';
import { getDictionary } from '@/app/get-dictionary';

interface FlightsPageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: FlightsPageProps): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const title = lang === 'fr'
        ? `${dict.flights_page.title} Montgolfière Marrakech | Sky Experience`
        : `${dict.flights_page.title} Hot Air Balloon Marrakech | Sky Experience`;

    const description = lang === 'fr'
        ? "Découvrez nos offres de vols en montgolfière à Marrakech. Vols privés, VIP ou classiques au lever du soleil sur l'Atlas et le désert."
        : "Discover our hot air balloon flight offers in Marrakech. Private, VIP, or classic sunrise flights over the Atlas Mountains and desert.";

    return {
        title,
        description,
        alternates: {
            languages: {
                'en': '/en/flights',
                'fr': '/fr/flights',
            },
        },
    };
}

export default async function FlightsPage({ params }: FlightsPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <FlightsClient lang={lang} dict={dict} />;
}

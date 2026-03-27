import { MetadataRoute } from 'next';

export default async function manifest({ params }: { params: Promise<{ lang: string }> }): Promise<MetadataRoute.Manifest> {
    const { lang } = await params;

    return {
        name: 'Sky Experience Marrakech',
        short_name: 'Sky Experience',
        description: lang === 'fr'
            ? 'Vols inoubliables en montgolfière à Marrakech.'
            : 'Unforgettable hot air balloon flights in Marrakech.',
        start_url: `/${lang}`,
        display: 'standalone',
        background_color: '#FDFBF7',
        theme_color: '#C04000',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}

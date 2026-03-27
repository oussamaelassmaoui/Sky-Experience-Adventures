import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getDictionary } from "../get-dictionary";
import { LanguageSlugProvider } from "@/context/LanguageSlugContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  preload: true,
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Hot Air Balloon Marrakech | Sky Experience Morocco",
    template: "%s | Sky Experience Marrakech",
  },
  description: "Hot air balloon Marrakech at sunrise. Private & group flights over Atlas Mountains. Luxury service with Sky Experience Morocco. Book your unforgettable adventure today.",
  keywords: [
    'hot air balloon Marrakech',
    'montgolfière Marrakech',
    'balloon flight Marrakech',
    'hot air balloon Morocco',
    'Marrakech balloon ride',
    'Atlas Mountains balloon',
    'sunrise balloon Marrakech',
    'private balloon flight',
    'luxury balloon experience',
    'Sky Experience Marrakech',
    'Morocco hot air balloon tours',
    'Marrakech sunrise flight',
    'desert balloon ride Morocco',
  ],
  metadataBase: new URL('https://skyexperience-marrakech.com'),
  authors: [{ name: 'Sky Experience Marrakech', url: 'https://skyexperience-marrakech.com' }],
  creator: 'Sky Experience Marrakech',
  publisher: 'Sky Experience Marrakech',
  category: 'Travel & Tourism',
  classification: 'Hot Air Balloon Tours',
  robots: {
    index: true,
    follow: true,
    googleBot: { 
      index: true, 
      follow: true, 
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'fr': '/fr',
    },
  },
  openGraph: {
    title: 'Sky Experience Marrakech | Hot Air Balloon Flights',
    description: 'Premium hot air balloon flights in Marrakech. Book your sunrise adventure over the Atlas Mountains. Private & group flights available.',
    url: 'https://skyexperience-marrakech.com',
    siteName: 'Sky Experience Marrakech',
    images: [
      {
        url: '/images/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Hot Air Balloon over Marrakech at sunrise',
        type: 'image/webp',
      },
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'Morocco',
    emails: ['contact@skyexperience-marrakech.com'],
    phoneNumbers: ['+212 6 62 18 49 49'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sky Experience Marrakech | Hot Air Balloon Flights',
    description: 'Premium hot air balloon flights in Marrakech. Book your sunrise adventure today.',
    images: ['/images/hero.webp'],
    creator: '@skyexperience',
    site: '@skyexperience',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'geo.region': 'MA',
    'geo.placename': 'Marrakech',
    'geo.position': '31.6295;-7.9811',
    'ICBM': '31.6295, -7.9811',
  },
};



export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning={true} data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} ${dancingScript.variable} antialiased font-sans flex flex-col min-h-screen`} suppressHydrationWarning={true}>
        <LanguageSlugProvider>
          <CurrencyProvider>
            <Navbar lang={lang} dict={dict.navigation} />
            <div className="flex-grow">
              {children}
            </div>
            <Footer lang={lang} dict={dict} />
            <WhatsAppButton />
          </CurrencyProvider>
        </LanguageSlugProvider>
      </body>
    </html>
  );
}

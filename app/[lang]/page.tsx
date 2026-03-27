import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Metadata } from 'next';

import PanoramicSection from "@/components/PanoramicSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import FAQSection from "@/components/FAQSection";
import FlightCard from "@/components/FlightCard";
import AboutSection from "@/components/AboutSection";
import SearchBar from "@/components/SearchBar";
import WhyChooseSection from "@/components/WhyChooseSection";
import ContactSection from "@/components/ContactSection";
import SEOContent from "@/components/SEOContent";
import StructuredData from "@/components/StructuredData";

import { Flight } from '../data/flights';
import { getDictionary } from '../get-dictionary';
import { getActiveFlights } from '@/services/flightService';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;

  if (lang === 'fr') {
    return {
      title: "Montgolfière Marrakech | Expérience Luxe Sky Experience",
      description: "Découvrez la magie d'un vol en montgolfière Marrakech avec Sky Experience. Vol privé au lever du soleil, service haut de gamme et panoramas inoubliables sur l'Atlas. Réservez maintenant.",
      keywords: [
        'montgolfière Marrakech',
        'vol montgolfière Maroc',
        'balloon Marrakech',
        'vol montgolfière Atlas',
        'expérience luxe Marrakech',
        'lever du soleil Marrakech',
        'Sky Experience Marrakech',
        'réserver montgolfière Maroc',
        'activité Marrakech',
        'tourisme Marrakech',
      ],
      alternates: {
        canonical: 'https://skyexperience-marrakech.com/fr',
        languages: { 'en': '/en', 'fr': '/fr' },
      },
      openGraph: {
        title: 'Montgolfière Marrakech | Sky Experience',
        description: "Vol en montgolfière au lever du soleil sur Marrakech et l'Atlas. Service premium et expérience inoubliable.",
        url: 'https://skyexperience-marrakech.com/fr',
        siteName: 'Sky Experience Marrakech',
        locale: 'fr_FR',
        type: 'website',
        images: [{ 
          url: '/images/hero.webp', 
          width: 1200, 
          height: 630, 
          alt: 'Montgolfière Marrakech',
          type: 'image/webp',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Montgolfière Marrakech | Sky Experience',
        description: "Vol en montgolfière au lever du soleil sur Marrakech.",
        images: ['/images/hero.webp'],
      },
    };
  }

  return {
    title: "Hot Air Balloon Marrakech | Sky Experience Morocco",
    description: "Experience a premium hot air balloon Marrakech flight with Sky Experience. Private sunrise flights, luxury service & unforgettable views over the Atlas Mountains. Book now!",
    keywords: [
      'hot air balloon Marrakech',
      'balloon flight Marrakech',
      'hot air balloon Morocco',
      'Marrakech balloon ride',
      'Atlas Mountains balloon',
      'sunrise balloon Marrakech',
      'private balloon flight Morocco',
      'luxury balloon experience',
      'Sky Experience Marrakech',
      'Morocco balloon tours',
      'book balloon Marrakech',
      'Marrakech activities',
      'Morocco tourism',
    ],
    alternates: {
      canonical: 'https://skyexperience-marrakech.com/en',
      languages: { 'en': '/en', 'fr': '/fr' },
    },
    openGraph: {
      title: 'Hot Air Balloon Marrakech | Sky Experience Morocco',
      description: 'Premium hot air balloon flights in Marrakech. Book your sunrise adventure over the Atlas Mountains. Unforgettable luxury experience.',
      url: 'https://skyexperience-marrakech.com/en',
      siteName: 'Sky Experience Marrakech',
      locale: 'en_US',
      type: 'website',
      images: [{ 
        url: '/images/hero.webp', 
        width: 1200, 
        height: 630, 
        alt: 'Hot Air Balloon Marrakech',
        type: 'image/webp',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hot Air Balloon Marrakech | Sky Experience Morocco',
      description: 'Premium hot air balloon rides in Marrakech at sunrise.',
      images: ['/images/hero.webp'],
    },
  };
}


// Helper to fetch featured flights
async function getFeaturedFlightsData(lang: string): Promise<Flight[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/flights?featured=true&limit=4&lang=${lang}`, {
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const data = await res.json();
    const flights = data.flights || [];

    // Filter strictly for featured flights (safeguard against backend issues)
    const featuredFlights = flights.filter((f: any) => f.featured === true);

    // Map and Localize (and safeguard limit)
    return featuredFlights.slice(0, 4).map((f: any) => ({
      ...f,
      id: f._id || f.id,
      image: f.mainImage || f.image || '/images/default-flight.jpg',
      title: lang === 'fr' ? f.title_fr || f.title : f.title,
      description: lang === 'fr' ? f.description_fr || f.description : f.description,
    }));
  } catch (error) {
    console.error('Failed to fetch featured flights:', error);
    return [];
  }
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  // Fetch data in parallel for better performance
  const [featuredFlights, allActiveFlights] = await Promise.all([
    getFeaturedFlightsData(lang),
    getActiveFlights() // Always fetch fresh data for SearchBar destinations
  ]);

  return (
    <main className="min-h-screen font-sans bg-gray-50">
      <StructuredData lang={lang} />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen sm:min-h-[900px] md:min-h-[800px] lg:min-h-[850px] w-full overflow-visible">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero.webp"
            alt="Hot Air Balloon at Sunrise"
            fill
            className="object-cover object-bottom"
            priority
            sizes="100vw"
          />
          {/* Lighter gradient overlay to show more sunrise */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
        </div>

        {/* Content Container - Optimized for all devices */}
        <div className="relative z-10 h-full min-h-screen sm:min-h-[900px] md:min-h-[800px] flex flex-col">
          {/* Spacer for Navbar - prevents content overlap - INCREASED */}
          <div className="h-20 xs:h-24 sm:h-28 md:h-32 lg:h-36 flex-shrink-0" />

          {/* Main Content - Centered with better mobile spacing */}
          <div className="flex-1 flex flex-col justify-center px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 pb-8 xs:pb-10 sm:pb-12 md:pb-16 lg:pb-20">
            <div className="container mx-auto max-w-7xl">
              <div
                className="text-center max-w-5xl mx-auto flex flex-col items-center"
              >
                {/* Subtitle - Clean, no animation delay */}
                <h3 className="text-white font-semibold text-xs xs:text-sm sm:text-base md:text-lg uppercase tracking-[0.2em] mb-3 xs:mb-4 sm:mb-5 drop-shadow-lg">
                  {dict.hero.subtitle}
                </h3>

                {/* Main Heading - Large, Bold, Clean - Responsive sizing */}
                <h1 className="font-playfair text-[1.75rem] leading-[1.1] xs:text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 xs:mb-7 sm:mb-8 md:mb-10 drop-shadow-2xl px-2 xs:px-4 max-w-4xl">
                  {dict.hero.title}
                </h1>

                {/* Trust Badges - Social Proof - Always visible */}
                <div
                  className="flex flex-wrap items-center justify-center gap-3 xs:gap-4 sm:gap-6 mb-5 xs:mb-6 sm:mb-7 text-white/95 text-xs xs:text-sm px-4"
                >
                  <div className="flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-md px-3 xs:px-4 py-1.5 xs:py-2 rounded-full border border-white/20">
                    <span className="text-yellow-300 text-base xs:text-lg">⭐</span>
                    <span className="font-bold">4.9/5</span>
                    <span className="text-white/80 hidden xs:inline">{dict.hero.reviews_count}</span>
                  </div>
                  <div className="flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-md px-3 xs:px-4 py-1.5 xs:py-2 rounded-full border border-white/20">
                    <span className="text-green-300 text-base xs:text-lg">✓</span>
                    <span className="font-semibold">{dict.hero.certified_pilots}</span>
                  </div>
                  <div className="flex items-center gap-1.5 xs:gap-2 bg-white/10 backdrop-blur-md px-3 xs:px-4 py-1.5 xs:py-2 rounded-full border border-white/20">
                    <span className="text-blue-300 text-base xs:text-lg">✓</span>
                    <span className="font-semibold">{dict.hero.free_cancellation}</span>
                  </div>
                </div>

                {/* Search Bar - Always visible */}
                <div
                  className="w-full max-w-5xl mb-4 xs:mb-5 sm:mb-6 mt-6 xs:mt-8 sm:mt-10"
                >
                  <SearchBar lang={lang} dict={dict} initialFlights={allActiveFlights} />

                  {/* CTA Button - Moved Below Search */}
                  <div className="mt-4 xs:mt-5 sm:mt-6 flex flex-col xs:flex-row items-center justify-center gap-3 xs:gap-4">
                    <Link
                      href={`/${lang}/flights?action=book`}
                      className="bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white px-6 xs:px-7 sm:px-8 md:px-10 py-3 xs:py-3.5 sm:py-4 rounded-full font-bold text-sm xs:text-base sm:text-base md:text-lg inline-flex items-center gap-2 hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 min-w-[180px] xs:min-w-[200px] sm:min-w-[220px] justify-center shadow-xl focus-visible:ring-4 focus-visible:ring-[#C04000]/50"
                      aria-label="Check flight availability"
                    >
                      {dict.hero.cta}
                      <span className="text-base xs:text-lg sm:text-xl transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                    <Link
                      href="#vols"
                      className="text-white font-semibold text-sm xs:text-base hover:text-white/80 transition-colors underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-white/50 rounded px-2"
                      aria-label="View all available flights"
                    >
                      {dict.hero.view_flights}
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Separator */}
      <div className="w-full bg-white -mt-1">
        <svg
          className="w-full h-16 md:h-24 block"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* --- TRUSTED BY SECTION --- */}
      <section className="py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 bg-[#FDFBF7] relative" aria-label="Trusted partners">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 text-center">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-serif text-black mb-2 xs:mb-3 sm:mb-4">{dict.trusted_by.title}</h2>
          <p className="text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl mb-6 xs:mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">{dict.trusted_by.subtitle}</p>

          <div className="flex flex-wrap justify-center items-center gap-6 xs:gap-8 md:gap-16 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="relative w-28 h-10 xs:w-32 xs:h-12 md:w-40 md:h-16">
              <Image
                src="/images/airbnb.webp"
                alt="Airbnb"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
            <div className="relative w-28 h-10 xs:w-32 xs:h-12 md:w-40 md:h-16">
              <Image
                src="/images/Booking.webp"
                alt="Booking.com"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
            <div className="relative w-28 h-10 xs:w-32 xs:h-12 md:w-40 md:h-16">
              <Image
                src="/images/Tripadvisor.webp"
                alt="Tripadvisor"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
            <div className="relative w-28 h-10 xs:w-32 xs:h-12 md:w-40 md:h-16">
              <Image
                src="/images/getyourguide.webp"
                alt="GetYourGuide"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <AboutSection dict={dict} lang={lang} />

      {/* --- FLIGHTS SECTION --- */}
      <section id="vols" className="py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 bg-gray-50 scroll-mt-16 relative" aria-labelledby="flights-heading">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 lg:mb-20 px-4">
            <h3 className="text-[#C04000] font-bold text-xs xs:text-sm sm:text-base md:text-lg uppercase tracking-wider mb-2 sm:mb-3">{dict.flights_section.subtitle}</h3>
            <h2 id="flights-heading" className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a2632]">{dict.flights_section.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 max-w-6xl mx-auto">
            {featuredFlights.map((flight: Flight) => (
              <div key={flight.id} className="flex">
                <FlightCard flight={flight} lang={lang} dict={dict} />
              </div>
            ))}
          </div>

          <div className="text-center mt-8 xs:mt-10 sm:mt-12">
            <Link
              href={`/${lang}/flights`}
              className="inline-block bg-[#C04000] text-white px-7 xs:px-8 sm:px-10 py-3 xs:py-3.5 sm:py-4 rounded-xl font-bold hover:bg-[#A03000] transition-transform transform hover:scale-105 shadow-lg text-sm xs:text-base sm:text-base focus-visible:ring-4 focus-visible:ring-[#C04000]/50"
              aria-label="View all available flights"
            >
              {dict.flights_section.view_all}
            </Link>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <WhyChooseSection dict={dict} />

      {/* --- PANORAMIC SECTION --- */}
      <PanoramicSection dict={dict} />

      {/* --- TESTIMONIALS SECTION --- */}
      <TestimonialsSection dict={dict} />

      {/* --- FAQ SECTION --- */}
      <FAQSection dict={dict} />

      {/* --- BLOG SECTION --- */}
      <BlogSection dict={dict} lang={lang} />

      {/* --- CONTACT SECTION --- */}
      <ContactSection dict={dict} lang={lang} />

      {/* --- SEO CONTENT SECTION (NEW) --- */}
      <SEOContent dictionary={dict} />

    </main >
  );
}



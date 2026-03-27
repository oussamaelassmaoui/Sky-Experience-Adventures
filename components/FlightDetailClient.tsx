'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Star, Shield, CheckCircle, Award, ChevronRight, X, Car, Coffee, Clock, Camera, Users, MapPin, User, ChevronDown } from 'lucide-react';
import BookingCalendar from '@/components/BookingCalendar';
import FlightCard from '@/components/FlightCard';
import PriceDisplay from '@/components/PriceDisplay';
import BookingModal from '@/components/BookingModal';
import TimelineModal from '@/components/TimelineModal';
import ReviewCard from '@/components/ReviewCard';
import { Flight } from '@/app/data/flights';
import api from '@/services/api';

interface FlightDetailClientProps {
    flight: Flight;
    suggestions: Flight[];
    lang: string;
    dict: any;
}

export default function FlightDetailClient({ flight, suggestions, lang, dict }: FlightDetailClientProps) {
    const [mainImage, setMainImage] = useState(flight.mainImage || flight.images?.[0] || ''); // Prioritize mainImage
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);

    const toggleGallery = () => setIsGalleryOpen(!isGalleryOpen);
    const toggleBooking = () => setIsBookingModalOpen(!isBookingModalOpen);
    const toggleTimeline = () => setIsTimelineOpen(!isTimelineOpen);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Fetch reviews specifically for this flight by match title
                // We use title because frontend IDs might not match backend ObjectIds directly without specific mapping
                const reviewUrl = `/reviews?status=approved&flightTitle=${encodeURIComponent(flight.title)}`;
                console.log('Fetching reviews from:', reviewUrl);
                console.log('Flight title:', flight.title);
                const response = await api.get(reviewUrl);
                setReviews(response.data);
            } catch (error) {
                console.error("Failed to fetch flight reviews", error);
            } finally {
                setReviewsLoading(false);
            }
        };

        if (flight) {
            fetchReviews();
        }
    }, [flight]);

    if (!flight) {
        notFound();
    }

    // Localized flight data
    const title = lang === 'fr' ? flight.title_fr || flight.title : flight.title;
    const description = lang === 'fr' ? flight.overview_fr || flight.overview || flight.description_fr || flight.description : flight.overview || flight.description;
    const highlights = lang === 'fr' ? flight.highlights_fr || flight.highlights : flight.highlights;
    const included = lang === 'fr' ? flight.included_fr || flight.included : flight.included;
    const features = flight.features.map(f => ({
        ...f,
        title: lang === 'fr' ? f.title_fr || f.title : f.title,
        description: lang === 'fr' ? f.description_fr || f.description : f.description
    }));

    // Localize Tour Type
    const getTourTypeLabel = (type: string) => {
        if (type.includes('Private')) return dict.flight_detail.tags.private;
        if (type.includes('Royal')) return dict.flight_detail.tags.royal;
        return dict.flight_detail.tags.classic;
    };

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        image: flight.images,
        description: description,
        offers: {
            '@type': 'Offer',
            priceCurrency: flight.currency.toUpperCase(),
            price: flight.price,
            availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: flight.rating || 4.9,
            reviewCount: flight.reviewCount || 500,
        },
    };

    // Icon Mapping Helper
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'car': return <Car className="w-6 h-6 text-[#C04000]" />;
            case 'coffee': return <Coffee className="w-6 h-6 text-[#C04000]" />;
            case 'clock': return <Clock className="w-6 h-6 text-[#C04000]" />;
            case 'safety': return <Shield className="w-6 h-6 text-[#C04000]" />;
            case 'camera': return <Camera className="w-6 h-6 text-[#C04000]" />;
            case 'users': return <Users className="w-6 h-6 text-[#C04000]" />;
            default: return <CheckCircle className="w-6 h-6 text-[#C04000]" />;
        }
    };

    return (
        <main className="min-h-screen bg-[#E6D5C3] font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <div className="pt-28 md:pt-32 pb-20 container mx-auto px-4 md:px-8 max-w-7xl">

                {/* Breadcrumbs - Keeping as is */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600 overflow-x-auto scrollbar-hide" aria-label="Breadcrumb">
                    <Link href={`/${lang}`} className="hover:text-[#C04000] transition-colors whitespace-nowrap">
                        {dict.flight_detail.breadcrumbs.home}
                    </Link>
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                    <Link href={`/${lang}/flights`} className="hover:text-[#C04000] transition-colors whitespace-nowrap">
                        {dict.flight_detail.breadcrumbs.flights}
                    </Link>
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-[#C04000] font-medium truncate max-w-[150px] sm:max-w-none">{flight.destination}</span>
                </nav>

                {/* Header Title */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight mb-4 leading-tight">
                        {title}
                    </h1>

                    {/* Quick Info Bar (New) */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm sm:text-base text-gray-700 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/60 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#C04000]" />
                            <span className="font-semibold">{flight.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#C04000]" />
                            <span className="font-semibold">{flight.minPeople}-{flight.maxPeople} {dict.flight_detail.labels.people}</span>
                        </div>
                        {flight.minAge > 0 && (
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-[#C04000]" />
                                <span className="font-semibold">{dict.flight_detail.labels.min_age}: {flight.minAge}+</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#C04000]" />
                            <span className="font-semibold">{flight.location}</span>
                        </div>

                    </div>

                    {/* Tags + difficulty + popular */}
                    {(flight.tags || flight.difficulty || flight.popular) && (
                        <div className="flex flex-wrap gap-2 items-center mt-4">
                            {flight.popular && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#C04000] border border-[#C04000]/30">
                                    🔥 {dict.flight_detail.labels.popular}
                                </span>
                            )}
                            {flight.difficulty && (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${flight.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                    flight.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {dict.flight_detail.difficulty?.[flight.difficulty as 'easy' | 'moderate' | 'challenging'] || flight.difficulty}
                                </span>
                            )}
                            {flight.tags?.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/60 text-[#C04000] border border-[#C04000]/20"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content Grid - Updated Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">

                    {/* Left Side: Images + Details Below */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Images Section */}
                        <div className="flex gap-4 h-[400px] md:h-[500px]">
                            {/* Thumbnails Column */}
                            <div className="flex flex-col gap-3 w-1/3 md:w-1/4 h-full shrink-0 overflow-y-auto pr-2 scrollbar-hide">
                                {flight.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`relative aspect-square w-full shrink-0 rounded-2xl overflow-hidden transition-all border-4 ${mainImage === img
                                            ? 'border-[#C04000] shadow-lg'
                                            : 'border-transparent opacity-70 hover:opacity-100 hover:border-[#C04000]/30'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`View ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 128px, 200px"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="relative flex-1 rounded-[2rem] overflow-hidden shadow-2xl">
                                <Image
                                    src={mainImage}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 55vw"
                                />

                                {/* Price Overlay */}
                                <div className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg md:text-xl font-bold text-white">{dict.flight_detail.labels.price} :</span>
                                        <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#FF6B35]">
                                            <PriceDisplay amount={flight.price} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Highlights Below Images */}
                        <div className="space-y-6">
                            {/* Highlights */}
                            <ul className="space-y-2 text-sm md:text-base text-gray-800">
                                {highlights.map((highlight, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-black/60 mt-1">•</span>
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Calendar Only */}
                    <div className="lg:col-span-5">
                        <BookingCalendar onCheckAvailability={() => setIsBookingModalOpen(true)} dict={dict} lang={lang} />
                    </div>
                </div>

                {/* Overview Section */}
                <div className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-black mb-6">{dict.flight_detail.labels.overview}</h2>


                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {getTourTypeLabel(flight.tourType)} Experience
                            </h3>
                            <p className="text-gray-800 leading-relaxed text-sm md:text-base whitespace-pre-line mb-8">
                                {description}
                            </p>

                            {/* Features Grid */}
                            {features && features.length > 0 && (
                                <div className="mt-8 mb-10">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {dict.flight_detail.labels.key_features}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {features.map((feature, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow group">
                                                <div className="mb-3 p-3 bg-orange-50 rounded-full group-hover:bg-[#C04000] group-hover:text-white transition-colors text-[#C04000]">
                                                    {getIcon(feature.icon)}
                                                </div>
                                                <h4 className="font-bold text-sm text-gray-900 mb-1">{feature.title}</h4>
                                                {feature.description && (
                                                    <p className="text-xs text-gray-500 leading-tight">{feature.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-black mb-6">{dict.flight_detail.labels.included}</h2>
                            <ul className="space-y-3">
                                {included.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-gray-800 text-sm md:text-base">
                                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Weather Policy */}
                        {flight.weatherPolicy && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <h3 className="text-base font-bold text-blue-800 mb-1">
                                    {dict.flight_detail.labels.weather_policy}
                                </h3>
                                <p className="text-sm text-blue-700">{flight.weatherPolicy}</p>
                            </div>
                        )}

                        {/* Excluded Section */}
                        {((lang === 'fr' ? flight.excluded_fr : flight.excluded) || []).length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-black mb-6">{dict.flight_detail.labels.excluded || (lang === 'fr' ? 'Non Inclus' : 'Excluded')}</h2>
                                <ul className="space-y-3">
                                    {(lang === 'fr' ? flight.excluded_fr || flight.excluded : flight.excluded).map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-800 text-sm md:text-base">
                                            <X className="w-5 h-5 text-red-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Program / Itinerary Section */}
                        {flight.program && flight.program.length > 0 && (
                            <div className="mt-8 mb-8" id="program">
                                <div className="flex items-center justify-between cursor-pointer group" onClick={toggleTimeline}>
                                    <h2 className="text-2xl font-bold text-black">{dict.flight_detail.labels.program}</h2>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleTimeline();
                                        }}
                                        className="flex items-center gap-2 text-[#C04000] font-bold hover:text-[#A03000] transition-colors"
                                    >
                                        <Clock size={20} />
                                        <span className="underline decoration-2 underline-offset-4">{dict.flight_detail.labels.view_itinerary}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Reviews Section */}
                        <div className="mt-20 mb-20">
                            <h2 className="text-3xl font-bold text-black mb-10 text-center uppercase tracking-wider">
                                {dict.flight_detail.labels.guest_reviews}
                            </h2>

                            {reviewsLoading ? (
                                <div className="flex justify-center p-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C04000]"></div>
                                </div>
                            ) : reviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reviews.map((review: any) => (
                                        <ReviewCard
                                            key={review._id}
                                            name={review.name}
                                            rating={review.rating}
                                            text={review.text}
                                            date={review.date}
                                            avatar={review.avatar}
                                            locale={lang}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        {dict.flight_detail.labels.no_reviews}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Flight Suggestions */}
                        <div>
                            <h2 className="text-3xl font-bold text-black mb-10 text-center uppercase tracking-wider">
                                {dict.flight_detail.labels.suggestion}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {suggestions.map((suggestion) => (
                                    <FlightCard key={suggestion.id} flight={suggestion} lang={lang} dict={dict} />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                flightTitle={title}
                flightId={flight._id || flight.id}
                pricePerPerson={flight.price}
                dict={dict}
            />

            {/* Timeline Modal */}
            <TimelineModal
                isOpen={isTimelineOpen}
                onClose={toggleTimeline}
                program={flight.program ? flight.program.map(item => ({
                    time: item.time || '',
                    title: lang === 'fr' ? (item.title_fr || item.title) : item.title,
                    description: lang === 'fr' ? (item.description_fr || item.description) : item.description
                })) : []}
                title={dict.flight_detail.labels.program}
            />

            {/* Sticky Mobile CTA */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-4 z-40 shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm text-gray-600">{dict.flight_detail.labels.from}</p>
                        <p className="text-2xl font-bold text-[#C04000]">
                            <PriceDisplay amount={flight.price} />
                        </p>
                    </div>
                    <button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="flex-1 bg-gradient-to-r from-[#C04000] to-[#D84A1B] text-white py-3 px-6 rounded-xl font-bold text-base hover:shadow-lg transition-all active:scale-95"
                    >
                        {dict.flight_detail.labels.book_now}
                    </button>
                </div>
            </div>

        </main>
    );
}

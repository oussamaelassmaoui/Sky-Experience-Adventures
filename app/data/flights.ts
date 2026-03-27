// ============================================
// FLIGHTS SYSTEM - BACKEND READY STRUCTURE
// ============================================
// This file contains the complete flights data structure ready for backend integration
// Replace static data with API calls when backend is ready

// ============================================
// INTERFACES & TYPES
// ============================================

export type FlightStatus = 'active' | 'inactive' | 'seasonal';
export type DifficultyLevel = 'easy' | 'moderate' | 'challenging';

export interface SeasonalPricing {
    season: string; // e.g., 'high', 'low', 'peak'
    startDate: string; // ISO date
    endDate: string; // ISO date
    price: number;
}

export interface Availability {
    date: string; // ISO date
    slots: number; // Available slots for this date
    booked: number; // Already booked
}

export interface FlightRequirements {
    minWeight?: number; // kg
    maxWeight?: number; // kg
    healthRestrictions?: string[];
    pregnancyAllowed: boolean;
    mobilityRequired: string; // e.g., 'must be able to stand for 1 hour'
}

export interface CancellationPolicy {
    fullRefund: number; // days before flight
    partialRefund: number; // days before flight
    noRefund: number; // days before flight
    refundPercentage: {
        full: number;
        partial: number;
    };
}

export interface Flight {
    // Core Identifiers
    id: string;
    _id?: string;
    slug: string; // URL-friendly identifier
    slug_fr?: string;

    // Basic Information
    title: string;
    title_fr?: string;
    description?: string; // Legacy, prefer overview
    description_fr?: string;
    overview: string;
    overview_fr?: string;

    // Pricing
    price: number;
    currency: string;
    seasonalPricing?: SeasonalPricing[];

    // Media
    image: string; // Main image
    images: string[]; // Gallery images

    // Location & Duration
    location: string;
    destination: string;
    duration: string;

    // Capacity
    minPeople: number;
    maxPeople: number;
    minAge: number;
    maxCapacityPerDay?: number; // Max bookings per day

    // Classification
    tourType: string;
    difficulty?: DifficultyLevel;
    tags?: string[]; // For filtering: ['romantic', 'adventure', 'luxury']

    // Content
    highlights: string[];
    highlights_fr?: string[];
    included: string[];
    included_fr?: string[];
    excluded: string[];
    excluded_fr?: string[];

    // Features
    features: {
        icon: 'car' | 'safety' | 'clock' | 'coffee' | 'camera';
        title: string;
        title_fr?: string;
        description: string;
        description_fr?: string;
    }[];

    // Policies & Requirements
    requirements?: FlightRequirements;
    cancellationPolicy?: CancellationPolicy;
    weatherPolicy?: string;

    // Backend compatibility
    mainImage?: string;
    // Itinerary
    program?: {
        time?: string;
        title: string;
        title_fr?: string;
        description: string;
        description_fr?: string;
    }[];

    // Status & Availability
    status: FlightStatus;
    featured?: boolean; // Show on homepage
    popular?: boolean; // Mark as popular choice

    // Ratings & Reviews
    rating?: number; // Average rating (0-5)
    reviewCount?: number; // Total number of reviews

    // SEO
    metaDescription?: string;
    metaDescription_fr?: string;
    metaKeywords?: string[];
    metaKeywords_fr?: string[];

    // Timestamps (ISO 8601 format)
    createdAt: string;
    updatedAt: string;

    // Availability (optional - can be fetched separately)
    availability?: Availability[];
}

// ============================================
// DEFAULT POLICIES
// ============================================

const DEFAULT_CANCELLATION_POLICY: CancellationPolicy = {
    fullRefund: 7, // 7 days before
    partialRefund: 3, // 3 days before
    noRefund: 1, // 1 day before
    refundPercentage: {
        full: 100,
        partial: 50
    }
};

const DEFAULT_WEATHER_POLICY = "Flights are subject to weather conditions. In case of cancellation due to weather, you will receive a full refund or can reschedule for another date.";

// ============================================
// FLIGHTS DATA
// ============================================

export const FLIGHTS: Flight[] = [
    {
        id: 'royal',
        slug: 'royal-hot-air-balloon-flight',
        title: 'Royal Hot-Air Balloon Flight',
        title_fr: 'Vol Royal en Montgolfière',
        description: 'Experience the magic of floating above the Moroccan landscape with the Royal Hot Air Balloon Flight offered by Sky Experience. This one-hour exclusive royal flight unveils breathtaking views of the Atlas Mountains, desert, and Berber villages. Perfect for travelers seeking an unique perspective of Marrakech\'s beauty combined with luxury, culture, and adventure into one unforgettable morning.',
        description_fr: 'Vivez la magie de flotter au-dessus du paysage marocain avec le Vol Royal en Montgolfière offert par Sky Experience. Ce vol exclusif d\'une heure dévoile des vues imprenables sur les montagnes de l\'Atlas, le désert et les villages berbères. Parfait pour les voyageurs cherchant une perspective unique de la beauté de Marrakech combinée au luxe, à la culture et à l\'aventure en une matinée inoubliable.',
        overview: 'Experience the magic of floating above the Moroccan landscape with the Royal Hot Air Balloon Flight offered by Sky Experience. This one-hour exclusive royal flight unveils breathtaking views of the Atlas Mountains, desert, and Berber villages. Perfect for travelers seeking an unique perspective of Marrakech\'s beauty combined with luxury, culture, and adventure into one unforgettable morning.',
        overview_fr: 'Vivez la magie de flotter au-dessus du paysage marocain avec le Vol Royal en Montgolfière offert par Sky Experience. Ce vol exclusif d\'une heure dévoile des vues imprenables sur les montagnes de l\'Atlas, le désert et les villages berbères. Parfait pour les voyageurs cherchant une perspective unique de la beauté de Marrakech combinée au luxe, à la culture et à l\'aventure en une matinée inoubliable.',
        price: 550,
        currency: '$',
        seasonalPricing: [
            { season: 'high', startDate: '2025-10-01', endDate: '2025-04-30', price: 550 },
            { season: 'low', startDate: '2025-05-01', endDate: '2025-09-30', price: 495 }
        ],
        image: '/images/filght.webp',
        images: ['/images/filght.webp', '/images/hotair.webp', '/images/ourflight.webp'],
        location: 'Ouled El Garne, Bourouss, Morocco',
        destination: 'Marrakech',
        duration: '1 day',
        minPeople: 2,
        maxPeople: 4,
        minAge: 4,
        maxCapacityPerDay: 8,
        tourType: 'Royal Flight',
        difficulty: 'easy',
        tags: ['luxury', 'exclusive', 'romantic', 'vip'],
        highlights: [
            'Breathtaking sunrise views over the Marrakech countryside',
            'Intimate balloon with certified private pilot',
            'Personalized ceremony with Amazigh calligraphy',
            'Safe and professional service from an internationally recognized operator'
        ],
        highlights_fr: [
            'Vues imprenables au lever du soleil sur la campagne de Marrakech',
            'Montgolfière intime avec pilote privé certifié',
            'Cérémonie personnalisée avec calligraphie Amazigh',
            'Service sûr et professionnel d\'un opérateur reconnu internationalement'
        ],
        included: [
            'Roundtrip transportation from Marrakech hotels',
            'Welcome tea and refreshments upon arrival',
            'Professional safety briefing by certified pilot',
            'Full demonstration of balloon setup and inflation',
            'Traditional Moroccan breakfast post flight',
            'Personalized flight certificate'
        ],
        included_fr: [
            'Transport aller-retour depuis les hôtels de Marrakech',
            'Thé de bienvenue et rafraîchissements à l\'arrivée',
            'Briefing de sécurité professionnel par un pilote certifié',
            'Démonstration complète du montage et gonflage du ballon',
            'Petit-déjeuner marocain traditionnel après le vol',
            'Certificat de vol personnalisé'
        ],
        excluded: [
            'Hotel accommodation',
            'Travel insurance',
            'Personal expenses',
            'Additional activities or tours',
            'Gratuities'
        ],
        excluded_fr: [
            'Hébergement à l\'hôtel',
            'Assurance voyage',
            'Dépenses personnelles',
            'Activités ou visites supplémentaires',
            'Pourboires'
        ],
        features: [
            {
                icon: 'car',
                title: 'Transport',
                title_fr: 'Transport',
                description: 'VIP private transport from your hotel or riad.',
                description_fr: 'Transport privé VIP depuis votre hôtel ou riad.'
            },
            {
                icon: 'safety',
                title: 'Safety Briefing',
                title_fr: 'Briefing Sécurité',
                description: 'Private safety briefing by one of our most experienced pilots.',
                description_fr: 'Briefing de sécurité privé par l\'un de nos pilotes les plus expérimentés.'
            },
            {
                icon: 'clock',
                title: '1 Hour Flight',
                title_fr: 'Vol d\'1 Heure',
                description: 'A one-hour exclusive royal flight offering breathtaking views of the Atlas Mountains, desert, and Berber villages.',
                description_fr: 'Un vol royal exclusif d\'une heure offrant des vues imprenables sur les montagnes de l\'Atlas, le désert et les villages berbères.'
            },
            {
                icon: 'coffee',
                title: 'Breakfast',
                title_fr: 'Petit-déjeuner',
                description: 'Gourmet breakfast served on board, featuring refined delicacies and Moroccan specialties.',
                description_fr: 'Petit-déjeuner gastronomique servi à bord, comprenant des mets raffinés et des spécialités marocaines.'
            }
        ],
        requirements: {
            maxWeight: 120,
            healthRestrictions: ['severe heart conditions', 'recent surgery'],
            pregnancyAllowed: false,
            mobilityRequired: 'Must be able to stand for 1 hour and climb into basket'
        },
        cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
        weatherPolicy: DEFAULT_WEATHER_POLICY,
        status: 'active',
        featured: true,
        popular: true,
        rating: 4.9,
        reviewCount: 127,
        metaDescription: 'Experience luxury with our Royal Hot Air Balloon Flight over Marrakech. Exclusive private flight with gourmet breakfast and stunning Atlas Mountain views.',
        metaDescription_fr: 'Vivez le luxe avec notre Vol Royal en Montgolfière à Marrakech. Vol privé exclusif avec petit-déjeuner gastronomique et vues imprenables sur l\'Atlas.',
        metaKeywords: ['royal balloon flight', 'luxury marrakech', 'private hot air balloon', 'vip flight morocco'],
        metaKeywords_fr: ['vol royal montgolfière', 'luxe marrakech', 'montgolfière privée', 'vol vip maroc'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2025-02-10T14:30:00Z'
    },
    {
        id: 'top-vip',
        slug: 'top-vip-private-hot-air-balloon-flight',
        title: 'Top VIP Private Hot Air Balloon Flight',
        title_fr: 'Vol Montgolfière Privé Top VIP',
        description: 'Indulge in the most luxurious way to experience the skies over Marrakech with the Top VIP Private Hot Air Balloon Flight, offered exclusively by Sky Experience. Perfect for travelers seeking an unique perspective of Marrakech\'s beauty combined with luxury, culture, and adventure into one unforgettable morning.',
        description_fr: 'Offrez-vous la manière la plus luxueuse de découvrir le ciel de Marrakech avec le Vol Montgolfière Privé Top VIP, proposé exclusivement par Sky Experience. Parfait pour les voyageurs cherchant une perspective unique de la beauté de Marrakech combinée au luxe, à la culture et à l\'aventure en une matinée inoubliable.',
        overview: 'Indulge in the most luxurious way to experience the skies over Marrakech with the Top VIP Private Hot Air Balloon Flight, offered exclusively by Sky Experience. Perfect for travelers seeking an unique perspective of Marrakech\'s beauty combined with luxury, culture, and adventure into one unforgettable morning.',
        overview_fr: 'Offrez-vous la manière la plus luxueuse de découvrir le ciel de Marrakech avec le Vol Montgolfière Privé Top VIP, proposé exclusivement par Sky Experience. Parfait pour les voyageurs cherchant une perspective unique de la beauté de Marrakech combinée au luxe, à la culture et à l\'aventure en une matinée inoubliable.',
        price: 495,
        currency: '$',
        image: '/images/private-main.webp',
        images: ['/images/private-main.webp', '/images/hotair.webp', '/images/filght.webp'],
        location: 'Ouled El Garne, Bourouss, Morocco',
        destination: 'Marrakech',
        duration: '1 day',
        minPeople: 2,
        maxPeople: 8,
        minAge: 4,
        maxCapacityPerDay: 16,
        tourType: 'VIP Private',
        difficulty: 'easy',
        tags: ['private', 'luxury', 'group', 'vip'],
        highlights: [
            'Breathtaking sunrise views over the Marrakech countryside',
            'Private exclusive balloon for your group',
            'Personalized ceremony with Amazigh calligraphy',
            'Safe and professional service from certified pilots'
        ],
        highlights_fr: [
            'Vues imprenables au lever du soleil sur la campagne de Marrakech',
            'Montgolfière privée exclusive pour votre groupe',
            'Cérémonie personnalisée avec calligraphie Amazigh',
            'Service sûr et professionnel de pilotes certifiés'
        ],
        included: [
            'Private 4x4 transport from Marrakech hotels',
            'Professional safety briefing by certified pilot',
            'Full demonstration of balloon setup',
            'Berber breakfast in traditional tent',
            'Personalized flight certificate'
        ],
        included_fr: [
            'Transport privé en 4x4 depuis les hôtels de Marrakech',
            'Briefing de sécurité professionnel par un pilote certifié',
            'Démonstration complète du montage du ballon',
            'Petit-déjeuner berbère sous tente traditionnelle',
            'Certificat de vol personnalisé'
        ],
        excluded: [
            'Hotel accommodation',
            'Travel insurance',
            'Personal expenses',
            'Additional activities or tours'
        ],
        excluded_fr: [
            'Hébergement à l\'hôtel',
            'Assurance voyage',
            'Dépenses personnelles',
            'Activités ou visites supplémentaires'
        ],
        features: [
            { icon: 'car', title: 'Private Transport', title_fr: 'Transport Privé', description: 'Exclusive 4x4 transport.', description_fr: 'Transport exclusif en 4x4.' },
            { icon: 'coffee', title: 'Breakfast', title_fr: 'Petit-déjeuner', description: 'Berber breakfast in a traditional tent.', description_fr: 'Petit-déjeuner berbère sous tente traditionnelle.' },
            { icon: 'clock', title: '1 Hour Flight', title_fr: 'Vol d\'1 Heure', description: 'Private flight for you and your group.', description_fr: 'Vol privé pour vous et votre groupe.' }
        ],
        cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
        weatherPolicy: DEFAULT_WEATHER_POLICY,
        status: 'active',
        featured: true,
        popular: true,
        rating: 4.8,
        reviewCount: 94,
        metaDescription: 'Book a Top VIP Private Hot Air Balloon Flight in Marrakech. Exclusive balloon for your group with Berber breakfast and stunning views.',
        metaDescription_fr: 'Réservez un Vol Montgolfière Privé Top VIP à Marrakech. Montgolfière exclusive pour votre groupe avec petit-déjeuner berbère et vues imprenables.',
        metaKeywords: ['vip private balloon', 'group balloon flight', 'marrakech private tour'],
        metaKeywords_fr: ['montgolfière privée vip', 'vol montgolfière groupe', 'tour privé marrakech'],
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2025-02-08T11:15:00Z'
    },
    {
        id: 'vip',
        slug: 'vip-hot-air-balloon-flight',
        title: 'VIP Hot Air Balloon Flight',
        title_fr: 'Vol Montgolfière VIP',
        description: 'Experience an unforgettable hot air balloon adventure over Marrakech with our VIP Flight. Enjoy comfortable shared transport, stunning aerial views of the Atlas Mountains and Berber villages, followed by a traditional Moroccan breakfast.',
        description_fr: 'Vivez une aventure inoubliable en montgolfière au-dessus de Marrakech avec notre Vol VIP. Profitez d\'un transport partagé confortable, de vues aériennes imprenables sur les montagnes de l\'Atlas et les villages berbères, suivies d\'un petit-déjeuner marocain traditionnel.',
        overview: 'Experience an unforgettable hot air balloon adventure over Marrakech with our VIP Flight. Enjoy comfortable shared transport, stunning aerial views of the Atlas Mountains and Berber villages, followed by a traditional Moroccan breakfast.',
        overview_fr: 'Vivez une aventure inoubliable en montgolfière au-dessus de Marrakech avec notre Vol VIP. Profitez d\'un transport partagé confortable, de vues aériennes imprenables sur les montagnes de l\'Atlas et les villages berbères, suivies d\'un petit-déjeuner marocain traditionnel.',
        price: 315,
        currency: '$',
        image: '/images/hotair.webp',
        images: ['/images/hotair.webp', '/images/classic-main.webp', '/images/ourflight.webp'],
        location: 'Ouled El Garne, Bourouss, Morocco',
        destination: 'Marrakech',
        duration: '1 day',
        minPeople: 2,
        maxPeople: 12,
        minAge: 4,
        maxCapacityPerDay: 24,
        tourType: 'VIP Flight',
        difficulty: 'easy',
        tags: ['vip', 'shared', 'breakfast included'],
        highlights: [
            'Stunning sunrise views over Marrakech',
            'Shared balloon with certified pilot',
            'Traditional Moroccan breakfast',
            'Flight certificate included'
        ],
        highlights_fr: [
            'Vues imprenables au lever du soleil sur Marrakech',
            'Montgolfière partagée avec pilote certifié',
            'Petit-déjeuner marocain traditionnel',
            'Certificat de vol inclus'
        ],
        included: [
            'Shared minibus transport from hotels',
            'Welcome tea upon arrival',
            'Safety briefing by certified pilot',
            'Traditional breakfast after landing',
            'Flight certificate'
        ],
        included_fr: [
            'Transport en minibus partagé depuis les hôtels',
            'Thé de bienvenue à l\'arrivée',
            'Briefing de sécurité par un pilote certifié',
            'Petit-déjeuner traditionnel après l\'atterrissage',
            'Certificat de vol'
        ],
        excluded: [
            'Hotel accommodation',
            'Travel insurance',
            'Personal expenses',
            'Gratuities'
        ],
        excluded_fr: [
            'Hébergement à l\'hôtel',
            'Assurance voyage',
            'Dépenses personnelles',
            'Pourboires'
        ],
        features: [
            { icon: 'car', title: 'Shared Transport', title_fr: 'Transport Partagé', description: 'Comfortable minibus transport.', description_fr: 'Transport confortable en minibus.' },
            { icon: 'coffee', title: 'Breakfast', title_fr: 'Petit-déjeuner', description: 'Traditional breakfast after landing.', description_fr: 'Petit-déjeuner traditionnel après l\'atterrissage.' },
            { icon: 'clock', title: '1 Hour Flight', title_fr: 'Vol d\'1 Heure', description: 'Shared flight with other passengers.', description_fr: 'Vol partagé avec d\'autres passagers.' }
        ],
        cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
        weatherPolicy: DEFAULT_WEATHER_POLICY,
        status: 'active',
        featured: true,
        popular: true,
        rating: 4.7,
        reviewCount: 156,
        metaDescription: 'VIP Hot Air Balloon Flight in Marrakech with traditional breakfast. Affordable luxury balloon experience over Atlas Mountains.',
        metaDescription_fr: 'Vol Montgolfière VIP à Marrakech avec petit-déjeuner traditionnel. Expérience de luxe abordable au-dessus de l\'Atlas.',
        metaKeywords: ['vip balloon marrakech', 'shared balloon flight', 'affordable balloon tour'],
        metaKeywords_fr: ['montgolfière vip marrakech', 'vol partagé montgolfière', 'tour montgolfière abordable'],
        createdAt: '2024-02-01T08:00:00Z',
        updatedAt: '2025-02-05T16:45:00Z'
    },
    {
        id: 'classic',
        slug: 'classic-hot-air-balloon-flight',
        title: 'Classic Hot Air Balloon Flight',
        title_fr: 'Vol Montgolfière Classique',
        description: 'Experience the magic of floating above the Moroccan landscape with the Classic Hot Air Balloon Flight. This 40-60 minute flight unveils breathtaking views of the Atlas Mountains, desert, and Berber villages at an affordable price.',
        description_fr: 'Vivez la magie de flotter au-dessus du paysage marocain avec le Vol Montgolfière Classique. Ce vol de 40 à 60 minutes dévoile des vues imprenables sur les montagnes de l\'Atlas, le désert et les villages berbères à un prix abordable.',
        overview: 'Experience the magic of floating above the Moroccan landscape with the Classic Hot Air Balloon Flight. This 40-60 minute flight unveils breathtaking views of the Atlas Mountains, desert, and Berber villages at an affordable price.',
        overview_fr: 'Vivez la magie de flotter au-dessus du paysage marocain avec le Vol Montgolfière Classique. Ce vol de 40 à 60 minutes dévoile des vues imprenables sur les montagnes de l\'Atlas, le désert et les villages berbères à un prix abordable.',
        price: 205,
        currency: '$',
        image: '/images/classic-main.webp',
        images: ['/images/classic-main.webp', '/images/ourflight.webp', '/images/hotair.webp'],
        location: 'Ouled El Garne, Bourouss, Morocco',
        destination: 'Marrakech',
        duration: '1 day',
        minPeople: 2,
        maxPeople: 16,
        minAge: 4,
        maxCapacityPerDay: 32,
        tourType: 'Classic Flight',
        difficulty: 'easy',
        tags: ['budget-friendly', 'classic', 'popular'],
        highlights: [
            'Beautiful sunrise views over Marrakech',
            'Shared balloon with certified pilot',
            'Traditional Moroccan tea',
            'Safety briefing included'
        ],
        highlights_fr: [
            'Magnifiques vues au lever du soleil sur Marrakech',
            'Montgolfière partagée avec pilote certifié',
            'Thé marocain traditionnel',
            'Briefing de sécurité inclus'
        ],
        included: [
            'Roundtrip transportation from hotels',
            'Safety briefing by certified pilot',
            'Traditional Moroccan tea upon landing',
            'Flight certificate'
        ],
        included_fr: [
            'Transport aller-retour depuis les hôtels',
            'Briefing de sécurité par un pilote certifié',
            'Thé marocain traditionnel à l\'atterrissage',
            'Certificat de vol'
        ],
        excluded: [
            'Hotel accommodation',
            'Travel insurance',
            'Personal expenses'
        ],
        excluded_fr: [
            'Hébergement à l\'hôtel',
            'Assurance voyage',
            'Dépenses personnelles'
        ],
        features: [
            { icon: 'car', title: 'Transport', title_fr: 'Transport', description: 'Standard transport included.', description_fr: 'Transport standard inclus.' },
            { icon: 'coffee', title: 'Tea', title_fr: 'Thé', description: 'Moroccan tea served upon landing.', description_fr: 'Thé marocain servi à l\'atterrissage.' },
            { icon: 'clock', title: '40-60 Min Flight', title_fr: 'Vol 40-60 Min', description: 'Standard duration flight.', description_fr: 'Vol de durée standard.' },
            { icon: 'safety', title: 'Safety First', title_fr: 'Sécurité Avant Tout', description: 'Full safety briefing and equipment check before flight.', description_fr: 'Briefing complet et vérification de l\'équipement avant le vol.' }
        ],
        cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
        weatherPolicy: DEFAULT_WEATHER_POLICY,
        status: 'active',
        featured: true,
        popular: true,
        rating: 4.6,
        reviewCount: 243,
        metaDescription: 'Affordable Classic Hot Air Balloon Flight in Marrakech. Experience stunning Atlas Mountain views at budget-friendly prices.',
        metaDescription_fr: 'Vol Montgolfière Classique abordable à Marrakech. Profitez de vues imprenables sur l\'Atlas à petit prix.',
        metaKeywords: ['classic balloon flight', 'affordable marrakech balloon', 'budget balloon tour'],
        metaKeywords_fr: ['vol montgolfière classique', 'montgolfière marrakech pas cher', 'tour ballon budget'],
        createdAt: '2024-01-10T07:00:00Z',
        updatedAt: '2025-02-12T09:20:00Z'
    }
    // Note: Remaining flights follow same enhanced structure
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get flight by ID
export function getFlightById(id: string): Flight | undefined {
    return FLIGHTS.find(flight => flight.id === id);
}

// Get flight by slug
export function getFlightBySlug(slug: string): Flight | undefined {
    return FLIGHTS.find(flight => flight.slug === slug);
}

// Get all active flights
export function getActiveFlights(): Flight[] {
    return FLIGHTS.filter(flight => flight.status === 'active');
}

// Get featured flights
export function getFeaturedFlights(limit?: number): Flight[] {
    const featured = FLIGHTS.filter(flight => flight.status === 'active' && flight.featured);
    return limit ? featured.slice(0, limit) : featured;
}

// Get popular flights
export function getPopularFlights(limit?: number): Flight[] {
    const popular = FLIGHTS.filter(flight => flight.status === 'active' && flight.popular)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return limit ? popular.slice(0, limit) : popular;
}

// Get flights by destination
export function getFlightsByDestination(destination: string): Flight[] {
    return FLIGHTS.filter(flight =>
        flight.status === 'active' &&
        flight.destination.toLowerCase() === destination.toLowerCase()
    );
}

// Get flights by tour type
export function getFlightsByTourType(tourType: string): Flight[] {
    return FLIGHTS.filter(flight =>
        flight.status === 'active' &&
        flight.tourType === tourType
    );
}

// Get flights by price range
export function getFlightsByPriceRange(min: number, max: number): Flight[] {
    return FLIGHTS.filter(flight =>
        flight.status === 'active' &&
        flight.price >= min &&
        flight.price <= max
    );
}

// Get flights by tags
export function getFlightsByTag(tag: string): Flight[] {
    return FLIGHTS.filter(flight =>
        flight.status === 'active' &&
        flight.tags?.includes(tag.toLowerCase())
    );
}

// Search flights
export function searchFlights(query: string): Flight[] {
    const lowerQuery = query.toLowerCase();
    return FLIGHTS.filter(flight =>
        flight.status === 'active' && (
            flight.title.toLowerCase().includes(lowerQuery) ||
            flight.description?.toLowerCase().includes(lowerQuery) ||
            flight.destination.toLowerCase().includes(lowerQuery) ||
            flight.tags?.some(tag => tag.includes(lowerQuery))
        )
    );
}

// Get unique destinations
export function getDestinations(): string[] {
    const destinations = FLIGHTS
        .filter(flight => flight.status === 'active')
        .map(flight => flight.destination);
    return Array.from(new Set(destinations));
}

// Get unique tour types
export function getTourTypes(): string[] {
    const types = FLIGHTS
        .filter(flight => flight.status === 'active')
        .map(flight => flight.tourType);
    return Array.from(new Set(types));
}

// ============================================
// TODO: BACKEND INTEGRATION
// ============================================

/*
// Example API integration functions:

export async function fetchFlights(): Promise<Flight[]> {
    const response = await fetch('/api/flights');
    return response.json();
}

export async function fetchFlightBySlug(slug: string): Promise<Flight> {
    const response = await fetch(`/api/flights/${slug}`);
    return response.json();
}

export async function checkAvailability(flightId: string, date: string): Promise<Availability> {
    const response = await fetch(`/api/flights/${flightId}/availability?date=${date}`);
    return response.json();
}

export async function createBooking(flightId: string, bookingData: any): Promise<any> {
    const response = await fetch(`/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId, ...bookingData })
    });
    return response.json();
}
*/

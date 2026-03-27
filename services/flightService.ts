/**
 * Flight Service - Handles all flight data fetching
 * Used for SSR (Server Side Rendering) and client-side data
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://skyexperience-backend-production.up.railway.app/api';

export interface Flight {
    _id: string;
    title: string;
    title_fr?: string;
    slug: string;
    price: number;
    image: string;
    images?: string[];
    destination: string;
    duration: string;
    tourType: string;
    status?: string;
    location?: string;
    overview?: string;
    overview_fr?: string;
    description?: string;
    description_fr?: string;
}

/**
 * Fetch all flights from backend (SSR compatible)
 * @param options Fetch options (cache, revalidate, etc.)
 * Default: 30s revalidation for near real-time destination updates
 */
export async function getAllFlights(options?: RequestInit): Promise<Flight[]> {
    try {
        const response = await fetch(`${API_URL}/flights`, {
            next: { revalidate: 30 }, // Revalidate every 30 seconds
            ...options,
        });

        if (!response.ok) {
            console.error('Failed to fetch flights:', response.statusText);
            return [];
        }

        const data = await response.json();
        // API returns { success: true, flights: [...] }
        return Array.isArray(data?.flights) ? data.flights : [];
    } catch (error) {
        console.error('Error fetching flights:', error);
        return [];
    }
}

/**
 * Fetch only active flights for search/display
 * Note: Backend already filters active flights, no need to filter again
 */
export async function getActiveFlights(options?: RequestInit): Promise<Flight[]> {
    // Backend /api/flights already returns only active flights
    return await getAllFlights(options);
}

/**
 * Fetch flight by ID
 */
export async function getFlightById(id: string, options?: RequestInit): Promise<Flight | null> {
    try {
        const response = await fetch(`${API_URL}/flights/${id}`, {
            next: { revalidate: 300 },
            ...options,
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        // API returns { success: true, flight: {...}, suggestedFlights, slugs }
        return data?.flight || null;
    } catch (error) {
        console.error('Error fetching flight:', error);
        return null;
    }
}

/**
 * Get unique destinations from flights
 */
export function getDestinationsFromFlights(flights: Flight[]): string[] {
    const destinations = flights
        .filter(f => f.status === 'active')
        .map(f => f.destination);
    return Array.from(new Set(destinations));
}

/**
 * Get unique tour types from flights
 */
export function getTourTypesFromFlights(flights: Flight[]): string[] {
    const types = flights
        .filter(f => f.status === 'active')
        .map(f => f.tourType);
    return Array.from(new Set(types));
}

/**
 * Client-side cache helpers
 */
export const FlightCache = {
    KEY: 'skyexperience_flights_cache',
    EXPIRY: 5 * 60 * 1000, // 5 minutes

    set(flights: Flight[]) {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(this.KEY, JSON.stringify({
                data: flights,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Cache save failed:', e);
        }
    },

    get(): Flight[] | null {
        if (typeof window === 'undefined') return null;
        try {
            const cached = localStorage.getItem(this.KEY);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            // Return cached data if less than 5 minutes old
            if (age < this.EXPIRY) {
                return data;
            }

            // Cache expired, clear it
            this.clear();
            return null;
        } catch (e) {
            console.warn('Cache read failed:', e);
            return null;
        }
    },

    clear() {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(this.KEY);
        } catch (e) {
            console.warn('Cache clear failed:', e);
        }
    }
};

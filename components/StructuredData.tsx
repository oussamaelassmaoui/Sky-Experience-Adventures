import React from 'react';

interface StructuredDataProps {
  lang: string;
}

export default function StructuredData({ lang }: StructuredDataProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": "https://skyexperience-marrakech.com/#organization",
    "name": "Sky Experience Marrakech",
    "alternateName": lang === 'fr' ? "Montgolfière Marrakech" : "Hot Air Balloon Marrakech",
    "url": "https://skyexperience-marrakech.com",
    "logo": "https://skyexperience-marrakech.com/images/logo.webp",
    "description": lang === 'fr' 
      ? "Service premium de vol en montgolfière à Marrakech. Expériences inoubliables au lever du soleil sur l'Atlas."
      : "Premium hot air balloon service in Marrakech. Unforgettable sunrise experiences over the Atlas Mountains.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Marrakech",
      "addressLocality": "Marrakech",
      "addressRegion": "Marrakech-Safi",
      "postalCode": "40000",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 31.6295,
      "longitude": -7.9811
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+212-6-62-18-49-49",
      "contactType": "Customer Service",
      "email": "contact@skyexperience-marrakech.com",
      "availableLanguage": ["English", "French", "Arabic"]
    },
    "sameAs": [
      "https://www.facebook.com/skyexperience",
      "https://www.instagram.com/skyexperience",
      "https://twitter.com/skyexperience"
    ],
    "priceRange": "$$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "05:00",
      "closes": "10:00"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": lang === 'fr' ? "Vols en Montgolfière" : "Balloon Flights",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": lang === 'fr' ? "Vol Classique" : "Classic Flight",
            "description": lang === 'fr' 
              ? "Vol en groupe au lever du soleil" 
              : "Group sunrise balloon flight",
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": lang === 'fr' ? "Vol Privé" : "Private Flight",
            "description": lang === 'fr'
              ? "Expérience exclusive et personnalisée"
              : "Exclusive personalized experience",
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": lang === 'fr' ? "Vol Royal" : "Royal Flight",
            "description": lang === 'fr'
              ? "Service ultra-premium avec champagne"
              : "Ultra-premium service with champagne",
          }
        }
      ]
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sky Experience Marrakech",
    "image": "https://skyexperience-marrakech.com/images/hero.webp",
    "url": "https://skyexperience-marrakech.com",
    "telephone": "+212-6-62-18-49-49",
    "email": "contact@skyexperience-marrakech.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Marrakech",
      "addressLocality": "Marrakech",
      "postalCode": "40000",
      "addressCountry": "MA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 31.6295,
      "longitude": -7.9811
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "05:00",
      "closes": "10:00"
    },
    "priceRange": "$$$$",
    "servesCuisine": "Tourism & Adventure"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sky Experience Marrakech",
    "url": "https://skyexperience-marrakech.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://skyexperience-marrakech.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": lang === 'fr' ? "Accueil" : "Home",
        "item": `https://skyexperience-marrakech.com/${lang}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

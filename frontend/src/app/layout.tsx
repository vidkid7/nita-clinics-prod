import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { AppBootstrap } from '@/components/ui/AppBootstrap';
import { Toaster } from 'react-hot-toast';
import { BRAND, BRAND_COLORS } from '@/lib/brand';
import { DEFAULT_OG_IMAGE, SITE_URL, siteUrl } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} | Multi-Specialty Clinic in Kathmandu`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    `${BRAND.name} is a multi-specialty clinic in Kathmandu offering doctor consultations, lab tests, health check-up packages, vaccinations, and preventive healthcare for families.`,
  keywords: [
    'nita clinic',
    'clinic kathmandu',
    'health checkup nepal',
    'lab test kathmandu',
    'our services nita clinic',
    'vaccination clinic',
    'specialist doctors nepal',
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: BRAND.name,
    url: SITE_URL,
    title: `${BRAND.name} | Multi-Specialty Clinic in Kathmandu`,
    description:
      'Doctor consultations, laboratory tests, preventive health check-ups, vaccinations, and family healthcare in Kathmandu, Nepal.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 600,
        height: 328,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} | Multi-Specialty Clinic in Kathmandu`,
    description:
      'Doctor consultations, laboratory tests, preventive health check-ups, vaccinations, and family healthcare in Kathmandu, Nepal.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      'VQhhKVW1gEBgpgtMxnK0tdFpT1zWUkWsXQI-0oCq_Ug',
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLORS.primary,
  width: 'device-width',
  initialScale: 1,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  '@id': `${SITE_URL}/#medical-clinic`,
  name: BRAND.name,
  alternateName: ['Nita Clinics', 'NITA Clinic'],
  description:
    'Official website for Nita Clinic, also known as Nita Clinics, an independent multi-specialty clinic at Bhimsengola-9, Kathmandu, Nepal.',
  disambiguatingDescription:
    'Nita Clinic is an independent healthcare clinic in Bhimsengola-9, Kathmandu, with its own website, contact details, map location, doctors, and Nita Laboratory department.',
  url: SITE_URL,
  logo: siteUrl(BRAND.logo),
  image: [DEFAULT_OG_IMAGE],
  telephone: BRAND.phone,
  email: BRAND.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BRAND.address,
    addressLocality: 'Kathmandu',
    addressRegion: 'Bagmati',
    addressCountry: 'NP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BRAND.mapLat,
    longitude: BRAND.mapLng,
  },
  hasMap: `https://www.google.com/maps/?q=${BRAND.mapLat},${BRAND.mapLng}`,
  areaServed: { '@type': 'City', name: 'Kathmandu' },
  medicalSpecialty: ['Gynecology', 'Obstetrics', 'Pediatrics', 'Pulmonary Disease'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '16:00',
    },
  ],
  sameAs: [BRAND.social.facebook, BRAND.social.instagram, BRAND.social.youtube].filter(Boolean),
  brand: {
    '@type': 'Brand',
    '@id': `${SITE_URL}/#brand`,
    name: BRAND.name,
    alternateName: 'Nita Clinics',
    url: SITE_URL,
    logo: siteUrl(BRAND.logo),
  },
  department: {
    '@type': 'MedicalOrganization',
    '@id': `${SITE_URL}/#nita-laboratory`,
    name: 'Nita Laboratory',
    description: 'The laboratory and pathology testing department of Nita Clinic in Bhimsengola-9, Kathmandu.',
    url: siteUrl('/services/laboratory'),
    parentOrganization: { '@id': `${SITE_URL}/#medical-clinic` },
  },
  knowsAbout: [
    'medical consultations in Kathmandu',
    'laboratory testing and pathology',
    'health check-up packages',
    'vaccination and immunization',
    'home healthcare visits',
    'online doctor consultations',
    'pharmacy services',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Nita Clinic healthcare services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Laboratory testing', url: siteUrl('/services/laboratory') },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Vaccination services', url: siteUrl('/services/vaccination') },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Home visit healthcare', url: siteUrl('/services/home-visit') },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Online doctor consultation', url: siteUrl('/services/online-consultation') },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Pharmacy services', url: siteUrl('/services/pharmacy') },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Specialist doctor consultations', url: siteUrl('/specialists') },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Preventive health check-ups', url: siteUrl('/checkup') },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Diagnostic tests', url: siteUrl('/diagnostic-test') },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'NITA Health Card membership', url: siteUrl('/health-card') },
      },
    ],
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: BRAND.phone,
    contactType: 'customer service',
    areaServed: 'NP',
    availableLanguage: ['en', 'ne'],
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: BRAND.name,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#medical-clinic` },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-neutral-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: BRAND_COLORS.background,
              color: BRAND_COLORS.foreground,
              borderLeft: `4px solid ${BRAND_COLORS.primary}`,
              boxShadow: `0 4px 20px rgba(${BRAND_COLORS.primaryRgb}, 0.12)`,
            },
            success: {
              iconTheme: {
                primary: BRAND_COLORS.primary,
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#dc2626',
                secondary: '#fff',
              },
            },
          }}
        />
        <AppBootstrap>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppBootstrap>
      </body>
    </html>
  );
}

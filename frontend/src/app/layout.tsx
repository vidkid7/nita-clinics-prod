import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { AppBootstrap } from '@/components/ui/AppBootstrap';
import { Toaster } from 'react-hot-toast';
import { BRAND, BRAND_COLORS } from '@/lib/brand';
import { absoluteUrl } from '@/lib/site-url';

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
  metadataBase: new URL(absoluteUrl(process.env.NEXT_PUBLIC_SITE_URL, BRAND.siteUrl)),
  title: {
    default: `${BRAND.name} | Complete Healthcare in Kathmandu`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    `${BRAND.name} is your trusted clinic in Kathmandu for specialist consultations, lab tests, check-up packages, vaccination services, and preventive healthcare.`,
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
    title: BRAND.name,
    description: 'Complete family-focused clinic & lab care in Kathmandu',
    images: [
      {
        url: BRAND.ogImage,
        width: 1200,
        height: 630,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BRAND.name,
    description: 'Complete family-focused clinic & lab care in Kathmandu',
    images: [BRAND.ogImage],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLORS.primary,
  width: 'device-width',
  initialScale: 1,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: BRAND.name,
  url: BRAND.siteUrl,
  logo: `${BRAND.siteUrl}${BRAND.logo}`,
  telephone: BRAND.phone,
  email: BRAND.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BRAND.address,
    addressCountry: 'NP',
  },
  medicalSpecialty: ['Gynecology', 'Obstetrics', 'Pediatrics', 'Pulmonary Disease'],
  openingHours: ['Mo-Fr 07:00-19:00', 'Sa 08:00-17:00'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: BRAND.name,
  url: BRAND.siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BRAND.siteUrl}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
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

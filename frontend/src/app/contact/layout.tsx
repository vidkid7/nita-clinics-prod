import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { BRAND } from '@/lib/brand';
import { breadcrumbSchema, publicPageMetadata, siteUrl } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Contact Nita Clinic | Bhimsengola, Kathmandu',
  description:
    'Visit Nita Clinic at Bhimsengola-9, Kathmandu, or call +977-01-4533361 for appointments, lab tests, vaccinations, and healthcare enquiries.',
  path: '/contact',
  keywords: ['Nita Clinic contact', 'clinic Bhimsengola Kathmandu', 'book clinic appointment Kathmandu'],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const clinicId = `${siteUrl()}#medical-clinic`;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact Nita Clinic', path: '/contact' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          '@id': `${siteUrl('/contact')}#contact-page`,
          url: siteUrl('/contact'),
          name: 'Contact Nita Clinic | Bhimsengola, Kathmandu',
          description:
            'Contact Nita Clinic at Bhimsengola-9, Kathmandu for appointments, laboratory tests, vaccinations, and healthcare enquiries.',
          about: { '@id': clinicId },
          mainEntity: {
            '@type': 'MedicalClinic',
            '@id': clinicId,
            name: BRAND.name,
            url: siteUrl(),
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
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '07:00',
                closes: '19:00',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '08:00',
                closes: '17:00',
              },
            ],
          },
        }}
      />
      {children}
    </>
  );
}

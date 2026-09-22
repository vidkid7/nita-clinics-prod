import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata, siteUrl } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Vaccination Services in Kathmandu | Nita Clinic',
  description:
    'Plan child, adult, travel, pregnancy, influenza, tetanus, and pneumococcal vaccination with Nita Clinic’s team in Kathmandu.',
  path: '/services/vaccination',
  keywords: ['vaccination services Kathmandu', 'child vaccine Nepal', 'adult vaccine Kathmandu'],
});

export default function VaccinationServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Vaccination Services', path: '/services/vaccination' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${siteUrl('/services/vaccination')}#service`,
          name: 'Vaccination Services',
          serviceType: 'Vaccination and immunization service',
          description:
            'Vaccination planning and administration in Kathmandu for children, adults, seniors, pregnancy, seasonal protection, and travel health.',
          provider: { '@id': `${siteUrl()}#medical-clinic` },
          areaServed: { '@type': 'City', name: 'Kathmandu' },
          url: siteUrl('/services/vaccination'),
        }}
      />
      {children}
    </>
  );
}

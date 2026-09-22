import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata, siteUrl } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Laboratory and Pathology Tests in Kathmandu | Nita Clinic',
  description:
    'Explore Nita Laboratory services in Kathmandu, from blood and hematology testing to biochemistry, microbiology, serology, and preventive screening.',
  path: '/services/laboratory',
  keywords: ['pathology lab Kathmandu', 'blood test Kathmandu', 'laboratory services Nepal'],
});

export default function LaboratoryServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Laboratory Services', path: '/services/laboratory' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${siteUrl('/services/laboratory')}#service`,
          name: 'Nita Laboratory Services',
          serviceType: 'Medical laboratory testing',
          description:
            'Laboratory and pathology testing in Kathmandu across hematology, biochemistry, microbiology, serology, parasitology, and preventive screening.',
          provider: { '@id': `${siteUrl()}#medical-clinic` },
          areaServed: { '@type': 'City', name: 'Kathmandu' },
          url: siteUrl('/services/laboratory'),
        }}
      />
      {children}
    </>
  );
}

import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata, siteUrl } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Nita Laboratory in Bhimsengola, Kathmandu | Nita Clinic',
  description:
    'Visit Nita Laboratory at Nita Clinic, Bhimsengola-9, Kathmandu for blood tests, biochemistry, microbiology, serology and preventive screening.',
  path: '/services/laboratory',
  keywords: ['Nita Laboratory Kathmandu', 'blood test Bhimsengola', 'laboratory services Kathmandu'],
});

export default function LaboratoryServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Nita Laboratory', path: '/services/laboratory' },
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
            'Nita Laboratory at Nita Clinic, Bhimsengola-9, Kathmandu provides hematology, biochemistry, microbiology, serology, parasitology, and preventive screening tests.',
          provider: { '@id': `${siteUrl()}#medical-clinic` },
          areaServed: { '@type': 'City', name: 'Kathmandu' },
          url: siteUrl('/services/laboratory'),
        }}
      />
      {children}
    </>
  );
}

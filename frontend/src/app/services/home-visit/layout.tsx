import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata, serviceSchema } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Home Visit Healthcare in Kathmandu | Nita Clinic',
  description:
    'Book a doctor home visit, home lab sample collection, or home vaccination in Kathmandu Valley with Nita Clinic’s healthcare team and digital follow-up.',
  path: '/services/home-visit',
  keywords: ['home visit doctor Kathmandu', 'home sample collection Kathmandu', 'home healthcare Nepal'],
});

export default function HomeVisitServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Home Visit Healthcare', path: '/services/home-visit' },
        ])}
      />
      <JsonLd
        data={serviceSchema({
          path: '/services/home-visit',
          name: 'Nita Clinic Home Visit Healthcare',
          serviceType: 'Doctor, laboratory sample collection, and vaccination home visits',
          description:
            'Home doctor consultations, laboratory sample collection, and vaccination visits in Kathmandu Valley from Nita Clinic.',
          areaServed: 'Kathmandu Valley, Nepal',
        })}
      />
      {children}
    </>
  );
}

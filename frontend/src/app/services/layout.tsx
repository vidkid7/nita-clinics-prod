import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, itemListSchema, publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Healthcare Services in Kathmandu | Nita Clinic',
  description:
    'Explore Nita Clinic healthcare services in Kathmandu: laboratory testing, vaccination, home visits, online doctor consultations, and pharmacy support.',
  path: '/services',
  keywords: [
    'healthcare services Kathmandu',
    'clinic services Nepal',
    'Nita Clinic services',
    'laboratory vaccination home visit Kathmandu',
  ],
});

const serviceItems = [
  { name: 'Laboratory Services', path: '/services/laboratory' },
  { name: 'Vaccination Services', path: '/services/vaccination' },
  { name: 'Home Visit Healthcare', path: '/services/home-visit' },
  { name: 'Online Doctor Consultation', path: '/services/online-consultation' },
  { name: 'Pharmacy Services', path: '/services/pharmacy' },
];

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Healthcare Services', path: '/services' },
        ])}
      />
      <JsonLd data={itemListSchema('Nita Clinic healthcare services', '/services', serviceItems)} />
      {children}
    </>
  );
}

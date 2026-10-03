import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata, serviceSchema } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Clinic Pharmacy in Kathmandu | Nita Clinic',
  description:
    'Find pharmacist-reviewed prescription support and medicine access through the Nita Clinic pharmacy in Kathmandu, with guidance for safe collection and follow-up.',
  path: '/services/pharmacy',
  keywords: ['pharmacy Kathmandu', 'clinic pharmacy Nepal', 'prescription medicine Kathmandu'],
});

export default function PharmacyServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Pharmacy Services', path: '/services/pharmacy' },
        ])}
      />
      <JsonLd
        data={serviceSchema({
          path: '/services/pharmacy',
          name: 'Nita Clinic Pharmacy',
          serviceType: 'Clinic pharmacy and prescription support',
          description:
            'Pharmacist-reviewed prescription support, medicine collection, and home delivery from Nita Clinic in Bhimsengola-9, Kathmandu.',
        })}
      />
      {children}
    </>
  );
}

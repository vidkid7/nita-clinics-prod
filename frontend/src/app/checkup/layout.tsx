import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata, serviceSchema } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Health Check-up Packages in Kathmandu | Nita Clinic',
  description:
    'Compare preventive health check-up packages at Nita Clinic in Kathmandu, including general, women’s, children’s, orthopedic, and TB screening programmes.',
  path: '/checkup',
  keywords: [
    'health check-up Kathmandu',
    'full body check-up Nepal',
    'preventive health package Kathmandu',
    'women health check-up Kathmandu',
    'child health check-up Nepal',
  ],
});

export default function CheckupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Health Check-ups', path: '/checkup' },
        ])}
      />
      <JsonLd
        data={serviceSchema({
          path: '/checkup',
          name: 'Nita Clinic Preventive Health Check-ups',
          serviceType: 'Preventive health screening and check-up packages',
          description:
            'Preventive health check-ups and screening packages in Kathmandu, including general, women’s, children’s, orthopedic, and tuberculosis programmes.',
        })}
      />
      {children}
    </>
  );
}

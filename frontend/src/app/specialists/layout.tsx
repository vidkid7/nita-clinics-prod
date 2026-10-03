import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata, serviceSchema } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Medical Specialists in Kathmandu | Nita Clinic',
  description:
    'Meet Nita Clinic specialists in gynecology, obstetrics, pediatrics, tuberculosis, pulmonology, and orthopedics in Kathmandu, Nepal.',
  path: '/specialists',
  keywords: [
    'medical specialists Kathmandu',
    'gynecologist Kathmandu',
    'pediatrician Kathmandu',
    'orthopedic doctor Kathmandu',
    'TB specialist Nepal',
  ],
});

export default function SpecialistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Medical Specialists', path: '/specialists' },
        ])}
      />
      <JsonLd
        data={serviceSchema({
          path: '/specialists',
          name: 'Nita Clinic Specialist Consultations',
          serviceType: 'Medical specialist consultation',
          description:
            'Specialist consultations in gynecology, obstetrics, pediatrics, tuberculosis care, pulmonology, and orthopedics in Kathmandu.',
        })}
      />
      {children}
    </>
  );
}

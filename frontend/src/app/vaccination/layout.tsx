import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Vaccination Clinic in Kathmandu | Nita Clinic',
  description:
    'Get family vaccination services in Kathmandu for children, adults, seniors, pregnancy, travel, influenza, tetanus, and pneumococcal protection.',
  path: '/vaccination',
  keywords: [
    'vaccination clinic Kathmandu',
    'child vaccination Kathmandu',
    'adult vaccination Nepal',
    'flu vaccine Kathmandu',
    'travel vaccination Nepal',
  ],
});

export default function VaccinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Vaccination Clinic', path: '/vaccination' },
        ])}
      />
      {children}
    </>
  );
}

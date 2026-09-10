import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

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
  return <>{children}</>;
}

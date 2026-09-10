import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Vaccination Services in Kathmandu | Nita Clinic',
  description:
    'Protect your family with child, adult, travel, pregnancy, influenza, tetanus, and pneumococcal vaccination services at Nita Clinic in Kathmandu.',
  path: '/services/vaccination',
  keywords: ['vaccination services Kathmandu', 'child vaccine Nepal', 'adult vaccine Kathmandu'],
});

export default function VaccinationServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Healthcare Services in Kathmandu | Nita Clinic',
  description:
    'Explore doctor consultations, Nita Laboratory testing, vaccinations, home visits, online consultations, pharmacy support, and preventive care in Kathmandu.',
  path: '/services',
  keywords: [
    'healthcare services Kathmandu',
    'clinic services Nepal',
    'home sample collection Kathmandu',
    'online doctor consultation Nepal',
    'pharmacy Kathmandu',
  ],
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

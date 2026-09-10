import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Healthcare Services in Kathmandu | Nita Clinic',
  description:
    'Explore Nita Clinic services in Kathmandu: doctor consultations, laboratory testing, vaccinations, home visits, online consultations, pharmacy support, and preventive care.',
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

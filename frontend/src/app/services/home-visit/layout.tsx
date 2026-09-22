import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Home Visit Healthcare in Kathmandu | Nita Clinic',
  description:
    'Book a doctor home visit, home lab sample collection, or home vaccination in Kathmandu Valley with Nita Clinic’s healthcare team and digital follow-up.',
  path: '/services/home-visit',
  keywords: ['home visit doctor Kathmandu', 'home sample collection Kathmandu', 'home healthcare Nepal'],
});

export default function HomeVisitServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

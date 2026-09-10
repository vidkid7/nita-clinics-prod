import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Home Visit Healthcare in Kathmandu | Nita Clinic',
  description:
    'Arrange convenient home visits and home sample collection in Kathmandu with the Nita Clinic healthcare team.',
  path: '/services/home-visit',
  keywords: ['home visit doctor Kathmandu', 'home sample collection Kathmandu', 'home healthcare Nepal'],
});

export default function HomeVisitServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

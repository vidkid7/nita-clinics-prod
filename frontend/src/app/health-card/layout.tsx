import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Nita Health Card | Healthcare Benefits in Kathmandu',
  description:
    'Explore Nita Health Card categories, member benefits, partner access, and how to apply for affordable healthcare support in Kathmandu.',
  path: '/health-card',
  keywords: ['Nita Health Card', 'health card Kathmandu', 'healthcare benefits Nepal'],
});

export default function HealthCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

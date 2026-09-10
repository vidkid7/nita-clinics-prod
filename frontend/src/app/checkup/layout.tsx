import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

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
  return <>{children}</>;
}

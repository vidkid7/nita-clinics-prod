import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

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
  return <>{children}</>;
}

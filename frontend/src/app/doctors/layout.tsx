import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Doctors at Nita Clinic | Kathmandu Medical Team',
  description:
    'Browse the Nita Clinic doctor directory and find clinicians for general medicine, women’s health, pediatrics, orthopedics, and respiratory care in Kathmandu.',
  path: '/doctors',
  keywords: ['doctors Kathmandu', 'Nita Clinic doctor directory', 'specialist doctors Nepal'],
});

export default function DoctorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

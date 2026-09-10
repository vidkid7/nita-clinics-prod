import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Clinic Pharmacy in Kathmandu | Nita Clinic',
  description:
    'Get pharmacist-reviewed prescription support and medicine access through the Nita Clinic pharmacy in Kathmandu.',
  path: '/services/pharmacy',
  keywords: ['pharmacy Kathmandu', 'clinic pharmacy Nepal', 'prescription medicine Kathmandu'],
});

export default function PharmacyServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

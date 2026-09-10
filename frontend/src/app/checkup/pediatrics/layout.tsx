import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Child Health Check-up in Kathmandu | Nita Clinic',
  description:
    'Support your child’s growth, development, nutrition, vaccination review, and preventive care with a pediatric check-up at Nita Clinic in Kathmandu.',
  path: '/checkup/pediatrics',
  keywords: ['child health check-up Kathmandu', 'pediatric check-up Nepal', 'child doctor Kathmandu'],
});

export default function PediatricsCheckupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

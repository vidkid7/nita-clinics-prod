import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Full Body Health Check-up Packages Kathmandu | Nita Clinic',
  description:
    'Compare affordable full body and preventive health check-up packages at Nita Clinic in Kathmandu, with laboratory testing and clinician report review.',
  path: '/checkup/packages',
  keywords: ['full body check-up Kathmandu', 'health check-up package Nepal', 'preventive check-up Kathmandu'],
});

export default function CheckupPackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

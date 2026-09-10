import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'About Nita Clinic | Trusted Healthcare in Kathmandu',
  description:
    'Learn about Nita Clinic, our family-focused approach, medical team, laboratory services, and commitment to accessible healthcare in Kathmandu, Nepal.',
  path: '/about',
  keywords: ['about Nita Clinic', 'clinic Kathmandu Nepal', 'family healthcare Kathmandu'],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Women’s Health Check-up in Kathmandu | Nita Clinic',
  description:
    'Book a women’s health and gynecology check-up in Kathmandu with consultation, screening, laboratory tests, and personalized follow-up at Nita Clinic.',
  path: '/checkup/gynecology',
  keywords: ['women health check-up Kathmandu', 'gynecology check-up Nepal', 'female health screening Kathmandu'],
});

export default function GynecologyCheckupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

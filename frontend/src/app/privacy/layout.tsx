import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Privacy Policy | Nita Clinic Kathmandu',
  description:
    'Read the Nita Clinic privacy policy to understand how we collect, use, protect, and retain information submitted through our healthcare website and appointment services.',
  path: '/privacy',
  keywords: ['Nita Clinic privacy policy', 'healthcare privacy Kathmandu', 'appointment data privacy Nepal'],
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Nita Clinic Health Blog | Health Advice from Kathmandu Doctors',
  description:
    'Read practical health articles from the Nita Clinic team about preventive care, vaccination, diabetes, respiratory health, check-ups, and family wellness in Nepal.',
  path: '/blog',
  keywords: [
    'health blog Nepal',
    'health tips Kathmandu',
    'preventive healthcare Nepal',
    'Nita Clinic health advice',
  ],
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

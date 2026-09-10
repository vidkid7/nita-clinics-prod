import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Nita Clinic Gallery | Clinic and Healthcare Facilities',
  description:
    'See Nita Clinic facilities, healthcare services, laboratory environment, and community moments in Kathmandu, Nepal.',
  path: '/gallery',
  keywords: ['Nita Clinic gallery', 'clinic facilities Kathmandu', 'Nita Path Labs'],
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

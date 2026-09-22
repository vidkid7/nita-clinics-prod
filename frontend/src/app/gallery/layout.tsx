import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Nita Clinic Gallery | Clinic and Healthcare Facilities',
  description:
    'Explore Nita Clinic facilities, laboratory spaces, healthcare services, and community moments from our Kathmandu clinic through the photo gallery.',
  path: '/gallery',
  keywords: ['Nita Clinic gallery', 'clinic facilities Kathmandu', 'Nita Laboratory'],
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

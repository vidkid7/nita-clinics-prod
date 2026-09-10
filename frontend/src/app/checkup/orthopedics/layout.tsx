import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Orthopedic Check-up in Kathmandu | Nita Clinic',
  description:
    'Book an orthopedic check-up in Kathmandu for joint, bone, muscle, and spine concerns with clinical assessment, imaging, and treatment guidance at Nita Clinic.',
  path: '/checkup/orthopedics',
  keywords: ['orthopedic check-up Kathmandu', 'bone doctor Kathmandu', 'joint pain clinic Nepal'],
});

export default function OrthopedicsCheckupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

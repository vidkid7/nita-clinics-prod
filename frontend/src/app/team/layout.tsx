import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Doctors and Healthcare Team | Nita Clinic Kathmandu',
  description:
    'Meet the doctors, clinicians, and healthcare team supporting consultations, laboratory care, preventive check-ups, and family health at Nita Clinic in Kathmandu.',
  path: '/team',
  keywords: ['Nita Clinic doctors', 'healthcare team Kathmandu', 'doctors Nepal'],
});

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

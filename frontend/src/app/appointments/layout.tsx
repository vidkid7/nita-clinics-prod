import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Book a Doctor Appointment in Kathmandu | Nita Clinic',
  description:
    'Book a Nita Clinic appointment in Kathmandu for a doctor consultation, health check-up, laboratory test, vaccination, or other healthcare service.',
  path: '/appointments/book',
  keywords: ['book doctor appointment Kathmandu', 'online clinic appointment Nepal', 'Nita Clinic booking'],
});

export default function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

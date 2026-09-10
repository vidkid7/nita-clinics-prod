import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Contact Nita Clinic | Bhimsengola, Kathmandu',
  description:
    'Contact Nita Clinic at Bhimsengola-9, Kathmandu for appointments, doctor consultations, lab tests, vaccinations, and healthcare enquiries.',
  path: '/contact',
  keywords: ['Nita Clinic contact', 'clinic Bhimsengola Kathmandu', 'book clinic appointment Kathmandu'],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

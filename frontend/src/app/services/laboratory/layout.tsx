import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Laboratory and Pathology Tests in Kathmandu | Nita Clinic',
  description:
    'Book reliable laboratory and pathology tests in Kathmandu at Nita Clinic, including blood tests, microbiology, serology, and preventive screening.',
  path: '/services/laboratory',
  keywords: ['pathology lab Kathmandu', 'blood test Kathmandu', 'laboratory services Nepal'],
});

export default function LaboratoryServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Tuberculosis Screening and Check-up Kathmandu | Nita Clinic',
  description:
    'Get physician-led tuberculosis screening in Kathmandu with sputum testing, GeneXpert, chest X-ray, laboratory evaluation, and follow-up at Nita Clinic.',
  path: '/checkup/tuberculosis',
  keywords: ['TB test Kathmandu', 'tuberculosis screening Nepal', 'GeneXpert Kathmandu', 'chest X-ray TB test'],
});

export default function TuberculosisCheckupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { SPECIALIST_META } from '@/lib/specialist-data';
import { SpecialistDetailPage } from '@/components/specialists/SpecialistDetailPage';
import { publicPageMetadata } from '@/lib/seo';

const data = SPECIALIST_META.tuberculosis;

export const metadata: Metadata = publicPageMetadata({
  title: 'Tuberculosis and Respiratory Care in Kathmandu | Nita Clinic',
  description:
    'Get tuberculosis screening, respiratory evaluation, chest care, and structured follow-up from the Nita Clinic team in Kathmandu, Nepal.',
  path: '/specialists/tuberculosis',
  keywords: ['TB specialist Kathmandu', 'tuberculosis clinic Nepal', 'respiratory doctor Kathmandu', 'TB screening Kathmandu'],
});

export default function TuberculosisPage() {
  return <SpecialistDetailPage slug="tuberculosis" data={data} />;
}


import type { Metadata } from 'next';
import { SPECIALIST_META } from '@/lib/specialist-data';
import { SpecialistDetailPage } from '@/components/specialists/SpecialistDetailPage';
import { publicPageMetadata } from '@/lib/seo';

const data = SPECIALIST_META.pediatrics;

export const metadata: Metadata = publicPageMetadata({
  title: 'Pediatrician in Kathmandu | Nita Clinic',
  description:
    'Find pediatric care in Kathmandu for infants, children, and adolescents at Nita Clinic, including growth monitoring, immunization, development, and common childhood illnesses.',
  path: '/specialists/pediatrics',
  keywords: ['pediatrician Kathmandu', 'child doctor Nepal', 'children vaccination Kathmandu', 'newborn care Kathmandu'],
});

export default function PediatricsPage() {
  return <SpecialistDetailPage slug="pediatrics" data={data} />;
}


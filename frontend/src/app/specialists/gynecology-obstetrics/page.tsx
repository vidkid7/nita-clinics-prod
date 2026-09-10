import type { Metadata } from 'next';
import { SPECIALIST_META } from '@/lib/specialist-data';
import { SpecialistDetailPage } from '@/components/specialists/SpecialistDetailPage';
import { publicPageMetadata } from '@/lib/seo';

const data = SPECIALIST_META['gynecology-obstetrics'];

export const metadata: Metadata = publicPageMetadata({
  title: 'Gynecology and Obstetrics Care in Kathmandu | Nita Clinic',
  description:
    'Access experienced gynecology and obstetrics care in Kathmandu at Nita Clinic, including prenatal care, women’s health, reproductive health, and antenatal support.',
  path: '/specialists/gynecology-obstetrics',
  keywords: ['gynecologist Kathmandu', 'obstetrician Kathmandu', 'women health doctor Nepal', 'prenatal care Kathmandu'],
});

export default function GynecologyObstetricsPage() {
  return <SpecialistDetailPage slug="gynecology-obstetrics" data={data} />;
}


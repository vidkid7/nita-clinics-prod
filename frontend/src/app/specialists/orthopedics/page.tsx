import type { Metadata } from 'next';
import { SPECIALIST_META } from '@/lib/specialist-data';
import { SpecialistDetailPage } from '@/components/specialists/SpecialistDetailPage';
import { publicPageMetadata } from '@/lib/seo';

const data = SPECIALIST_META.orthopedics;

export const metadata: Metadata = publicPageMetadata({
  title: 'Orthopedic Specialist in Kathmandu | Nita Clinic',
  description:
    'Get orthopedic evaluation in Kathmandu for joint, bone, muscle, and spine concerns at Nita Clinic, with diagnosis, imaging, and treatment guidance.',
  path: '/specialists/orthopedics',
  keywords: ['orthopedic doctor Kathmandu', 'bone specialist Nepal', 'joint pain clinic Kathmandu', 'spine care Nepal'],
});

export default function OrthopedicsPage() {
  return <SpecialistDetailPage slug="orthopedics" data={data} />;
}

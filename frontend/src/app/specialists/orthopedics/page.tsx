import type { Metadata } from 'next';
import { SPECIALIST_META } from '@/lib/specialist-data';
import { SpecialistDetailPage } from '@/components/specialists/SpecialistDetailPage';

const data = SPECIALIST_META.orthopedics;

export const metadata: Metadata = {
  title: data.title,
  description: data.description,
  alternates: { canonical: 'https://nitaclinics.com/specialists/orthopedics' },
};

export default function OrthopedicsPage() {
  return <SpecialistDetailPage slug="orthopedics" data={data} />;
}
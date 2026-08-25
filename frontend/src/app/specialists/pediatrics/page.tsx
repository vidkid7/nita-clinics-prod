import type { Metadata } from 'next';
import { SPECIALIST_META } from '@/lib/specialist-data';
import { SpecialistDetailPage } from '@/components/specialists/SpecialistDetailPage';

const data = SPECIALIST_META.pediatrics;

export const metadata: Metadata = {
  title: data.title,
  description: data.description,
  alternates: { canonical: 'https://nitaclinics.com/specialists/pediatrics' },
};

export default function PediatricsPage() {
  return <SpecialistDetailPage slug="pediatrics" data={data} />;
}


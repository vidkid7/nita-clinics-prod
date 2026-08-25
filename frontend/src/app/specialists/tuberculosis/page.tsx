import type { Metadata } from 'next';
import { SPECIALIST_META } from '@/lib/specialist-data';
import { SpecialistDetailPage } from '@/components/specialists/SpecialistDetailPage';

const data = SPECIALIST_META.tuberculosis;

export const metadata: Metadata = {
  title: data.title,
  description: data.description,
  alternates: { canonical: 'https://nitaclinics.com/specialists/tuberculosis' },
};

export default function TuberculosisPage() {
  return <SpecialistDetailPage slug="tuberculosis" data={data} />;
}


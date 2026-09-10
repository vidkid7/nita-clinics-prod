import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getVaccineBySlug } from '@/lib/vaccine-data';
import { breadcrumbSchema, publicPageMetadata } from '@/lib/seo';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vaccine = getVaccineBySlug(params.slug);
  if (!vaccine) {
    return {
      title: 'Vaccination Programme Not Found | Nita Clinic',
      robots: { index: false, follow: false },
    };
  }

  return publicPageMetadata({
    title: `${vaccine.name} in Kathmandu | Nita Clinic`,
    description:
      `${vaccine.description} Learn about eligibility, doses, schedule, and availability at Nita Clinic’s vaccination clinic in Kathmandu.`,
    path: `/vaccination/${params.slug}`,
    image: vaccine.image,
    keywords: [
      `${vaccine.name} Kathmandu`,
      `${vaccine.shortName} vaccine`,
      'vaccination clinic Kathmandu',
      ...vaccine.category.filter((category) => category !== 'All'),
    ],
  });
}

export default function VaccinationDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const vaccine = getVaccineBySlug(params.slug);
  const breadcrumbs = vaccine
    ? breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Vaccination', path: '/vaccination' },
        { name: vaccine.name, path: `/vaccination/${params.slug}` },
      ])
    : null;

  return (
    <>
      {breadcrumbs && <JsonLd data={breadcrumbs} />}
      {children}
    </>
  );
}

import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { FALLBACK_LAB_TESTS } from '@/lib/diagnostic-data-fallback';
import { publicPageMetadata, siteUrl } from '@/lib/seo';

type Props = { params: { id: string } };

function findTest(id: string) {
  return FALLBACK_LAB_TESTS.find((test) => test.slug === id || test.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const test = findTest(params.id);
  if (!test) {
    return {
      title: 'Laboratory Test Not Found | Nita Clinic',
      robots: { index: false, follow: false },
    };
  }

  return publicPageMetadata({
    title: `${test.name} Lab Test in Kathmandu | Nita Clinic`,
    description:
      `${test.description} Book this ${test.name} laboratory test at Nita Clinic in Kathmandu with clear preparation and report guidance.`,
    path: `/diagnostic-test/${params.id}`,
    image: test.image || siteUrl('/images/catalogue/blood-specimen.jpg'),
    keywords: [
      `${test.name} Kathmandu`,
      `${test.name} lab test`,
      'laboratory test Kathmandu',
      ...(test.tags ?? []),
    ],
  });
}

export default function DiagnosticTestDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const test = findTest(params.id);
  const breadcrumbs = test
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Laboratory Tests', item: siteUrl('/diagnostic-test') },
          { '@type': 'ListItem', position: 3, name: test.name, item: siteUrl(`/diagnostic-test/${params.id}`) },
        ],
      }
    : null;

  return (
    <>
      {breadcrumbs && <JsonLd data={breadcrumbs} />}
      {children}
    </>
  );
}

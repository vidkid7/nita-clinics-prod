import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Laboratory Tests in Kathmandu | Nita Clinic',
  description:
    'Browse pathology, hematology, biochemistry, serology, microbiology, parasitology, and preventive laboratory tests at Nita Clinic in Kathmandu.',
  path: '/diagnostic-test',
  keywords: [
    'lab tests Kathmandu',
    'blood test Kathmandu',
    'pathology lab Kathmandu',
    'diagnostic tests Nepal',
    'Nita Laboratory',
  ],
});

export default function DiagnosticTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Laboratory Tests', path: '/diagnostic-test' },
        ])}
      />
      {children}
    </>
  );
}

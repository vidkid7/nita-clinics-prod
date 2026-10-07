import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata, serviceSchema } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Nita Laboratory Tests in Kathmandu | Nita Clinic',
  description:
    'Browse blood tests, hematology, biochemistry, serology, microbiology and preventive screening at Nita Laboratory, Nita Clinic in Bhimsengola-9, Kathmandu.',
  path: '/diagnostic-test',
  keywords: [
    'lab tests Kathmandu',
    'blood test Kathmandu',
    'laboratory Bhimsengola Kathmandu',
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
      <JsonLd
        data={serviceSchema({
          path: '/diagnostic-test',
          name: 'Nita Laboratory Tests and Diagnostics',
          serviceType: 'Medical laboratory and diagnostic testing',
          description:
            'Browse Nita Laboratory pathology, hematology, biochemistry, serology, microbiology, parasitology, and preventive tests in Kathmandu.',
        })}
      />
      {children}
    </>
  );
}

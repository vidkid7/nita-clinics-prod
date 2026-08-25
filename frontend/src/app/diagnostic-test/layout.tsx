import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lab & Service Tests',
  description:
    'Explore lab and service tests at Nita Clinic — pathology, microbiology, serology, radiology, and preventive screenings at affordable prices.',
};

export default function DiagnosticTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

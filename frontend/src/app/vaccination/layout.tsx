import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vaccination',
  description:
    'Vaccination services and guidance for children and adults at Nita Clinic.',
};

export default function VaccinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

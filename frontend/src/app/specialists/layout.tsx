import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Experts',
  description:
    'Meet our team of medical experts at Nita Clinic — gynecology, pediatrics, tuberculosis, and orthopedics specialists.',
};

export default function SpecialistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

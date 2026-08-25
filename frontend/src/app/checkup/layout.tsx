import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check-up Packages',
  description:
    'Compare general and premium check-up packages with transparent pricing at Nita Clinic.',
};

export default function CheckupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

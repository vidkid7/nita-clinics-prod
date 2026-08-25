import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Card',
  description:
    'Explore health card categories, member benefits, and partner access at Nita Clinic.',
};

export default function HealthCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

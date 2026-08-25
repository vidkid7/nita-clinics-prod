import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team Members',
  description:
    'View doctors and administrative team members at Nita Clinic.',
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

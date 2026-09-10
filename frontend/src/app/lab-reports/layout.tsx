import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Access Lab Reports | Nita Clinic Kathmandu',
  description:
    'Access your Nita Clinic laboratory reports securely and review your results with a qualified healthcare professional when needed.',
  path: '/lab-reports',
  keywords: ['Nita Clinic lab reports', 'online lab report Kathmandu', 'pathology reports Nepal'],
});

export default function LabReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

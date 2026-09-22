import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Terms of Service | Nita Clinic Kathmandu',
  description:
    'Read the Nita Clinic terms of service for website use, appointment requests, healthcare information, communications, and responsibilities in Kathmandu, Nepal.',
  path: '/terms',
  keywords: ['Nita Clinic terms of service', 'clinic appointment terms Kathmandu', 'Nita Clinic website terms'],
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

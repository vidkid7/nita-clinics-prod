import type { Metadata } from 'next';
import { publicPageMetadata } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Online Doctor Consultation in Nepal | Nita Clinic',
  description:
    'Connect with Nita Clinic clinicians through online consultations for follow-ups, report review, prescriptions, and selected healthcare needs in Nepal.',
  path: '/services/online-consultation',
  keywords: ['online doctor consultation Nepal', 'telemedicine Kathmandu', 'online medical consultation'],
});

export default function OnlineConsultationServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

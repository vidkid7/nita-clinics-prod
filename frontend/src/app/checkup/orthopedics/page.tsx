import type { Metadata } from 'next';
import OrthopedicsCheckupClient from './OrthopedicsCheckupClient';

export const metadata: Metadata = {
  title: 'Orthopedics Check-up | Nita Clinic',
  description:
    'Orthopedic check-up at Nita Clinic — joint, bone & spine evaluation with on-site X-ray, MSK ultrasound, lab panel and treatment plan.',
};

export default function OrthopedicsCheckupPage() {
  return <OrthopedicsCheckupClient />;
}

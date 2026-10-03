import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema, publicPageMetadata, serviceSchema } from '@/lib/seo';

export const metadata: Metadata = publicPageMetadata({
  title: 'Online Doctor Consultation in Nepal | Nita Clinic',
  description:
    'Connect with Nita Clinic clinicians through online consultations for follow-ups, report review, prescriptions, and selected healthcare needs in Nepal.',
  path: '/services/online-consultation',
  keywords: ['online doctor consultation Nepal', 'telemedicine Kathmandu', 'online medical consultation'],
});

export default function OnlineConsultationServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Online Doctor Consultation', path: '/services/online-consultation' },
        ])}
      />
      <JsonLd
        data={serviceSchema({
          path: '/services/online-consultation',
          name: 'Nita Clinic Online Doctor Consultation',
          serviceType: 'Online medical consultation and telemedicine',
          description:
            'Online doctor consultations from Nita Clinic for follow-ups, report review, prescriptions, referrals, and selected healthcare needs in Nepal.',
          areaServed: 'Nepal',
        })}
      />
      {children}
    </>
  );
}

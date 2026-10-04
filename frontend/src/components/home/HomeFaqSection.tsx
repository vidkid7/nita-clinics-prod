import Link from 'next/link';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';

export const HOME_FAQS = [
  {
    q: 'What is the official Nita Clinics website?',
    a: 'The official Nita Clinics website is https://nitaclinics.com. Nita Clinic is the independent multi-specialty clinic at Bhimsengola-9, Kathmandu, Nepal. Call +977-01-4533361 or email info@nitaclinics.com for help.',
  },
  {
    q: 'Where is Nita Clinic located?',
    a: 'Nita Clinic is located at Bhimsengola-9, Kathmandu, Nepal. Call +977-01-4533361 for directions or visit the Contact page.',
  },
  {
    q: 'How can I find Nita Clinic on Google Maps?',
    a: 'Search Google Maps for Nita Clinic, Bhimsengola-9, Kathmandu, or use the clinic map location at https://www.google.com/maps/?q=27.7002155,85.3459041. The clinic phone number is +977-01-4533361.',
  },
  {
    q: 'What healthcare services does Nita Clinic provide?',
    a: 'Nita Clinic provides doctor consultations, Nita Laboratory testing, preventive health check-ups, vaccinations, home healthcare visits, online consultations, pharmacy services, and health check-up packages.',
  },
  {
    q: 'What are Nita Clinic opening hours?',
    a: 'Nita Clinic is open Monday to Friday from 9:00 AM to 6:00 PM and Saturday from 9:00 AM to 4:00 PM.',
  },
  {
    q: 'How can I book an appointment at Nita Clinic?',
    a: 'You can book an appointment online through the appointment booking page or call +977-01-4533361 for help choosing a service or specialist.',
  },
] as const;

export function HomeFaqSection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="home-faq-heading">
      <div className="container-custom max-w-4xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="section-kicker">Helpful answers</span>
          <h2 id="home-faq-heading" className="mt-4 text-3xl font-heading font-bold text-neutral-900 md:text-4xl">
            Nita Clinic <span className="text-primary-600">FAQs</span>
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-600">
            Find quick answers about our Kathmandu clinic, services, hours, location, and appointments.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {HOME_FAQS.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-5 transition-colors hover:border-primary-200 hover:bg-primary-50/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-neutral-800 marker:hidden">
                <span>{item.q}</span>
                <FiChevronDown className="h-5 w-5 shrink-0 text-neutral-400 transition-transform group-open:rotate-180 group-open:text-primary-600" aria-hidden="true" />
              </summary>
              <p className="pt-3 leading-relaxed text-neutral-600">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 font-semibold text-neutral-700 shadow-sm transition-colors hover:border-primary-300 hover:text-primary-700">
            Contact clinic <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/appointments/book" className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-primary-700">
            Book an appointment <FiArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

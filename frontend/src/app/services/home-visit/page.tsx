'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Home as HomeIcon,
  Stethoscope,
  Syringe,
  FlaskConical,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Phone,
  MapPin,
  Heart,
  Award,
} from 'lucide-react';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { IconTileList } from '@/components/ui/IconTileList';
import { FiCalendar, FiPhone } from 'react-icons/fi';

const PACKAGES = [
  {
    id: 'doctor-visit',
    icon: <Stethoscope className="h-6 w-6" />,
    title: 'Doctor Consultation at Home',
    tagline: '15–30 minute private visit',
    price: 2500,
    description:
      'A licensed Nita Clinic doctor comes to your home for a full consultation, basic physical exam, prescription and referral advice.',
    features: [
      'General physician / family medicine',
      'Basic vitals + physical exam',
      'Digital prescription on the spot',
      'E-referral for lab tests if needed',
    ],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'sample-collection',
    icon: <FlaskConical className="h-6 w-6" />,
    title: 'Lab Sample Collection at Home',
    tagline: 'Phlebotomist visits, same-day pickup',
    price: 800,
    description:
      'Trained phlebotomist collects blood, urine or stool samples at your home. Samples are sealed and transported by cold chain to our laboratory.',
    features: [
      'Single test or panel collection',
      'Sterile, sealed vacuum tubes used',
      'Cold-chain transport to our lab',
      'Same-day digital reports',
    ],
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'home-vaccination',
    icon: <Syringe className="h-6 w-6" />,
    title: 'Vaccination at Home',
    tagline: 'Nurse visit with cold-chain kit',
    price: 1500,
    description:
      'Certified nurse administers T.T, Influenza or Pneumococcal vaccines at your home. Cold-chain kit, post-vaccination observation and digital record included.',
    features: [
      'Nurse visit + cold-chain kit',
      'T.T, Influenza, Pneumococcal available',
      '15-min post-shot observation',
      'Digital vaccination certificate',
    ],
    color: 'from-violet-500 to-indigo-600',
  },
];

const INCLUDED = [
  { icon: <Stethoscope className="h-5 w-5" />, title: 'Licensed clinicians', copy: 'NMC-registered doctors and trained nurses — same standard as in-clinic.' },
  { icon: <ShieldCheck className="h-5 w-5" />, title: 'Sterile kit', copy: 'Single-use, sealed instruments and consumables brought to every visit.' },
  { icon: <Clock className="h-5 w-5" />, title: 'Same-day reports', copy: 'Lab samples delivered to our lab within 2 hours of collection.' },
  { icon: <Award className="h-5 w-5" />, title: 'Transparent pricing', copy: 'No hidden charges — travel within Kathmandu Valley is included.' },
];

const STEPS = [
  { n: '01', title: 'Book your slot', copy: 'Pick a service, choose a date and a 2-hour window.' },
  { n: '02', title: 'We confirm by phone', copy: 'Our coordinator calls within 30 minutes to confirm.' },
  { n: '03', title: 'Clinician arrives', copy: 'A Nita Clinic professional arrives with a sterile kit at your home.' },
  { n: '04', title: 'Reports & follow-up', copy: 'Receive digital reports and a free follow-up call within 48 hours.' },
];

export default function HomeVisitPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    service: 'doctor-visit',
    date: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { post, getErrorMessage } = await import('@/lib/api');
      const serviceLabel =
        form.service === 'doctor-visit'
          ? 'Doctor home visit'
          : form.service === 'sample-collection'
            ? 'Lab sample collection at home'
            : 'Vaccination at home';
      const message = [
        `Service: ${serviceLabel}`,
        `Address: ${form.address}`,
        form.date ? `Preferred date: ${form.date}` : null,
        form.notes ? `Notes: ${form.notes}` : null,
      ]
        .filter(Boolean)
        .join('\n');
      await post('enquiries', {
        type: 'services',
        name: form.name,
        phone: form.phone,
        email: `home-visit-${Date.now()}@nita.local`,
        subject: `Home visit booking — ${serviceLabel}`,
        message,
      });
      setSubmitted(true);
    } catch (err) {
      const { getErrorMessage } = await import('@/lib/api');
      // Use a lightweight in-page error so we don't pull in toast styling
      alert(`Could not submit booking: ${getErrorMessage(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const homeVisitActions = [
    { label: 'Book a Home Visit', href: '#book', icon: <FiCalendar className="h-4 w-4" />, variant: 'primary' as const },
    { label: 'Call Us', href: 'tel:+977014533361', variant: 'secondary' as const },
  ];

  return (
    <main>
      <PremiumLandingHero
        eyebrow="Home Visit Service · Nita Clinic"
        title="Doctor, nurse or lab,"
        highlight="at your doorstep."
        description="Skip the waiting room. Book a doctor consultation, lab sample collection or vaccination at your home — same standard of care, same digital records, transparent pricing."
        videoSrc="/videos/hero/doctor-writing-appointment.mp4"
        posterSrc="/videos/hero/doctor-writing-appointment.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-teal-900/[0.42]"
        actions={homeVisitActions}
        trustPoints={[
          'NMC-registered doctors and trained nurses',
          'Sterile single-use kit brought to your home',
          'Same-day lab reports from our laboratory',
          'Available 7 days a week in Kathmandu Valley',
        ]}
        stats={[
          { value: 'NPR 800', label: 'From' },
          { value: '2hr', label: 'Window' },
          { value: '7/7', label: 'Days' },
        ]}
        panelEyebrow="Home Visit"
        panelTitle="Care that comes to you."
        panelItems={[
          'Choose a doctor visit, lab sample collection or vaccination at home.',
          'We confirm by phone, send a clinician with a sterile kit, and follow up digitally.',
          'No transport, no waiting room — and same in-clinic standard of care.',
        ]}
      />

      {/* 3 service packages */}
      <section className="section-padding relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 plus-pattern-light opacity-30" />
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Three ways to use Home Visit"
            title="Pick the service"
            highlight="you need"
            subtitle="All packages include the clinician visit, sterile kit, digital reports and a free follow-up call."
            className="mb-12"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {PACKAGES.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.2)]"
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${p.color}`} />
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.color} text-white`}>
                  {p.icon}
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-neutral-900">{p.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary-700">{p.tagline}</p>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{p.description}</p>
                <IconTileList
                  items={p.features}
                  category={`${p.title} home service features`}
                  accent={i === 0 ? 'emerald' : i === 1 ? 'rose' : 'violet'}
                  layout="list"
                  className="mt-5 gap-2"
                  itemClassName="rounded-2xl p-3"
                />
                <div className="mt-5 flex items-end justify-between border-t border-neutral-100 pt-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">From</p>
                    <p className="font-heading text-2xl font-extrabold text-neutral-900">NPR {p.price.toLocaleString()}</p>
                  </div>
                  <Link
                    href="#book"
                    onClick={() => setForm((f) => ({ ...f, service: p.id }))}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-primary-700"
                  >
                    Book <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <SectionHeader
            eyebrow="What you get"
            title="Included in every"
            highlight="home visit"
            subtitle="No surprise fees. The visit fee covers clinician travel within Kathmandu Valley and a 48-hour follow-up call."
            className="mb-10"
          />
          <IconTileList
            items={INCLUDED}
            category="home visit service included"
            accent="emerald"
            className="mx-auto max-w-5xl lg:grid-cols-4"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="How it works"
            title="Four steps from"
            highlight="booking to follow-up"
            subtitle="The whole process is digital — no paperwork, no clinic visit, no waiting room."
            className="mb-10"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-soft"
              >
                <p className="text-3xl font-heading font-bold text-emerald-200">{s.n}</p>
                <h3 className="mt-3 font-heading text-base font-semibold text-neutral-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className="section-padding bg-neutral-50">
        <div className="container-custom max-w-3xl">
          <SectionHeader
            eyebrow="Book a Home Visit"
            title="Schedule your"
            highlight="home visit"
            subtitle="Fill in the form below and our coordinator will call you within 30 minutes to confirm."
            className="mb-8"
          />

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold text-emerald-900">Request received</h3>
              <p className="mt-2 text-sm text-emerald-800/80">
                Our home-visit coordinator will call <strong>{form.phone || 'you'}</strong> within 30 minutes to confirm the slot.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', address: '', service: 'doctor-visit', date: '', notes: '' }); }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700"
              >
                Book another visit
              </button>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-3xl border border-neutral-100 bg-white p-7 shadow-soft space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Your name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Phone</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="98xxxxxxxx"
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Address in Kathmandu Valley</label>
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Bhimsengola-09, Kathmandu"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Service</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white"
                  >
                    <option value="doctor-visit">Doctor Consultation (NPR 2,500)</option>
                    <option value="sample-collection">Lab Sample Collection (NPR 800)</option>
                    <option value="home-vaccination">Home Vaccination (NPR 1,500)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Preferred date</label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Notes (optional)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Anything we should know before visiting?"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Prefer to call? <a href="tel:+977014533361" className="font-semibold text-primary-700">01-4533361</a>
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-primary-700 disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Request Home Visit'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <CTAFooter
        title="Not sure if you need"
        highlight="a home visit?"
        subtitle="Most consultations can happen in-clinic in under 30 minutes. Use home visit for elderly patients, post-surgery, or when travel is difficult."
        actions={[
          { label: 'Book In-Clinic', href: '/appointments/book', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Contact Us', href: '/contact' },
        ]}
      />
    </main>
  );
}

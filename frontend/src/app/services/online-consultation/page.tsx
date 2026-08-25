'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Video,
  Pill,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Sparkles,
  Heart,
  Lock,
} from 'lucide-react';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { IconTileList } from '@/components/ui/IconTileList';
import { FiCalendar, FiPhone } from 'react-icons/fi';

const SPECIALTIES = [
  { name: 'General Medicine',     icon: '🩺', desc: 'Fever, infections, fatigue, lifestyle advice.' },
  { name: 'Pediatrics',          icon: '👶', desc: 'Children 0–14, growth, nutrition, fevers.' },
  { name: 'Gynecology',          icon: '🤰', desc: 'Period, pregnancy, menopause, fertility.' },
  { name: 'Tuberculosis',        icon: '🫁', desc: 'Cough, chest symptoms, TB screening, ADSN, chest cleaning.' },
];

const PLANS = [
  {
    id: 'general',
    title: 'General Consultation',
    duration: '15 min',
    price: 800,
    badge: 'Most booked',
    desc: 'Talk to a general physician about a single health concern — fever, infection, fatigue, lifestyle, or a new symptom.',
    features: [
      'Video or audio call',
      '1 focused health concern',
      'Digital prescription if needed',
      'Free 5-min follow-up within 7 days',
    ],
  },
  {
    id: 'extended',
    title: 'Extended Consultation',
    duration: '30 min',
    price: 1500,
    badge: 'Best for chronic',
    desc: 'A longer session for chronic conditions, multiple symptoms, or to review reports and lab findings in detail.',
    features: [
      '30-min video call',
      'Multiple concerns + report review',
      'Detailed care plan emailed',
      'Free 10-min follow-up within 14 days',
    ],
  },
  {
    id: 'followup',
    title: 'Follow-up Visit',
    duration: '10 min',
    price: 500,
    badge: 'Returning patient',
    desc: 'Quick check-in after a recent in-clinic visit, lab review, or to renew an existing prescription.',
    features: [
      '10-min video or phone call',
      'Report or prescription review',
      'Same clinician as prior visit if available',
      'No follow-up cost within 14 days',
    ],
  },
];

const HOW = [
  { icon: <FiCalendar className="h-5 w-5" />, title: 'Book a slot', copy: 'Pick a specialty, a plan and a 30-min window that suits you.' },
  { icon: <Video className="h-5 w-5" />, title: 'We send a link', copy: 'You get a secure video link by SMS/email 5 minutes before the call.' },
  { icon: <Stethoscope className="h-5 w-5" />, title: 'Consult online', copy: 'Speak to a Nita Clinic doctor over video or audio — no app install needed.' },
  { icon: <FileText className="h-5 w-5" />, title: 'Get prescription', copy: 'Receive a digital prescription, e-referral and care plan by email.' },
];

export default function OnlineConsultationPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    specialty: 'General Medicine',
    plan: 'general',
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
      const planLabel =
        form.plan === 'general'
          ? 'General consultation (15 min)'
          : form.plan === 'extended'
            ? 'Extended consultation (30 min)'
            : 'Follow-up (10 min)';
      const message = [
        `Specialty: ${form.specialty}`,
        `Plan: ${planLabel}`,
        form.date ? `Preferred date: ${form.date}` : null,
        form.notes ? `Notes: ${form.notes}` : null,
      ]
        .filter(Boolean)
        .join('\n');
      await post('enquiries', {
        type: 'services',
        name: form.name,
        phone: form.phone,
        email: form.email,
        subject: `Online consultation booking — ${form.specialty} (${planLabel})`,
        message,
      });
      setSubmitted(true);
    } catch (err) {
      const { getErrorMessage } = await import('@/lib/api');
      alert(`Could not submit booking: ${getErrorMessage(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <PremiumLandingHero
        eyebrow="Online Consultation · Telemedicine"
        title="A Nita Clinic doctor,"
        highlight="in your pocket."
        description="Speak to a licensed doctor over secure video from home, office or on the go. Get a digital prescription, e-referral and care plan — no travel, no waiting room."
        videoSrc="/videos/hero/doctor-writing-appointment.mp4"
        posterSrc="/videos/hero/doctor-writing-appointment.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-teal-900/[0.42]"
        actions={[
          { label: 'Book a Video Call', href: '#book', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Call Us', href: 'tel:+977014533361', variant: 'secondary' },
        ]}
        trustPoints={[
          'NMC-registered doctors across 6 specialties',
          'Encrypted video — no app install required',
          'Digital prescription & e-referral included',
          'Available 7 days a week, 9 AM to 9 PM',
        ]}
        stats={[
          { value: 'NPR 500', label: 'From' },
          { value: '15 min', label: 'Avg visit' },
          { value: '7/7', label: 'Days' },
        ]}
        panelEyebrow="Online Consultation"
        panelTitle="Care that fits your day."
        panelItems={[
          'Pick a specialty, choose a plan and a time that works for you.',
          'A Nita Clinic doctor calls you on a secure video link — no app install.',
          'You get a digital prescription, e-referral for lab tests, and a care plan by email.',
        ]}
      />

      {/* Specialties */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Specialties available"
            title="What can we help"
            highlight="with today?"
            subtitle="Four specialties available online. All doctors are NMC-registered and licensed in Nepal."
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPECIALTIES.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-soft hover:-translate-y-0.5 transition"
              >
                <div className="text-3xl">{s.icon}</div>
                <h3 className="mt-3 font-heading text-base font-bold text-neutral-900">{s.name}</h3>
                <p className="mt-1.5 text-sm text-neutral-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing plans */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Pricing"
            title="Three plans, transparent"
            highlight="NPR pricing"
            subtitle="Pick the plan that fits the conversation you need today. No hidden fees."
            className="mb-10"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white p-7 shadow-soft"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sky-500 to-blue-600" />
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-700">
                  {p.badge}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-neutral-900">{p.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  <span className="font-semibold text-neutral-700">{p.duration}</span> session
                </p>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{p.desc}</p>
                <IconTileList
                  items={p.features}
                  category={`${p.title} online consultation features`}
                  accent="blue"
                  layout="list"
                  className="mt-5 gap-2"
                  itemClassName="rounded-2xl p-3"
                />
                <div className="mt-5 flex items-end justify-between border-t border-neutral-100 pt-4">
                  <p className="font-heading text-2xl font-extrabold text-neutral-900">NPR {p.price.toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, plan: p.id }))}
                    className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-sky-700"
                  >
                    Book <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="How it works"
            title="From booking to"
            highlight="prescription"
            subtitle="A clean four-step process — no app install, no waiting room."
            className="mb-10"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-soft"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  {s.icon}
                </span>
                <h3 className="mt-3 font-heading text-sm font-bold text-neutral-900">{s.title}</h3>
                <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-12 bg-gradient-to-r from-sky-50 via-white to-blue-50 border-y border-neutral-100">
        <div className="container-custom">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: <Lock className="h-5 w-5" />, title: 'Encrypted video', copy: 'End-to-end encrypted. We never store the call recording.' },
              { icon: <FileText className="h-5 w-5" />, title: 'Digital Rx', copy: 'Prescription and e-referral delivered to your email instantly.' },
              { icon: <Heart className="h-5 w-5" />, title: 'One record', copy: 'Online notes feed into your Nita Clinic health record automatically.' },
            ].map((p) => (
              <div key={p.title} className="flex flex-col items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white">
                  {p.icon}
                </span>
                <h3 className="text-sm font-bold text-neutral-900">{p.title}</h3>
                <p className="text-xs text-neutral-500 max-w-xs">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className="section-padding bg-neutral-50">
        <div className="container-custom max-w-3xl">
          <SectionHeader
            eyebrow="Book an Online Consultation"
            title="Schedule your"
            highlight="video call"
            subtitle="Pick a plan and a time — our coordinator will email you a secure video link."
            className="mb-8"
          />

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-sky-200 bg-sky-50/60 p-8 text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-bold text-sky-900">Booking received</h3>
              <p className="mt-2 text-sm text-sky-800/80">
                We will email <strong>{form.email || form.phone}</strong> a secure video link 5 minutes before your appointment.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', specialty: 'General Medicine', plan: 'general', date: '', notes: '' }); }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-sky-700"
              >
                Book another consultation
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
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white"
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
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Specialty</label>
                  <select
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white"
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Plan</label>
                  <select
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="general">General Consultation — NPR 800 (15 min)</option>
                    <option value="extended">Extended Consultation — NPR 1,500 (30 min)</option>
                    <option value="followup">Follow-up Visit — NPR 500 (10 min)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">Preferred date & time</label>
                <input
                  required
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5">What would you like to discuss? (optional)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Briefly describe your concern so the doctor can prepare."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Prefer to call? <a href="tel:+977014533361" className="font-semibold text-sky-700">01-4533361</a>
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-sky-700 disabled:opacity-60"
                >
                  {submitting ? 'Submitting…' : 'Request Video Consultation'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <CTAFooter
        title="Prefer to see a doctor"
        highlight="in person?"
        subtitle="Book an in-clinic appointment at Nita Clinic, Bhimsengola-09, Kathmandu."
        actions={[
          { label: 'Book In-Clinic', href: '/appointments/book', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Contact Us', href: '/contact' },
        ]}
      />
    </main>
  );
}

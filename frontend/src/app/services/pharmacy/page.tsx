'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Pill,
  Truck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  Award,
  Heart,
  Stethoscope,
  ArrowRight,
  PackageCheck,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { IconTileList } from '@/components/ui/IconTileList';
import { FiCalendar, FiPhone } from 'react-icons/fi';

const CHANNELS = [
  {
    icon: <Pill className="h-6 w-6" />,
    badge: 'IN CLINIC',
    title: 'Walk-in Pharmacy',
    tagline: 'Pick up at the clinic counter',
    price: 'Same-day',
    description:
      'Bring your prescription to the Nita Clinic counter in Bhimselgola-9. Our pharmacist dispenses, double-checks dosage and interactions, and explains the schedule on the spot.',
    features: [
      'Counter pickup during clinic hours',
      'Pharmacist medication review',
      'Digital copy of every prescription',
      'Cash, card & digital wallet accepted',
    ],
    cta: { label: 'Get directions', href: '/contact' },
    gradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    ring: 'ring-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: <Truck className="h-6 w-6" />,
    badge: 'HOME DELIVERY',
    title: 'Pharmacy Home Delivery',
    tagline: 'Medicines brought to your door',
    price: 'From NPR 100',
    description:
      'Stay home, get your medicines. Same-day delivery within Kathmandu Valley on orders placed before 2 pm, next-day for the rest. Cold-chain items handled in insulated bags.',
    features: [
      'Same-day delivery in Kathmandu Valley',
      'Cold-chain handling for insulin & vaccines',
      'Pharmacist call-back on dosage questions',
      'Refill reminders by SMS or WhatsApp',
    ],
    cta: { label: 'Order via WhatsApp', href: 'https://wa.me/9779800000000' },
    gradient: 'from-amber-500 via-orange-500 to-rose-600',
    ring: 'ring-amber-200',
    iconBg: 'bg-amber-50 text-amber-600',
  },
];

const STOCK = [
  { icon: <Pill className="h-5 w-5" />, title: 'Prescription medicines', copy: 'All chronic, acute and specialty formulations from licensed manufacturers.' },
  { icon: <Heart className="h-5 w-5" />, title: 'Cardio & diabetes range', copy: 'Ongoing care packs for hypertension, diabetes, cholesterol, thyroid and more.' },
  { icon: <ShieldCheck className="h-5 w-5" />, title: 'Cold-chain products', copy: 'Insulin, vaccines and biologics stored at 2–8°C with monitored fridges.' },
  { icon: <Stethoscope className="h-5 w-5" />, title: 'Doctor-recommended OTC', copy: 'Vitamins, supplements, ORS, first-aid and women & child health essentials.' },
];

const PROMISE = [
  { icon: <Receipt className="h-5 w-5" />, title: 'Transparent billing', copy: 'GST invoice and printed schedule for every order — insurance-ready when applicable.' },
  { icon: <PackageCheck className="h-5 w-5" />, title: 'Original brands only', copy: 'Sourced from authorised distributors with batch, expiry and cold-chain logs.' },
  { icon: <RotateCcw className="h-5 w-5" />, title: 'Easy returns', copy: 'Unopened, unexpired medicines can be returned within 7 days of delivery.' },
  { icon: <Award className="h-5 w-5" />, title: 'Pharmacist on call', copy: 'Speak to a licensed pharmacist about dosage, side-effects and interactions, free.' },
];

const FAQS = [
  {
    q: 'Do I need a prescription?',
    a: 'Yes for all prescription-only medicines — bring a valid prescription from any NMC-registered doctor. OTC items, vitamins and first-aid do not need a prescription.',
  },
  {
    q: 'How fast is home delivery?',
    a: 'Orders received before 2 pm are delivered the same day within Kathmandu Valley. Orders after 2 pm and Lalitpur/Bhaktapur are delivered next day.',
  },
  {
    q: 'Do you handle cold-chain medicines?',
    a: 'Yes. Insulin, vaccines and biologics are stored in monitored 2–8°C fridges and transported in insulated cold-chain bags. We log temperature at every step.',
  },
  {
    q: 'Can I refill a chronic prescription?',
    a: 'Yes — share your previous prescription on WhatsApp or walk in. The pharmacist will set up a refill reminder so you never miss a dose.',
  },
  {
    q: 'Do you accept insurance?',
    a: 'We issue GST invoices and itemised bills that you can submit to your insurer. Cashless claims are supported for partner insurance providers — ask the counter for the latest list.',
  },
];

export default function PharmacyPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    prescription: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    // Simulate submission — real integration can be wired to /api/v1/enquiries
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <main>
      <PremiumLandingHero
        eyebrow="Pharmacy · Nita Clinic"
        title="The pharmacy that"
        highlight="comes to you."
        description="Pick up your medicines at the clinic counter or get them delivered to your home. Pharmacist-reviewed, cold-chain safe, and priced transparently — so the only thing you worry about is getting better."
        videoSrc="/videos/hero/lab-microscope.mp4"
        posterSrc="/videos/hero/lab-microscope.jpg"
        overlayClassName="from-emerald-950/[0.88] via-teal-900/[0.66] to-amber-900/[0.42]"
        actions={[
          { label: 'Order via WhatsApp', href: 'https://wa.me/9779800000000', icon: <Phone className="h-4 w-4" /> },
          { label: 'Visit the counter', href: '/contact', variant: 'secondary', icon: <MapPin className="h-4 w-4" /> },
        ]}
        trustPoints={[
          'NMC-licensed pharmacist on duty',
          'Original brands from authorised distributors',
          'Same-day delivery in Kathmandu Valley',
          'Cold-chain handling for insulin & vaccines',
        ]}
        stats={[
          { value: '2', label: 'Ways to get medicines' },
          { value: 'Same', label: 'Day Delivery' },
          { value: 'Free', label: 'Pharmacist Call-back' },
        ]}
        panelEyebrow="Pharmacy"
        panelTitle="Dispense, deliver, advise."
        panelItems={[
          'Walk in with a prescription — pharmacist dispenses and reviews dosage on the spot.',
          'Stay home — order on WhatsApp and get same-day delivery in Kathmandu Valley.',
          'Need advice? Free call-back from a licensed pharmacist, any day of the week.',
        ]}
      />

      {/* Two channels: walk-in + home delivery */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-emerald-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-5rem] h-64 w-80 rounded-full bg-amber-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Two ways to get your medicines"
            title="Pick up, or"
            highlight="let us deliver."
            subtitle="Both channels use the same Nita Clinic pharmacy, the same pharmacist, the same batch tracking — and the same transparent NRP pricing."
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 gap-6">
            {CHANNELS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div
                  className={`group relative h-full overflow-hidden rounded-3xl border border-neutral-100 bg-white p-7 shadow-soft ring-1 ${c.ring}`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${c.gradient}`} />
                  <span className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-neutral-900/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                    {c.badge}
                  </span>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.iconBg}`}>
                    {c.icon}
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-neutral-900">{c.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary-700">{c.tagline}</p>
                  <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{c.description}</p>

                  <IconTileList
                    items={c.features}
                    category={`${c.title} pharmacy service features`}
                    accent="teal"
                    layout="list"
                    className="mt-5 gap-2"
                    itemClassName="rounded-2xl p-3"
                  />

                  <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                    <span className="text-xs font-semibold text-neutral-500">{c.price}</span>
                    <Link
                      href={c.cta.href}
                      className="ml-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 transition-all hover:gap-3"
                    >
                      {c.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stock categories */}
      <section className="py-14 bg-white border-y border-neutral-100">
        <div className="container-custom">
          <SectionHeader
            eyebrow="What we stock"
            title="From common cold"
            highlight="to chronic care."
            subtitle="A focused range of prescription and OTC medicines that covers 90% of what most families need. Anything outside the range — we can special-order within 24 hours."
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STOCK.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-3"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  {s.icon}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">{s.title}</h3>
                  <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{s.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise strip */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-30" />
        </div>
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Why our pharmacy"
            title="Safe, traceable,"
            highlight="and yours when you need it."
            subtitle="Every order carries a batch number, expiry, and pharmacist sign-off. Every delivery has a real human on the other end if you need to ask anything."
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROMISE.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-soft"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  {p.icon}
                </span>
                <h3 className="mt-3 text-sm font-bold text-neutral-900">{p.title}</h3>
                <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{p.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery request form */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-700">
                <Sparkles className="h-3.5 w-3.5" /> Home delivery request
              </span>
              <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
                Send us your prescription.
                <br />
                <span className="text-primary-700">We'll deliver today.</span>
              </h2>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                Drop your prescription details below and a pharmacist will call you back within 30 minutes
                to confirm the order and delivery slot. Same-day delivery in Kathmandu Valley.
              </p>
              <IconTileList
                items={[
                  'Kathmandu Valley: same-day if ordered before 2 pm',
                  'Lalitpur / Bhaktapur: next-day',
                  'Cold-chain items handled with insulated bags',
                  'Free pharmacist call-back before dispatch',
                ]}
                category="pharmacy delivery information"
                accent="teal"
                layout="list"
                className="mt-6 gap-2"
                itemClassName="rounded-2xl p-3"
              />
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-neutral-100 bg-neutral-50 p-6 sm:p-8 shadow-soft"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h3 className="font-heading text-xl font-bold text-neutral-900">Request received</h3>
                  <p className="text-sm text-neutral-600 max-w-sm">
                    A pharmacist will call you within 30 minutes to confirm your order and delivery slot.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Your name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange('name')}
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="e.g. Sita Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange('phone')}
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Delivery address
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={handleChange('address')}
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="Street, area, city"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Prescription / medicines needed
                    </label>
                    <textarea
                      rows={3}
                      value={form.prescription}
                      onChange={handleChange('prescription')}
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="List the medicines your doctor prescribed, or share details about what you need."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                      Notes (optional)
                    </label>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={handleChange('notes')}
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      placeholder="Allergies, preferred time, anything else we should know."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-60"
                  >
                    {submitting ? 'Sending…' : 'Request delivery callback'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="text-[11px] text-neutral-500 text-center">
                    By submitting, you agree to be contacted by a Nita Clinic pharmacist.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white border-t border-neutral-100">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Pharmacy FAQ"
            title="Things"
            highlight="patients ask us."
            className="mb-10"
          />
          <div className="mx-auto max-w-3xl divide-y divide-neutral-100 rounded-3xl border border-neutral-100 bg-neutral-50">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <button
                  type="button"
                  key={f.q}
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 transition-colors hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm sm:text-base font-semibold text-neutral-900">{f.q}</h3>
                    <span
                      className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-transform ${
                        open ? 'rotate-45' : ''
                      }`}
                    >
                      +
                    </span>
                  </div>
                  {open && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 text-sm text-neutral-600 leading-relaxed"
                    >
                      {f.a}
                    </motion.p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTAFooter
        title="Need a medicine"
        highlight="right now?"
        subtitle="Call our pharmacy desk for urgent requests, refills, or a pharmacist consultation. We're open during clinic hours, 7 days a week."
        actions={[
          { label: 'Call the pharmacy', href: 'tel:+9779800000000', icon: <FiPhone className="h-4 w-4" /> },
          { label: 'Book a check-up', href: '/appointments/book', icon: <FiCalendar className="h-4 w-4" /> },
        ]}
      />
    </main>
  );
}

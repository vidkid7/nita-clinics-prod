'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Lock, Phone, Mail, IdCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { FiPhone, FiMail } from 'react-icons/fi';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { FiCalendar } from 'react-icons/fi';

export default function LabReportsPage() {
  const [patientId, setPatientId] = useState('');
  const [email, setEmail] = useState('');

  return (
    <main>
      <PremiumLandingHero
        eyebrow="Lab Reports · Secure Access"
        title="Access your lab"
        highlight="reports online."
        description="Sign in to your patient portal to view, download, and share your lab reports — securely stored and accessible 24/7."
        videoSrc="/videos/hero/doctor-writing-appointment.mp4"
        posterSrc="/videos/hero/doctor-writing-appointment.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-teal-900/[0.42]"
        actions={[
          { label: 'Sign In to Portal', href: '/login', icon: <Lock className="h-4 w-4" /> },
          { label: 'Call Lab Desk', href: 'tel:+977014533361', icon: <FiPhone className="h-4 w-4" />, variant: 'secondary' },
        ]}
        trustPoints={[
          'Reports stored securely for 5+ years',
          'Download as PDF anytime',
          'Share with your doctor in one click',
          'SMS notification when ready',
        ]}
        stats={[
          { label: 'Reports Available', value: 'Same-day' },
          { label: 'Storage', value: '5+ Years' },
          { label: 'Access', value: '24 / 7' },
        ]}
        panelEyebrow="Quick Look-Up"
        panelTitle="Forgot your patient ID?"
        panelItems={[
          'Call our lab desk with your registered phone number.',
          'We will text you your patient ID and a one-time login link.',
          'Walk-in to our Bhimselgola-9 clinic for in-person report collection.',
        ]}
      />

      {/* ── Look-up form ── */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <SectionHeader
            eyebrow="Quick Report Look-Up"
            title="Find your"
            highlight="report"
            subtitle="Enter your registered email or patient ID below. We will send a secure link to your reports."
          />

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = '/login?from=lab-reports';
            }}
            className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-primary-50/40 via-white to-teal-50/40 p-6 sm:p-8 shadow-[0_18px_50px_-22px_rgba(1,173,165,0.35)]"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="patientId"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5"
                >
                  Patient ID
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    id="patientId"
                    type="text"
                    placeholder="e.g. NIT-10293"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5"
                >
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 text-white text-sm font-semibold py-3 hover:bg-primary-700 transition-colors shadow-md"
              >
                <Sparkles className="h-4 w-4" /> Send me my reports
              </button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 px-5 py-3 hover:bg-neutral-50"
              >
                Sign In Instead
              </Link>
            </div>
            <p className="mt-3 text-[11px] text-neutral-500 text-center">
              Reports are delivered as password-protected PDFs. Your patient ID can be found on
              your invoice or test receipt.
            </p>
          </motion.form>
        </div>
      </section>

      {/* ── What you can do ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-4xl">
          <SectionHeader
            eyebrow="In Your Portal"
            title="What you can do"
            subtitle="Once you're signed in, the patient portal unlocks the following."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: FileText,
                title: 'View & Download Reports',
                desc: 'All past and recent lab reports in one place, as PDF.',
              },
              {
                icon: CheckCircle2,
                title: 'Track Test Status',
                desc: 'See real-time status: sample collected → processing → ready.',
              },
              {
                icon: Mail,
                title: 'Email Forwarding',
                desc: 'Send your report directly to any doctor or specialist.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-neutral-200 bg-white p-5"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <item.icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 font-heading font-bold text-neutral-900">{item.title}</h3>
                <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact for help ── */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white flex-shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-neutral-900">Need help finding your report?</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Our lab desk can look up your report by phone or email. Walk-in collection is
                also available at our Bhimselgola-9 clinic.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="tel:+977014533361"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 hover:bg-primary-700"
              >
                <FiPhone className="h-4 w-4" /> +977 01-4533361
              </a>
              <a
                href="mailto:lab@nitaclinics.com"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-200 text-primary-700 text-sm font-semibold px-5 py-2.5 hover:bg-primary-50"
              >
                <FiMail className="h-4 w-4" /> Email Lab
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTAFooter
        title="Ready to book"
        highlight="a new test?"
        subtitle="Walk in to our Bhimselgola-9 clinic or book a home collection — most reports are ready the same day."
        actions={[
          { label: 'Book a Test', href: '/services/laboratory', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Call Now', href: 'tel:+977014533361' },
        ]}
      />
    </main>
  );
}

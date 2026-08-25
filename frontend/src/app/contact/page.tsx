'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiMessageCircle } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import toast from 'react-hot-toast';
import { post, getErrorMessage } from '@/lib/api';
import { BRAND } from '@/lib/brand';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  type: z.string().min(1, 'Please select an enquiry type'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const enquiryTypes = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'appointment', label: 'Appointment Related' },
  { value: 'services', label: 'Service Enquiry' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'complaint', label: 'Complaint' },
];

const contactInfo = [
  {
    icon: FiMapPin,
    title: 'Visit Us',
    lines: [BRAND.name, BRAND.address],
    tile: 'bg-primary-50 text-primary-600',
    bar: 'from-primary-400 to-primary-600',
    trace: 'rgba(1,173,165,0.5)',
    glow: 'rgba(1,173,165,0.3)',
    dot: 'bg-primary-500',
  },
  {
    icon: FiPhone,
    title: 'Call Us',
    lines: [BRAND.landline, BRAND.phone],
    tile: 'bg-emerald-50 text-emerald-600',
    bar: 'from-emerald-400 to-emerald-600',
    trace: 'rgba(16,185,129,0.5)',
    glow: 'rgba(16,185,129,0.3)',
    dot: 'bg-emerald-500',
  },
  {
    icon: FiMail,
    title: 'Email Us',
    lines: [BRAND.email],
    tile: 'bg-amber-50 text-amber-600',
    bar: 'from-amber-400 to-amber-600',
    trace: 'rgba(245,158,11,0.5)',
    glow: 'rgba(245,158,11,0.3)',
    dot: 'bg-amber-500',
  },
  {
    icon: FiClock,
    title: 'Working Hours',
    lines: [BRAND.hours.weekdays, BRAND.hours.saturday],
    tile: 'bg-rose-50 text-rose-600',
    bar: 'from-rose-400 to-rose-600',
    trace: 'rgba(244,63,94,0.5)',
    glow: 'rgba(244,63,94,0.3)',
    dot: 'bg-rose-500',
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Submit enquiry to backend API
      await post('enquiries', {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        type: data.type,
        subject: data.subject,
        message: data.message,
      });
      
      toast.success('Your message has been sent successfully! We will get back to you soon.');
      reset();
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      toast.error(getErrorMessage(error) || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PremiumLandingHero
        eyebrow="Contact NITA Clinic"
        title="Questions, bookings,"
        highlight="and clinic support."
        description="Call, email, visit, or send a message. Our team can help with appointments, lab tests, health cards, vaccination, and general enquiries."
        videoSrc="/videos/hero/doctor-writing-appointment.mp4"
        posterSrc="/videos/hero/doctor-writing-appointment.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.64] to-teal-900/[0.42]"
        actions={[
          { label: 'Send Message', href: '#contact-form', icon: <FiSend className="h-4 w-4" /> },
          { label: 'Call Clinic', href: `tel:${BRAND.landline.replace(/[^0-9+]/g, '')}`, icon: <FiPhone className="h-4 w-4" />, variant: 'secondary' },
        ]}
        trustPoints={[
          'Appointment and service enquiries',
          'Clinic location and visiting hours',
          'Phone, email, and message support',
          'Helpful routing to the right team',
        ]}
        stats={[
          { value: BRAND.hours.weekdays.split(' ')[0] || 'Open', label: 'Weekdays' },
          { value: BRAND.landline, label: 'Clinic Line' },
          { value: '24-48h', label: 'Message Reply' },
        ]}
        panelEyebrow="Contact Flow"
        panelTitle="Reach the clinic in the way that suits you."
        panelItems={[
          'Use the form for detailed questions and service enquiries.',
          'Call for urgent booking help or same-day availability.',
          'Visit the clinic details for address, hours, and direct contact information.',
        ]}
      />

      {/* Contact Section */}
      <section id="contact-form" className="section-padding relative overflow-hidden bg-white scroll-mt-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-80 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-5rem] h-72 w-96 rounded-full bg-emerald-50/70 blur-3xl" />
        </div>

        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Get in Touch"
            title="We are here"
            highlight="to help you"
            subtitle="Call, email, visit, or send a message. Our team responds to appointment, lab, health card, vaccination, and general enquiries."
            className="mb-12 md:mb-14"
          />

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-[0_20px_44px_-16px_var(--glow)]"
                  style={{ '--glow': info.glow } as React.CSSProperties}
                >
                  <span className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${info.bar} opacity-50 transition-opacity duration-300 group-hover:opacity-100`} />
                  <span className="absolute right-4 top-3 text-[11px] font-black tracking-wider text-neutral-200 transition-colors group-hover:text-neutral-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${info.tile} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-neutral-900 mb-1 transition-colors group-hover:text-primary-700">{info.title}</h3>
                      {info.lines.map((line, i) => (
                        <p key={i} className="text-sm text-neutral-600">{line}</p>
                      ))}
                    </div>
                  </div>
                  <span className={`absolute bottom-3 right-4 h-1.5 w-1.5 rounded-full ${info.dot} opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:scale-[2.2]`} />
                  <svg className="absolute inset-x-4 bottom-1 h-2.5 w-[calc(100%-2rem)] opacity-25" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 7 H60 L68 2 L76 9 L82 4 L88 7 H200" fill="none" stroke={info.trace} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40 10" className="animate-ecg-flow" />
                  </svg>
                </motion.div>
              ))}

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group relative mt-6 overflow-hidden rounded-2xl border border-neutral-200/70 shadow-soft"
              >
                <span className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500" />
                <div className="aspect-video bg-neutral-100">
                  <iframe
                    src={BRAND.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative lg:col-span-2 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white p-6 md:p-10 shadow-[0_24px_60px_-30px_rgba(0,42,40,0.25)]"
            >
              {/* form card accents */}
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-teal-400 to-emerald-400" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-50 blur-2xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-emerald-50/60 blur-2xl" aria-hidden="true" />
              <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 plus-pattern-light opacity-30" aria-hidden="true" />

              <div className="relative mb-8 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <FiMessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-neutral-900 leading-tight">
                    Send us a Message
                  </h2>
                  <p className="text-sm text-neutral-500">We usually reply within 24–48 hours.</p>
                </div>
                <span className="ml-auto hidden text-[11px] font-black tracking-wider text-neutral-300 sm:block">FORM · 01</span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Your Name"
                    placeholder="Ram Sharma"
                    error={errors.name?.message}
                    {...register('name')}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="ram@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Phone Number"
                    placeholder="+977 98XXXXXXXX"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <Select
                    label="Enquiry Type"
                    options={enquiryTypes}
                    placeholder="Select type"
                    error={errors.type?.message}
                    {...register('type')}
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  placeholder="How can we help you?"
                  error={errors.subject?.message}
                  {...register('subject')}
                  required
                />

                <Textarea
                  label="Message"
                  placeholder="Write your message here..."
                  rows={5}
                  error={errors.message?.message}
                  {...register('message')}
                  required
                />

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full md:w-auto shadow-[0_10px_24px_-10px_rgba(1,173,165,0.6)] hover:shadow-[0_14px_30px_-10px_rgba(1,173,165,0.85)]"
                  >
                    <FiSend className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Secure &amp; confidential — your details are never shared.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <CTAFooter
        tone="dark"
        title="Need Immediate Assistance?"
        highlight="call or message us directly"
        subtitle="For appointments and urgent clinical queries, our front desk is ready to help."
        actions={[
          { label: BRAND.phone, href: `tel:${BRAND.phone.replace(/[^0-9+]/g, '')}` },
          { label: 'WhatsApp Us', href: `https://wa.me/${BRAND.whatsapp}`, external: true },
        ]}
        phone={BRAND.phone}
      />
    </>
  );
}

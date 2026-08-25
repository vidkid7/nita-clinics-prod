'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Microscope, HeartPulse, ClipboardList, Briefcase } from 'lucide-react';
import { get } from '@/lib/api';
import { FALLBACK_DOCTORS } from '@/lib/static-content-fallback';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { DoctorDetailModal, type DoctorDetailData } from '@/components/specialists/DoctorDetailModal';

/* ── Types ── */
interface TeamMember {
  id: string;
  name: string;
  specialization: string;
  qualification?: string;
  bio?: string;
  photo?: string;
  experience?: number;
  phone?: string;
  staffType?: string;
  isTopRated?: boolean;
  availableDays?: string;
  images?: string[];
  highlights?: string[];
}

// The production API currently contains clinicians only. Keep the existing
// support-team records available until those staff rows are added in Admin.
const FALLBACK_SUPPORT_MEMBERS: TeamMember[] = FALLBACK_DOCTORS
  .filter((member) => member.staffType !== 'doctor')
  .map((member) => ({
    id: member.id,
    name: member.name,
    specialization: member.specialization,
    qualification: member.qualification,
    bio: member.bio || undefined,
    experience: member.experience,
    phone: member.phone,
    staffType: member.staffType,
    images: [],
  }));

type TeamCategory = 'accountant' | 'sales' | 'nursing' | 'clinic_manager' | 'receptionist' | 'laboratory';

const ROLE_DETAILS: Record<TeamCategory, { specialization: string; bio: string }> = {
  accountant: {
    specialization: 'Accounts & billing',
    bio: 'Supports clear billing, payment records, and account coordination for patients and the clinic.',
  },
  sales: {
    specialization: 'Patient services & outreach',
    bio: 'Helps patients understand available services, packages, and the next step in their care journey.',
  },
  nursing: {
    specialization: 'Nursing & patient care',
    bio: 'Provides compassionate nursing support, patient preparation, and follow-up coordination.',
  },
  clinic_manager: {
    specialization: 'Clinic operations',
    bio: 'Coordinates daily clinic operations so patients, clinicians, and support teams stay connected.',
  },
  receptionist: {
    specialization: 'Reception & patient coordination',
    bio: 'Guides patients through appointments, registration, records, and front-desk enquiries.',
  },
  laboratory: {
    specialization: 'Laboratory services',
    bio: 'Supports sample processing and laboratory operations behind accurate, timely reports.',
  },
};

function resolveTeamCategory(member: TeamMember): TeamCategory | null {
  if (member.staffType === 'doctor') return null;
  const text = `${member.staffType || ''} ${member.specialization || ''} ${member.bio || ''}`.toLowerCase();
  if (text.includes('account') || text.includes('billing') || text.includes('finance')) return 'accountant';
  if (text.includes('sales') || text.includes('marketing') || text.includes('outreach')) return 'sales';
  if (text.includes('manager') || text.includes('clinic operation')) return 'clinic_manager';
  if (member.staffType === 'nurse' || text.includes('nursing')) return 'nursing';
  if (member.staffType === 'technician' || text.includes('laboratory') || text.includes('lab')) return 'laboratory';
  return 'receptionist';
}

const DEPT_GROUPS: Array<{
  label: string;
  category: TeamCategory;
  icon: typeof Calculator;
  tile: string;
  bar: string;
  trace: string;
  glow: string;
  eyebrow: string;
  subtitle: string;
}> = [
  {
    label: 'Accountant',
    category: 'accountant',
    icon: Calculator,
    tile: 'bg-primary-50 text-primary-600',
    bar: 'from-primary-400 to-primary-600',
    trace: 'rgba(1,173,165,0.5)',
    glow: 'rgba(1,173,165,0.3)',
    eyebrow: 'Finance Support',
    subtitle: 'Clear billing and account coordination for every patient visit.',
  },
  {
    label: 'Sales',
    category: 'sales',
    icon: ClipboardList,
    tile: 'bg-emerald-50 text-emerald-600',
    bar: 'from-emerald-400 to-emerald-600',
    trace: 'rgba(16,185,129,0.5)',
    glow: 'rgba(16,185,129,0.3)',
    eyebrow: 'Patient Services',
    subtitle: 'Helpful guidance for services, packages, and care pathways.',
  },
  {
    label: 'Nursing',
    category: 'nursing',
    icon: HeartPulse,
    tile: 'bg-rose-50 text-rose-600',
    bar: 'from-rose-400 to-rose-600',
    trace: 'rgba(244,63,94,0.5)',
    glow: 'rgba(244,63,94,0.3)',
    eyebrow: 'Care Team',
    subtitle: 'Compassionate nursing support for patient comfort and follow-up.',
  },
  {
    label: 'Clinic Manager',
    category: 'clinic_manager',
    icon: Briefcase,
    tile: 'bg-amber-50 text-amber-600',
    bar: 'from-amber-400 to-amber-600',
    trace: 'rgba(245,158,11,0.5)',
    glow: 'rgba(245,158,11,0.3)',
    eyebrow: 'Operations Team',
    subtitle: 'Daily coordination that keeps the clinic organized and welcoming.',
  },
  {
    label: 'Receptionist',
    category: 'receptionist',
    icon: ClipboardList,
    tile: 'bg-amber-50 text-amber-600',
    bar: 'from-amber-400 to-amber-600',
    trace: 'rgba(245,158,11,0.5)',
    glow: 'rgba(245,158,11,0.3)',
    eyebrow: 'Front Desk',
    subtitle: 'Friendly support for appointments, records, and visit details.',
  },
  {
    label: 'Laboratory',
    category: 'laboratory',
    icon: Microscope,
    tile: 'bg-emerald-50 text-emerald-600',
    bar: 'from-emerald-400 to-emerald-600',
    trace: 'rgba(16,185,129,0.5)',
    glow: 'rgba(16,185,129,0.3)',
    eyebrow: 'Laboratory Team',
    subtitle: 'Technical support behind sample processing and timely reports.',
  },
];

export default function TeamPage() {
  const [apiMembers, setApiMembers] = useState<TeamMember[]>([]);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetailData | null>(null);

  useEffect(() => {
    // Backend PaginationDto caps limit at 100 — higher values return 400 and an empty UI.
    get<{ data: Record<string, unknown>[] }>('doctors', { params: { page: 1, limit: 100 } })
      .then((res) => {
        const rows = res.data || [];
        const mappedMembers = rows.map((d) => {
          const staffType = String(d.staffType ?? (d as { staff_type?: string }).staff_type ?? '');
          const rawSpecialization = d.specialization != null ? String(d.specialization) : '';
          const draft: TeamMember = {
            id: String(d.id),
            name: String(d.name || ''),
            specialization: rawSpecialization,
            qualification: d.qualification != null ? String(d.qualification) : undefined,
            bio: d.bio != null ? String(d.bio) : undefined,
            photo: d.photo != null ? String(d.photo) : undefined,
            experience: d.experience != null ? Number(d.experience) : undefined,
            phone: d.phone != null ? String(d.phone) : undefined,
            staffType,
            images: [],
          };
          const category = resolveTeamCategory(draft);
          const role = category ? ROLE_DETAILS[category] : undefined;
          return {
            ...draft,
            specialization: rawSpecialization || role?.specialization || 'Clinic support',
            bio: draft.bio || role?.bio,
            highlights: [role?.specialization, draft.qualification].filter(Boolean) as string[],
          };
        });
        setApiMembers([
          ...mappedMembers,
          ...FALLBACK_SUPPORT_MEMBERS.filter(
            (fallback) => !mappedMembers.some((member) => member.name === fallback.name),
          ),
        ]);
      })
      .catch(() => setApiMembers(FALLBACK_SUPPORT_MEMBERS))
      .finally(() => setApiLoaded(true));
  }, []);

  // Doctors are intentionally kept on /doctors and /specialists only.
  const allMembers = apiMembers.filter((member) => resolveTeamCategory(member) !== null);
  const activeCategoryCount = new Set(allMembers.map(resolveTeamCategory)).size;

  function openModal(member: TeamMember) {
    setSelectedDoctor({
      name: member.name,
      specialization: member.specialization,
      qualification: member.qualification || 'Professional',
      experience: member.experience,
      rating: 4.8,
      availableDays: member.availableDays,
      bio: member.bio,
      phone: member.phone || '+977 01-4533361',
      isTopRated: member.isTopRated || false,
      isDoctor: false,
      images: [],
      bookingHref: `/appointments/book?doctor=${encodeURIComponent(member.name)}&specialty=${encodeURIComponent(member.specialization)}`,
      highlights: member.highlights || [member.specialization, member.qualification || ''].filter(Boolean),
    });
  }

  return (
    <>
      <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      <main>
        <PremiumLandingHero
          eyebrow="Our People · Clinical & Support Teams"
          title="A coordinated team"
          highlight="around every patient."
          description="Nursing, laboratory, and operations teams working together to make care feel clear, timely, and respectful."
          videoSrc="/videos/hero/doctor-tablet-consult.mp4"
          posterSrc="/videos/hero/doctor-tablet-consult.jpg"
          overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-primary-700/[0.42]"
          actions={[
            { label: 'Book Appointment', href: '/appointments/book' },
            { label: 'Meet Doctors', href: '/doctors', variant: 'secondary' },
          ]}
          trustPoints={[
            'Organized clinic operations',
            'Lab and technical support',
            'Nursing and patient coordination',
            'Front-desk guidance for smoother visits',
          ]}
          stats={[
            { value: apiLoaded ? String(activeCategoryCount) : '…', label: 'Active Categories' },
            { value: apiLoaded ? String(allMembers.length) : '…', label: 'Support Staff' },
            { value: apiLoaded ? String(allMembers.length) : '…', label: 'Team Members' },
          ]}
          panelEyebrow="Team Workflow"
          panelTitle="Care works better when the team is connected."
          panelItems={[
            'Front desk support helps patients choose the right visit type.',
            'Clinical teams coordinate consultation, lab tests, and next steps.',
            'Support staff keep the visit organized from arrival through follow-up.',
          ]}
        />

        {/* ── Team sections ── */}
        {DEPT_GROUPS.map((grp, gi) => {
          const members = allMembers.filter((member) => resolveTeamCategory(member) === grp.category);
          return (
            <section
              key={grp.label}
              className={`section-padding relative overflow-hidden ${gi % 2 === 0 ? 'bg-neutral-50' : 'bg-white'}`}
            >
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 plus-pattern-light opacity-40" />
                <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
                <div className="absolute bottom-0 right-[-5rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
              </div>

              <div className="relative container-custom">
                <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${grp.tile} shadow-lg`}
                    >
                      <grp.icon className="h-6 w-6" />
                    </motion.span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-600">
                        {grp.eyebrow} · {String(gi + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
                        {grp.label}
                      </h2>
                      <p className="mt-1 text-sm text-neutral-500">{grp.subtitle}</p>
                    </div>
                  </div>
                  {/* live pulse */}
                  <div className="hidden items-center gap-2 rounded-full border border-neutral-200/70 bg-white px-3.5 py-1.5 md:flex">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-xs font-semibold text-neutral-600">
                      {members.length} {members.length === 1 ? 'member' : 'members'} active
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {members.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 p-6 text-sm text-neutral-500">
                      Profiles for this category will be added soon.
                    </div>
                  ) : members.map((member, mi) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: mi * 0.07 }}
                    >
                      <DoctorCard
                        images={[]}
                        name={member.name}
                        specialization={member.specialization}
                        qualification={member.qualification || 'Professional'}
                        experience={member.experience}
                        rating={4.8}
                        availableDays={member.availableDays}
                        bio={member.bio}
                        phone={member.phone}
                        isDoctor={false}
                        isTopRated={member.isTopRated}
                        bookingHref={`/appointments/book?doctor=${encodeURIComponent(member.name)}`}
                        onViewProfile={() => openModal(member)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* CTA */}
      <CTAFooter
        title="Meet the people"
        highlight="who keep you healthy."
        subtitle="Our nurses, lab technicians, and operations teams work together to give you complete, connected care."
      />
    </>
  );
}

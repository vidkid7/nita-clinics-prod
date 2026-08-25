'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiPhone } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { DoctorCard } from '@/components/ui/DoctorCard';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { DoctorDetailModal, type DoctorDetailData } from '@/components/specialists/DoctorDetailModal';
import { get, PaginatedResponse } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { FALLBACK_DOCTORS } from '@/lib/static-content-fallback';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  bio: string;
  photo?: string;
  isActive: boolean;
  email: string;
  phone: string;
  availableDays?: string;
}

function fallbackToLocalDoctors(): Doctor[] {
  return FALLBACK_DOCTORS.map((d) => ({
    id: d.id,
    name: d.name,
    specialization: d.specialization,
    qualification: d.qualification,
    experience: d.experience,
    bio: d.bio || '',
    photo: d.photo || undefined,
    isActive: d.isActive,
    email: d.email,
    phone: d.phone,
  }));
}

const specializations = [
  'All',
  'General Medicine',
  'Gynecology and Obstetrics',
  'Pediatrician',
  'Tuberculosis (TB)',
  'Internal Medicine',
  'Preventive Care',
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetailData | null>(null);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      // Always seed with the static fallback so the page is never empty
      // while the Render backend is being provisioned.
      setDoctors(fallbackToLocalDoctors());
      try {
        setLoading(true);
        const response = await get<PaginatedResponse<Doctor>>('doctors', {
          params: {
            page: 1,
            limit: 100,
            sortBy: 'name',
            sortOrder: 'asc'
          },
        });
        if (response.data && response.data.length > 0) {
          setDoctors(response.data);
        }
      } catch (error) {
        console.warn('Failed to load doctors from API, using fallback', error);
        // Keep fallback
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === 'All' ||
      doctor.specialization.trim().toLowerCase() === selectedSpecialization.trim().toLowerCase();
    return matchesSearch && matchesSpecialization;
  });

  return (
    <>
      <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
    <main>
      <PremiumLandingHero
        eyebrow="Doctor Directory · NITA Clinic"
        title="Meet the clinicians"
        highlight="behind your care."
        description="Search doctors by name or specialty, compare experience and qualification, then book the right appointment with confidence."
        videoSrc="/videos/hero/doctor-writing-appointment.mp4"
        posterSrc="/videos/hero/doctor-writing-appointment.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.64] to-primary-700/[0.42]"
        actions={[
          { label: 'Book Appointment', href: '/appointments/book', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Call Clinic', href: 'tel:+977014533361', icon: <FiPhone className="h-4 w-4" />, variant: 'secondary' },
        ]}
        trustPoints={[
          'Searchable doctor directory',
          'Specialty and qualification details',
          'Direct booking from doctor cards',
          'Clinical teams connected to on-site lab',
        ]}
        stats={[
          { value: loading ? '…' : String(doctors.length), label: 'Doctors Listed' },
          { value: '7', label: 'Care Areas' },
          { value: 'Mon-Fri', label: 'Clinic Availability' },
        ]}
        panelEyebrow="Doctor Matching"
        panelTitle="A calmer way to choose your appointment."
        panelItems={[
          'Filter by specialty first, then scan doctor experience and availability.',
          'Use direct call and booking actions when you are ready.',
          'Keep care connected with check-ups, lab tests, and follow-up support.',
        ]}
      />

      {/* Filters */}
      <section className="sticky top-20 z-30 border-b border-neutral-200/60 bg-white/85 py-6 backdrop-blur-xl">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <Input
                placeholder="Search experts..."
                leftIcon={<FiSearch className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedSpecialization === spec
                      ? 'bg-primary-600 text-white shadow-[0_8px_20px_-8px_rgba(1,173,165,0.7)]'
                      : 'bg-neutral-100/80 text-neutral-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 border border-transparent'
                  }`}
                >
                  {spec}
                  {selectedSpecialization === spec && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-80 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-5rem] h-72 w-96 rounded-full bg-emerald-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="text-neutral-500 text-lg mt-4">Loading experts...</p>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DoctorCard
                    images={[]}
                    name={doctor.name}
                    specialization={doctor.specialization}
                    qualification={doctor.qualification || 'Specialist'}
                    experience={doctor.experience}
                    rating={4.8}
                    availableDays={doctor.availableDays}
                    bio={doctor.bio}
                    phone={doctor.phone}
                    isTopRated={false}
                    bookingHref={`/appointments/book?doctor=${encodeURIComponent(doctor.name)}`}
                    onViewProfile={() =>
                      setSelectedDoctor({
                        name: doctor.name,
                        specialization: doctor.specialization,
                        qualification: doctor.qualification || 'Specialist',
                        experience: doctor.experience,
                        rating: 4.8,
                        availableDays: doctor.availableDays,
                        bio: doctor.bio,
                        phone: doctor.phone,
                        isTopRated: false,
                        images: [],
                        bookingHref: `/appointments/book?doctor=${encodeURIComponent(doctor.name)}`,
                        highlights: [doctor.specialization, doctor.qualification || ''].filter(Boolean),
                      })
                    }
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-lg">No experts found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTAFooter
        title="Need help finding the right"
        highlight="specialist?"
        subtitle="Our team is here to help you find the right specialist for your health needs. Contact us for a consultation."
      />
    </main>
    </>
  );
}

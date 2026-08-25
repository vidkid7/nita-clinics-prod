'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import toast from 'react-hot-toast';
import { post, get, getErrorMessage } from '@/lib/api';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  imageUrl?: string;
  department?: {
    name: string;
  };
}

interface DoctorWithAvailability extends Doctor {
  isAvailable: boolean;
  nextAvailableSlots?: string[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

type Step = 1 | 2 | 3 | 4;

type VisitCategory = 'consultation' | 'vaccination' | 'checkup';

export default function BookAppointmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [allDoctors, setAllDoctors] = useState<DoctorWithAvailability[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [vaccineOptions, setVaccineOptions] = useState<{ id: string; name: string }[]>([]);
  const [vaccineSelectValue, setVaccineSelectValue] = useState('');

  // Form data
  const [visitCategory, setVisitCategory] = useState<VisitCategory>('consultation');
  const [visitDetail, setVisitDetail] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

  const doctorOptional = visitCategory === 'vaccination' || visitCategory === 'checkup';

  const stepLabels = useMemo(
    () => [
      { step: 1 as const, label: 'Choose Date & Time' },
      {
        step: 2 as const,
        label: doctorOptional ? 'Doctor (optional)' : 'Select Doctor',
      },
      { step: 3 as const, label: 'Your Details' },
    ],
    [doctorOptional],
  );

  // Deep links: ?type=vaccination& vaccine=… &package=… &specialty=… &test=…
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const t = (sp.get('type') || '').toLowerCase();
    const vaccine = sp.get('vaccine');
    const pkg = sp.get('package');
    const specialty = sp.get('specialty');
    const test = sp.get('test');

    if (t === 'vaccination' || t === 'travel-health') {
      setVisitCategory('vaccination');
    } else if (t === 'checkup' || t === 'package' || t === 'home-collection') {
      setVisitCategory('checkup');
    } else {
      setVisitCategory('consultation');
    }

    const detailBits: string[] = [];
    if (vaccine) detailBits.push(vaccine);
    if (pkg) detailBits.push(pkg);
    if (specialty) detailBits.push(`Focus: ${specialty}`);
    if (test) detailBits.push(`Test: ${test}`);
    if (detailBits.length) setVisitDetail(detailBits.join(' · '));
    if (vaccine) setVaccineSelectValue(vaccine);
  }, []);

  useEffect(() => {
    if (visitCategory !== 'vaccination') return;
    let cancelled = false;
    (async () => {
      try {
        const res = await get<{ data?: { id: string; name: string }[] }>('vaccinations', {
          params: { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' },
        });
        if (cancelled) return;
        setVaccineOptions(res?.data || []);
      } catch {
        if (!cancelled) setVaccineOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visitCategory]);

  // Pre-fill from logged-in patient (token is sent on /appointments/* — see api.ts)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('patient_auth_token') : null;
        if (!token) return;
        const me = await get<{
          fullName: string;
          email: string;
          phone: string;
        }>('patients/me');
        if (cancelled || !me) return;
        setPatientName((n) => n.trim() || me.fullName || '');
        setPatientEmail((e) => e.trim() || (me.email || '').toLowerCase());
        setPatientPhone((p) => p.trim() || me.phone || '');
      } catch {
        /* guest booking — ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  // Fetch all doctors with availability status when date and time are selected
  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchAllDoctorsWithAvailability();
    }
  }, [selectedDate, selectedTime]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;

    try {
      setLoadingSlots(true);
      const response = await get<string[]>('doctors/booking/available-slots', {
        params: { date: selectedDate },
      });
      setAvailableSlots(response || []);
      if (!response || response.length === 0) {
        toast.error('No available slots for this date');
      }
    } catch (error) {
      console.error('Failed to load available slots', error);
      toast.error('Failed to load available time slots');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchAllDoctorsWithAvailability = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      setLoadingDoctors(true);
      
      // Fetch all doctors
      const allDoctorsResponse = await get<any>('doctors', {
        params: { page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' },
      });
      const doctors: Doctor[] = allDoctorsResponse.data || [];

      // Fetch available doctors for selected time
      const availableDoctorsResponse = await get<Doctor[]>('appointments/available-doctors', {
        params: { date: selectedDate, time: selectedTime },
      });
      const availableDoctorIds = new Set(availableDoctorsResponse.map((d: Doctor) => d.id));

      // For each doctor, check their availability
      const doctorsWithAvailability: DoctorWithAvailability[] = await Promise.all(
        doctors.map(async (doctor) => {
          const isAvailable = availableDoctorIds.has(doctor.id);
          
          let nextAvailableSlots: string[] = [];
          if (!isAvailable) {
            // Fetch doctor's available slots for the selected date
            try {
              const slots = await get<TimeSlot[]>(`doctors/${doctor.id}/slots`, {
                params: { date: selectedDate },
              });
              nextAvailableSlots = slots.map((s) => s.startTime).slice(0, 3); // Show first 3 slots
            } catch (error) {
              console.error(`Failed to fetch slots for doctor ${doctor.id}`, error);
            }
          }

          return {
            ...doctor,
            isAvailable,
            nextAvailableSlots,
          };
        })
      );

      setAllDoctors(doctorsWithAvailability);
    } catch (error) {
      console.error('Failed to load doctors', error);
      toast.error('Failed to load doctors');
      setAllDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleDoctorClick = (doctor: DoctorWithAvailability) => {
    if (!doctor.isAvailable) {
      if (doctor.nextAvailableSlots && doctor.nextAvailableSlots.length > 0) {
        toast.error(
          `${doctor.name} is not available at ${selectedTime}. Available times on ${selectedDate}: ${doctor.nextAvailableSlots.join(', ')}`,
          { duration: 5000 }
        );
      } else {
        toast.error(
          `${doctor.name} is not available on ${selectedDate}. Please select another date or doctor.`,
          { duration: 4000 }
        );
      }
      return;
    }
    setSelectedDoctor(doctor);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !patientName || !patientEmail || !patientPhone) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (visitCategory === 'consultation' && !selectedDoctor) {
      toast.error('Please select a doctor for a consultation');
      return;
    }
    if (visitCategory === 'vaccination' && !visitDetail.trim()) {
      toast.error('Please select or enter the vaccination type');
      return;
    }

    try {
      setIsLoading(true);
      const payload: Record<string, unknown> = {
        date: selectedDate,
        startTime: selectedTime,
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim().toLowerCase(),
        patientPhone: patientPhone.trim(),
        visitCategory,
      };
      if (visitDetail.trim()) payload.visitDetail = visitDetail.trim();
      if (notes.trim()) payload.notes = notes.trim();
      if (selectedDoctor) payload.doctorId = selectedDoctor.id;

      await post('appointments', payload);

      toast.success('Appointment booked successfully!');
      setCurrentStep(4);
    } catch (error) {
      console.error('Failed to book appointment', error);
      toast.error(getErrorMessage(error) || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!selectedDate || !selectedTime) {
        toast.error('Please select date and time');
        return;
      }
      if (visitCategory === 'vaccination' && !visitDetail.trim()) {
        toast.error('Please select or enter the vaccination type');
        return;
      }
    }
    if (currentStep === 2 && visitCategory === 'consultation' && !selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const skipDoctorAndContinue = () => {
    if (!doctorOptional) return;
    setSelectedDoctor(null);
    setCurrentStep(3);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const getMinDate = () => {
    return format(new Date(), 'yyyy-MM-dd');
  };

  const getMaxDate = () => {
    return format(addDays(new Date(), 90), 'yyyy-MM-dd');
  };

  return (
    <>
      <PremiumLandingHero
        eyebrow="Online Booking"
        title="Book your visit"
        highlight="in a few guided steps."
        description="Choose consultation, vaccination, or check-up, select a date and time, then confirm patient details for a smoother clinic visit."
        videoSrc="/videos/hero/doctor-writing-appointment.mp4"
        posterSrc="/videos/hero/doctor-writing-appointment.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.66] to-teal-900/[0.42]"
        actions={[
          { label: 'Start Booking', href: '#booking-steps', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Call for Help', href: 'tel:+977014533361', icon: <FiPhone className="h-4 w-4" />, variant: 'secondary' },
        ]}
        trustPoints={[
          'Consultation, vaccination, and check-up visits',
          'Doctor optional for vaccination and check-up',
          'Available time slots shown by date',
          'Confirmation after successful booking',
        ]}
        stats={[
          { value: String(currentStep), label: 'Current Step' },
          { value: '90 days', label: 'Booking Window' },
          { value: 'Online', label: 'Confirmation' },
        ]}
        panelEyebrow="Booking Flow"
        panelTitle="A guided route from service type to confirmation."
        panelItems={[
          'Pick the visit category and provide the service detail if needed.',
          'Choose date, time, and available doctor when required.',
          'Confirm patient details and submit the appointment request.',
        ]}
      />

      {/* Progress Steps */}
      <section id="booking-steps" className="py-6 bg-white border-b border-neutral-100 scroll-mt-24">
        <div className="container-custom">
          <div className="flex justify-center items-center">
            {stepLabels.map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold transition-all border-2 ${
                      currentStep > item.step
                        ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20'
                        : currentStep === item.step
                        ? 'bg-white border-primary-600 text-primary-600 shadow-md shadow-primary-600/20'
                        : 'bg-neutral-100 border-neutral-200 text-neutral-400'
                    }`}
                  >
                    {currentStep > item.step ? <FiCheck className="w-5 h-5" /> : item.step}
                  </div>
                  <span
                    className={`hidden md:block text-xs font-medium ${
                      currentStep >= item.step ? 'text-primary-700' : 'text-neutral-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < stepLabels.length - 1 && (
                  <div className="w-10 md:w-20 h-0.5 mx-2 md:mx-4 mb-5 rounded-full overflow-hidden bg-neutral-200">
                    <div
                      className={`h-full bg-primary-600 transition-all duration-500 ${
                        currentStep > item.step ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-4xl">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Select Date & Time */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                  Choose Date & Time
                </h2>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-neutral-100 mb-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      What are you booking?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['consultation', 'vaccination', 'checkup'] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setVisitCategory(c);
                            setSelectedDoctor(null);
                            if (c !== 'vaccination') setVaccineSelectValue('');
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                            visitCategory === c
                              ? 'border-primary-600 bg-primary-600 text-white'
                              : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300'
                          }`}
                        >
                          {c === 'consultation'
                            ? 'Consultation'
                            : c === 'vaccination'
                              ? 'Vaccination'
                              : 'Health check-up'}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      {doctorOptional
                        ? 'On the next step you can pick a doctor or continue without one — the clinic will assign someone if needed.'
                        : 'On the next step you will choose a doctor for this visit.'}
                    </p>
                  </div>

                  {visitCategory === 'vaccination' && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Vaccination type *
                      </label>
                      {vaccineOptions.length > 0 && (
                        <select
                          className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm mb-2 bg-white"
                          value={vaccineSelectValue}
                          onChange={(e) => {
                            const v = e.target.value;
                            setVaccineSelectValue(v);
                            if (v && v !== '__other__') setVisitDetail(v);
                          }}
                        >
                          <option value="">Select from list…</option>
                          {vaccineOptions.map((v) => (
                            <option key={v.id} value={v.name}>
                              {v.name}
                            </option>
                          ))}
                          <option value="__other__">Other (describe below)</option>
                        </select>
                      )}
                      <Input
                        type="text"
                        value={visitDetail}
                        onChange={(e) => setVisitDetail(e.target.value)}
                        placeholder="e.g. Influenza, hepatitis B, travel vaccines"
                        leftIcon={<FiFileText />}
                      />
                    </div>
                  )}

                  {visitCategory === 'checkup' && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Package or focus (optional)
                      </label>
                      <Input
                        type="text"
                        value={visitDetail}
                        onChange={(e) => setVisitDetail(e.target.value)}
                        placeholder="e.g. Annual wellness, pediatrics package, TB screening"
                        leftIcon={<FiFileText />}
                      />
                    </div>
                  )}
                </div>

                {/* Calendar-Style Date Picker */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-neutral-100 mb-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-700 mb-4">
                      Select Date
                    </label>
                    
                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
                        disabled={isBefore(currentWeekStart, startOfWeek(new Date(), { weekStartsOn: 0 })) || currentWeekStart.getTime() === startOfWeek(new Date(), { weekStartsOn: 0 }).getTime()}
                        className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous week"
                      >
                        <FiArrowLeft className="w-5 h-5" />
                      </button>
                      <span className="font-medium text-neutral-900">
                        {format(currentWeekStart, 'MMMM yyyy')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
                        disabled={currentWeekStart >= addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), 84)}
                        className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next week"
                      >
                        <FiArrowRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {/* Day Headers */}
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
                          {day}
                        </div>
                      ))}
                      
                      {/* Date Buttons */}
                      {eachDayOfInterval({
                        start: currentWeekStart,
                        end: endOfWeek(currentWeekStart, { weekStartsOn: 0 }),
                      }).map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isPast = isBefore(day, startOfDay(new Date()));
                        const isTooFar = day > addDays(new Date(), 90);
                        const isDisabled = isPast || isTooFar;
                        const isSelected = selectedDate === dateStr;
                        const isTodayDate = isToday(day);

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedDate(dateStr);
                                setSelectedTime('');
                                setSelectedDoctor(null);
                              }
                            }}
                            disabled={isDisabled}
                            className={`
                              aspect-square p-2 rounded-lg text-sm font-medium transition-all
                              ${isSelected
                                ? 'bg-primary-600 text-white shadow-md scale-105'
                                : isTodayDate
                                ? 'bg-primary-50 text-primary-700 border-2 border-primary-300'
                                : isDisabled
                                ? 'text-neutral-300 cursor-not-allowed'
                                : 'bg-white border border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
                              }
                            `}
                          >
                            <div className="flex flex-col items-center justify-center h-full">
                              <span>{format(day, 'd')}</span>
                              {isTodayDate && !isSelected && (
                                <span className="text-[8px] mt-0.5">Today</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-xs text-neutral-500 mt-4 text-center">
                      Select a date within the next 90 days
                    </p>
                  </div>

                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-3">
                        Available Time Slots
                      </label>
                      {loadingSlots ? (
                        <div className="text-center py-8 text-neutral-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
                          Loading available slots...
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="text-center py-8 bg-neutral-50 rounded-lg">
                          <FiCalendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                          <p className="text-neutral-500 text-sm">No available slots for this date</p>
                          <p className="text-neutral-400 text-xs mt-1">Please select another date</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                          {availableSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-xl border-2 text-center transition-all hover:scale-105 ${
                                selectedTime === time
                                  ? 'border-primary-600 bg-primary-600 text-white shadow-md shadow-primary-600/20'
                                  : 'border-neutral-200 bg-white hover:border-primary-400 hover:bg-primary-50 hover:shadow-sm'
                              }`}
                            >
                              <FiClock className={`w-4 h-4 mx-auto mb-1 ${selectedTime === time ? 'text-white' : 'text-neutral-500'}`} />
                              <span className="text-sm font-medium">{time}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedDate && selectedTime && (
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-4 border border-primary-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-900">
                          {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')} at {selectedTime}
                        </p>
                        <p className="text-xs text-primary-700 mt-1">
                          {doctorOptional
                            ? 'Click Next to optionally choose a doctor for this time, or skip that step.'
                            : 'Click Next to see available doctors for this time slot.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Doctor */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                  {doctorOptional ? 'Doctor (optional)' : 'Select a Doctor'}
                </h2>

                {doctorOptional && (
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-amber-950">
                      For {visitCategory === 'vaccination' ? 'vaccinations' : 'check-ups'}, you do not need to
                      pick a doctor. We will assign the right clinician at the clinic.
                    </p>
                    <Button type="button" variant="secondary" onClick={skipDoctorAndContinue} className="shrink-0">
                      Continue without doctor
                    </Button>
                  </div>
                )}

                <div className="bg-primary-50 rounded-2xl p-4 border border-primary-200 mb-6">
                  <p className="text-sm text-primary-900">
                    <strong>Selected Time:</strong> {selectedDate} at {selectedTime}
                  </p>
                  <p className="text-xs text-primary-700 mt-1">
                    Green border = Available | Gray = Not available at this time
                  </p>
                </div>

                {loadingDoctors ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-neutral-500">Loading doctors...</p>
                  </div>
                ) : allDoctors.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-card border border-neutral-100 space-y-4">
                    <FiUser className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 mb-2">No doctors found</p>
                    {doctorOptional && (
                      <Button type="button" onClick={skipDoctorAndContinue}>
                        Continue without doctor
                      </Button>
                    )}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setSelectedTime('');
                        }}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        ← Choose a different time
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {allDoctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => handleDoctorClick(doctor)}
                        disabled={!doctor.isAvailable}
                        className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                          selectedDoctor?.id === doctor.id
                            ? 'border-primary-600 bg-primary-50 shadow-md shadow-primary-600/10'
                            : doctor.isAvailable
                            ? 'border-neutral-200 bg-white hover:border-primary-400 hover:shadow-lg hover:-translate-y-0.5'
                            : 'border-neutral-200 bg-neutral-50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        {/* Availability Badge */}
                        <div className="absolute top-2 right-2">
                          {doctor.isAvailable ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Available
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs font-medium rounded-full">
                              Not Available
                            </span>
                          )}
                        </div>

                        <div className="flex items-start gap-4 mt-6">
                          {doctor.imageUrl && (
                            <img
                              src={doctor.imageUrl}
                              alt={doctor.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className={`font-semibold ${doctor.isAvailable ? 'text-neutral-900' : 'text-neutral-500'}`}>
                              {doctor.name}
                            </h3>
                            <p className={`text-sm ${doctor.isAvailable ? 'text-neutral-600' : 'text-neutral-400'}`}>
                              {doctor.specialization}
                            </p>
                            <p className={`text-xs mt-1 ${doctor.isAvailable ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              {doctor.qualification}
                            </p>
                            {doctor.department && (
                              <p className={`text-xs mt-1 ${doctor.isAvailable ? 'text-primary-600' : 'text-neutral-400'}`}>
                                {doctor.department.name}
                              </p>
                            )}
                            
                            {/* Show available times for unavailable doctors */}
                            {!doctor.isAvailable && doctor.nextAvailableSlots && doctor.nextAvailableSlots.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-neutral-200">
                                <p className="text-xs text-neutral-600 font-medium">Available today at:</p>
                                <p className="text-xs text-primary-600 mt-1">
                                  {doctor.nextAvailableSlots.join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                          {selectedDoctor?.id === doctor.id && (
                            <FiCheck className="text-primary-600 w-6 h-6 absolute bottom-4 right-4" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Summary of available doctors */}
                {allDoctors.length > 0 && (
                  <div className="mt-6 text-center text-sm text-neutral-600">
                    {allDoctors.filter(d => d.isAvailable).length} of {allDoctors.length} doctors available at {selectedTime}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Patient Details */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                  Your Details
                </h2>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-neutral-100 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter your full name"
                      leftIcon={<FiUser />}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      leftIcon={<FiMail />}
                      required
                      autoComplete="email"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Use the same email as your patient account so bookings appear in your dashboard.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+977 9841234567"
                      leftIcon={<FiPhone />}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific concerns or requirements..."
                      rows={4}
                    />
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-4 mt-6 border border-neutral-100">
                    <h3 className="font-semibold text-neutral-900 mb-3">Appointment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Visit:</strong>{' '}
                        {visitCategory === 'consultation'
                          ? 'Consultation'
                          : visitCategory === 'vaccination'
                            ? 'Vaccination'
                            : 'Health check-up'}
                        {visitDetail.trim() ? ` — ${visitDetail.trim()}` : ''}
                      </p>
                      <p>
                        <strong>Doctor:</strong>{' '}
                        {selectedDoctor?.name ?? (doctorOptional ? 'To be assigned at clinic' : '—')}
                      </p>
                      <p>
                        <strong>Date:</strong> {selectedDate}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-4">
                  Appointment Booked Successfully!
                </h2>
                <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                  Your appointment has been confirmed. We've sent a confirmation email to{' '}
                  <strong>{patientEmail}</strong>
                </p>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-neutral-100 max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-neutral-900 mb-4">Appointment Details</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between gap-4">
                      <span className="text-neutral-600 shrink-0">Visit:</span>
                      <span className="font-medium text-right">
                        {visitCategory === 'consultation'
                          ? 'Consultation'
                          : visitCategory === 'vaccination'
                            ? 'Vaccination'
                            : 'Health check-up'}
                        {visitDetail.trim() ? ` — ${visitDetail.trim()}` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-neutral-600">Doctor:</span>
                      <span className="font-medium text-right">
                        {selectedDoctor?.name ?? (doctorOptional ? 'Assigned at clinic' : '—')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Date:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Patient:</span>
                      <span className="font-medium">{patientName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/')} variant="secondary">
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStep(1);
                      setVisitCategory('consultation');
                      setVisitDetail('');
                      setVaccineSelectValue('');
                      setSelectedDate('');
                      setSelectedTime('');
                      setSelectedDoctor(null);
                      setPatientName('');
                      setPatientEmail('');
                      setPatientPhone('');
                      setNotes('');
                    }}
                  >
                    Book Another Appointment
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <FiArrowLeft />
                Previous
              </Button>
              {currentStep < 3 ? (
                <Button onClick={nextStep} className="flex items-center gap-2">
                  Next
                  <FiArrowRight />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? 'Booking...' : 'Confirm Booking'}
                  <FiCheck />
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

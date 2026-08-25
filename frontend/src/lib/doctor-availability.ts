export const DEFAULT_DOCTOR_AVAILABILITY = 'By appointment';

type DoctorAvailabilityInput = {
  availableDays?: string | null;
  bio?: string | null;
};

function formatAvailability(value: string): string {
  return value
    .replace(/\s*;\s*/g, ' · ')
    .replace(/[.!?]\s*$/, '')
    .trim() || DEFAULT_DOCTOR_AVAILABILITY;
}

/**
 * Uses the explicit Clinic schedule sentence when a profile includes one,
 * otherwise preserves the supplied fallback schedule.
 */
export function getDoctorAvailability({ availableDays, bio }: DoctorAvailabilityInput): string {
  const scheduleMatch = bio?.match(/(?:^|[.!?]\s*)Clinic schedule:\s*([^.!?]+)(?:[.!?]|$)/i);
  const scheduleFromBio = scheduleMatch?.[1]?.trim();
  return formatAvailability(scheduleFromBio || availableDays?.trim() || DEFAULT_DOCTOR_AVAILABILITY);
}

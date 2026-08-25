/** Single source of truth — keep in sync with tailwind.config `primary` / `accent` */
export const BRAND_COLORS = {
  /** Main brand (primary-500) */
  primary: '#01ada5',
  primaryRgb: '1, 173, 165',
  primaryDark: '#017f78',
  primaryDarker: '#014d49',
  primaryLight: '#ecfffd',
  primaryMuted: '#5de1d8',
  /** Neutrals for text on light bg */
  foreground: '#171717',
  foregroundMuted: '#525252',
  background: '#ffffff',
} as const;

export const BRAND = {
  name: 'Nita Clinic',
  tagline: 'Your Trusted Healthcare Partner',
  logo: '/images/nita-clinics-logo.png',
  logoAlt: 'Nita Clinic Logo',
  phone: '+977-01-4533361',
  landline: '014533361',
  email: 'info@nitaclinics.com',
  address: 'Bhimselgola-9, Kathmandu',
  addressFull: 'Bhimselgola-9, Kathmandu, Nepal',
  mapLat: 27.7002155,
  mapLng: 85.3459041,
  mapEmbed: 'https://www.google.com/maps?q=27.7002155,85.3459041&z=15&output=embed',
  whatsapp: '9779768523887',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61592513670112',
    instagram: '',
  },
  hours: {
    weekdays: 'Sun-Fri: 7:00 AM - 7:00 PM',
    saturday: 'Saturday: 8:00 AM - 5:00 PM',
  },
  siteUrl: 'https://nitaclinics.com',
  ogImage: '/images/og-image.jpg',
} as const;


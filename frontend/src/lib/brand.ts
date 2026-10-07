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
  phone: '+977-1-4533361',
  phoneHref: 'tel:+97714533361',
  landline: '014533361',
  email: 'info@nitaclinics.com',
  address: 'Bhimsengola-9, Kathmandu',
  addressFull: 'Bhimsengola-9, Kathmandu, Nepal',
  mapLat: 27.7002155,
  mapLng: 85.3459041,
  mapUrl: 'https://www.google.com/maps/?q=27.7002155,85.3459041',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=27.7002155%2C85.3459041',
  mapEmbed: 'https://www.google.com/maps?q=27.7002155,85.3459041&z=15&output=embed',
  whatsapp: '9779768523887',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61592513670112',
    instagram: 'https://instagram.com/nitaclinics',
    youtube: 'https://youtube.com/@nitaclinics',
  },
  hours: {
    weekdays: 'Sun-Fri: 9:00 AM - 6:00 PM',
    saturday: 'Saturday: 9:00 AM - 4:00 PM',
  },
  siteUrl: 'https://nitaclinics.com',
  ogImage: '/logo.png',
} as const;


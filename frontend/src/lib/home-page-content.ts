import { get } from '@/lib/api';

export type HomeHeroContent = {
  badgeText: string;
  title: string;
  highlightText: string;
  subtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  backgroundImage: string;
  stats: {
    yearsExperience: string;
    expertDentists: string;
    happyPatients: string;
  };
};

export type HomeAboutContent = {
  badgeLabel: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  experienceYears: string;
  /** [0] large column photo, [1] small accent — Cloudinary HTTPS URLs from Site settings. */
  imagePaths: [string, string];
};

export type HomeServicesHeaderContent = {
  badgeLabel: string;
  title: string;
  subtitle: string;
};

export type HomeContactContent = {
  badgeLabel: string;
  title: string;
  subtitle: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapEmbed: string;
  workingHours: string;
};

export const DEFAULT_HERO: HomeHeroContent = {
  badgeText: 'NITA Clinic · Kathmandu',
  title: 'Your Health,',
  highlightText: 'Our Priority.',
  subtitle:
    'Specialist consultations, preventive check-ups and vaccination — all under one roof in Kathmandu.',
  primaryCtaText: 'Book Appointment',
  secondaryCtaText: 'Call Now',
  backgroundImage:
    'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=900&q=85&fit=crop&crop=faces,center',
  stats: {
    yearsExperience: '15,000+',
    expertDentists: '4.8/5',
    happyPatients: '10+ Yrs',
  },
};

export const DEFAULT_ABOUT: HomeAboutContent = {
  badgeLabel: 'Why Choose NITA',
  title: 'Comprehensive Care. One Trusted Center.',
  paragraph1:
    'NITA Clinic has been providing trusted healthcare services to families, professionals, and corporate clients in Kathmandu for over a decade.',
  paragraph2:
    'Our team combines experienced specialists with modern lab and screening technology so you get accurate answers and clear treatment paths.',
  experienceYears: '10+',
  imagePaths: [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=85',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80',
  ],
};

export const DEFAULT_SERVICES_HEADER: HomeServicesHeaderContent = {
  badgeLabel: 'Our Services',
  title: 'Comprehensive Clinical Services',
  subtitle:
    'From specialist consultations to lab tests, vaccination, and preventive check-ups, we offer a full range of modern healthcare services for individuals and families.',
};

export const DEFAULT_CONTACT: HomeContactContent = {
  badgeLabel: 'Get in Touch',
  title: 'Ready to Start Your|Health Journey?',
  subtitle:
    'From specialist consultations to lab tests and preventive care, our team is here to support your family every step of the way. Book online in minutes.',
  phone: '+977 01-4533361',
  whatsapp: '+9779768523887',
  email: 'info@nitaclinics.com',
  address: 'Bhimselgola-9, Kathmandu',
  mapEmbed: '',
  workingHours: 'Mon–Fri: 9AM–6PM, Sat: 9AM–4PM',
};

function pickHero(c: Record<string, unknown> | undefined): HomeHeroContent {
  if (!c) return DEFAULT_HERO;
  const stats = (c.stats as Record<string, string>) || {};
  return {
    badgeText: typeof c.badgeText === 'string' ? c.badgeText : DEFAULT_HERO.badgeText,
    title: typeof c.title === 'string' ? c.title : DEFAULT_HERO.title,
    highlightText: typeof c.highlightText === 'string' ? c.highlightText : DEFAULT_HERO.highlightText,
    subtitle: typeof c.subtitle === 'string' ? c.subtitle : DEFAULT_HERO.subtitle,
    primaryCtaText: typeof c.primaryCtaText === 'string' ? c.primaryCtaText : DEFAULT_HERO.primaryCtaText,
    secondaryCtaText:
      typeof c.secondaryCtaText === 'string' ? c.secondaryCtaText : DEFAULT_HERO.secondaryCtaText,
    backgroundImage:
      typeof c.backgroundImage === 'string'
        ? c.backgroundImage
        : typeof c.imagePath === 'string'
          ? c.imagePath
          : Array.isArray(c.images) && typeof (c.images as string[])[0] === 'string'
            ? (c.images as string[])[0]
            : DEFAULT_HERO.backgroundImage,
    stats: {
      yearsExperience: stats.yearsExperience || stats.line1 || DEFAULT_HERO.stats.yearsExperience,
      expertDentists: stats.expertDentists || stats.line2 || DEFAULT_HERO.stats.expertDentists,
      happyPatients: stats.happyPatients || stats.line3 || DEFAULT_HERO.stats.happyPatients,
    },
  };
}

function pickAbout(c: Record<string, unknown> | undefined): HomeAboutContent {
  if (!c) return DEFAULT_ABOUT;
  const raw = Array.isArray(c.imagePaths) ? (c.imagePaths as unknown[]).filter((x) => typeof x === 'string') as string[] : [];
  const imagePaths: [string, string] = [
    raw[0] ?? DEFAULT_ABOUT.imagePaths[0],
    raw[1] ?? DEFAULT_ABOUT.imagePaths[1],
  ];
  return {
    badgeLabel: typeof c.badgeLabel === 'string' ? c.badgeLabel : DEFAULT_ABOUT.badgeLabel,
    title: typeof c.title === 'string' ? c.title : DEFAULT_ABOUT.title,
    paragraph1: typeof c.paragraph1 === 'string' ? c.paragraph1 : DEFAULT_ABOUT.paragraph1,
    paragraph2: typeof c.paragraph2 === 'string' ? c.paragraph2 : DEFAULT_ABOUT.paragraph2,
    experienceYears:
      typeof c.experienceYears === 'string' ? c.experienceYears : DEFAULT_ABOUT.experienceYears,
    imagePaths,
  };
}

function pickServicesHeader(c: Record<string, unknown> | undefined): HomeServicesHeaderContent {
  if (!c) return DEFAULT_SERVICES_HEADER;
  return {
    badgeLabel: typeof c.badgeLabel === 'string' ? c.badgeLabel : DEFAULT_SERVICES_HEADER.badgeLabel,
    title: typeof c.title === 'string' ? c.title : DEFAULT_SERVICES_HEADER.title,
    subtitle: typeof c.subtitle === 'string' ? c.subtitle : DEFAULT_SERVICES_HEADER.subtitle,
  };
}

function pickContact(c: Record<string, unknown> | undefined): HomeContactContent {
  if (!c) return DEFAULT_CONTACT;
  return {
    badgeLabel:
      typeof c.badgeLabel === 'string' ? c.badgeLabel : DEFAULT_CONTACT.badgeLabel,
    title: typeof c.title === 'string' ? c.title : DEFAULT_CONTACT.title,
    subtitle: typeof c.subtitle === 'string' ? c.subtitle : DEFAULT_CONTACT.subtitle,
    phone: typeof c.phone === 'string' ? c.phone : DEFAULT_CONTACT.phone,
    whatsapp: typeof c.whatsapp === 'string' ? c.whatsapp : DEFAULT_CONTACT.whatsapp,
    email: typeof c.email === 'string' ? c.email : DEFAULT_CONTACT.email,
    address: typeof c.address === 'string' ? c.address : DEFAULT_CONTACT.address,
    mapEmbed: typeof c.mapEmbed === 'string' ? c.mapEmbed : DEFAULT_CONTACT.mapEmbed,
    workingHours: typeof c.workingHours === 'string' ? c.workingHours : DEFAULT_CONTACT.workingHours,
  };
}

export type HomePageContentBundle = {
  hero: HomeHeroContent;
  about: HomeAboutContent;
  servicesHeader: HomeServicesHeaderContent;
  contact: HomeContactContent;
};

/** Build a tel: href from a human-readable phone or WhatsApp number. */
export function toTelHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return 'tel:';
  if (cleaned.startsWith('+')) return `tel:${cleaned}`;
  return `tel:+${cleaned}`;
}

/** Split at `|` for accent span (e.g. CTA headline); no other heuristics. */
export function splitPrimaryAccentTitle(title: string): { first: string; second: string | null } {
  const t = title.trim();
  if (!t.includes('|')) return { first: t, second: null };
  const [a, ...rest] = t.split('|');
  const b = rest.join('|').trim();
  return { first: a.trim(), second: b || null };
}

/** Split a title into two lines: `|`, newline, or first `. ` pair. */
export function splitHeadingTwoLines(title: string): { first: string; second: string | null } {
  const t = title.trim();
  if (t.includes('|')) {
    const [a, ...rest] = t.split('|');
    const b = rest.join('|').trim();
    return { first: a.trim(), second: b || null };
  }
  const nl = t.indexOf('\n');
  if (nl >= 0) {
    return { first: t.slice(0, nl).trim(), second: t.slice(nl + 1).trim() || null };
  }
  const dot = t.indexOf('. ');
  if (dot > 0 && dot < t.length - 2) {
    return { first: t.slice(0, dot + 1).trim(), second: t.slice(dot + 2).trim() };
  }
  return { first: t, second: null };
}

export async function fetchHomePageContent(): Promise<HomePageContentBundle> {
  const base = 'content/page/home';
  try {
    const [heroRes, aboutRes, servicesRes, contactRes] = await Promise.all([
      get<{ content?: Record<string, unknown> }>(`${base}/hero`).catch(() => null),
      get<{ content?: Record<string, unknown> }>(`${base}/about`).catch(() => null),
      get<{ content?: Record<string, unknown> }>(`${base}/services`).catch(() => null),
      get<{ content?: Record<string, unknown> }>(`${base}/contact`).catch(() => null),
    ]);
    return {
      hero: pickHero(heroRes?.content),
      about: pickAbout(aboutRes?.content),
      servicesHeader: pickServicesHeader(servicesRes?.content),
      contact: pickContact(contactRes?.content),
    };
  } catch {
    return {
      hero: DEFAULT_HERO,
      about: DEFAULT_ABOUT,
      servicesHeader: DEFAULT_SERVICES_HEADER,
      contact: DEFAULT_CONTACT,
    };
  }
}

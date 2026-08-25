/**
 * Home page “Our Services” strip — stored in settings key `home_services` (JSON string).
 * Icons and colors are preset keys so data stays JSON-serializable.
 */

export type HomeServiceIconKey =
  | 'microscope'
  | 'female'
  | 'heartbeat'
  | 'creditCard'
  | 'pill'
  | 'xray'
  | 'syringe';

export type HomeServiceColorKey = 'primary' | 'rose' | 'emerald' | 'sky' | 'amber' | 'indigo';

export type HomeServiceItem = {
  iconKey: HomeServiceIconKey;
  colorKey: HomeServiceColorKey;
  title: string;
  desc: string;
  href: string;
  tag: string;
};

export type HomeServicesBlock = {
  badge: string;
  heading: string;
  subheading: string;
  items: HomeServiceItem[];
};

export const HOME_SERVICES_DEFAULT: HomeServicesBlock = {
  badge: 'Our Services',
  heading: 'Comprehensive Clinical Services',
  subheading:
    'From specialist consultations to lab tests, vaccination, and preventive check-ups, we offer a full range of modern healthcare services for individuals and families.',
  items: [
    {
      iconKey: 'microscope',
      colorKey: 'primary',
      title: 'NITA Path Labs',
      desc: 'Leading pathology lab offering advanced testing for early disease detection, treatment monitoring, and preventive healthcare.',
      href: '/services/laboratory',
      tag: 'Lab Tests',
    },
    {
      iconKey: 'female',
      colorKey: 'rose',
      title: "Women's Health Clinic",
      desc: 'Comprehensive gynecological care for all ages — from routine check-ups to specialist treatment and prenatal support.',
      href: '/specialists/gynecology-obstetrics',
      tag: 'Specialists',
    },
    {
      iconKey: 'heartbeat',
      colorKey: 'emerald',
      title: 'Family Medicine & Wellness',
      desc: 'Accurate diagnosis and prevention-focused primary care for your whole family, including chronic disease management.',
      href: '/checkup',
      tag: 'Check-up',
    },
    {
      iconKey: 'creditCard',
      colorKey: 'sky',
      title: 'NITA Health Card',
      desc: 'Membership benefits for doctors, staff, and partner organizations — including OPD privileges, lab discounts, priority access, and savings on health packages.',
      href: '/health-card',
      tag: 'Health Card',
    },
    {
      iconKey: 'pill',
      colorKey: 'amber',
      title: 'NITA Pharmacy',
      desc: 'Walk-in counter and same-day home delivery within Kathmandu Valley. Pharmacist-reviewed, cold-chain safe, and priced transparently.',
      href: '/services/pharmacy',
      tag: 'Pharmacy',
    },
  ],
};

const ICON_KEYS: HomeServiceIconKey[] = [
  'microscope',
  'female',
  'heartbeat',
  'creditCard',
  'pill',
  'xray',
  'syringe',
];
const COLOR_KEYS: HomeServiceColorKey[] = ['primary', 'rose', 'emerald', 'sky', 'amber', 'indigo'];

function sanitizeItem(it: Partial<HomeServiceItem>): HomeServiceItem | null {
  if (!it || typeof it.title !== 'string' || !it.title.trim()) return null;
  let href = typeof it.href === 'string' ? it.href.trim() : '/';
  if (href && !href.startsWith('/') && !href.startsWith('http')) href = `/${href}`;
  const iconKey = ICON_KEYS.includes(it.iconKey as HomeServiceIconKey)
    ? (it.iconKey as HomeServiceIconKey)
    : 'microscope';
  const colorKey = COLOR_KEYS.includes(it.colorKey as HomeServiceColorKey)
    ? (it.colorKey as HomeServiceColorKey)
    : 'primary';
  return {
    iconKey,
    colorKey,
    title: it.title.trim(),
    desc: typeof it.desc === 'string' ? it.desc : '',
    href,
    tag: typeof it.tag === 'string' ? it.tag : 'Service',
  };
}

export function parseHomeServicesJson(raw: string | undefined): HomeServicesBlock {
  if (!raw || !raw.trim()) return HOME_SERVICES_DEFAULT;
  try {
    const parsed = JSON.parse(raw) as HomeServicesBlock;
    if (!parsed || !Array.isArray(parsed.items)) return HOME_SERVICES_DEFAULT;
    const items = parsed.items.map((row) => sanitizeItem(row)).filter(Boolean) as HomeServiceItem[];
    if (items.length === 0) return HOME_SERVICES_DEFAULT;
    return {
      badge: typeof parsed.badge === 'string' ? parsed.badge : HOME_SERVICES_DEFAULT.badge,
      heading: typeof parsed.heading === 'string' ? parsed.heading : HOME_SERVICES_DEFAULT.heading,
      subheading:
        typeof parsed.subheading === 'string' ? parsed.subheading : HOME_SERVICES_DEFAULT.subheading,
      items,
    };
  } catch {
    return HOME_SERVICES_DEFAULT;
  }
}

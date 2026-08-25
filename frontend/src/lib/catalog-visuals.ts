import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Beaker,
  Baby,
  Droplets,
  FlaskConical,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Stethoscope,
  TestTube2,
} from 'lucide-react';

export type CatalogVisual = {
  Icon: LucideIcon;
  iconClassName: string;
  badgeClassName: string;
};

/** Pick a clear visual language for a test instead of repeating a generic bullet. */
export function getCatalogVisual(label: string, category = ''): CatalogVisual {
  const value = `${label} ${category}`.toLowerCase();

  if (value.includes('pregnancy') || value.includes('ca125') || value.includes('psa')) {
    return { Icon: Baby, iconClassName: 'text-rose-600', badgeClassName: 'bg-rose-50' };
  }
  if (value.includes('pcos') || value.includes('ovary') || value.includes('uterine') || value.includes('fibroid') || value.includes('fertility') || value.includes('menstrual') || value.includes('menopause') || value.includes('cervical') || value.includes('gynecology') || value.includes('gynaecology') || value.includes('women')) {
    return { Icon: HeartPulse, iconClassName: 'text-rose-600', badgeClassName: 'bg-rose-50' };
  }
  if (value.includes('bone') || value.includes('joint') || value.includes('spine') || value.includes('muscle') || value.includes('orthopedic') || value.includes('orthopaedic')) {
    return { Icon: Activity, iconClassName: 'text-indigo-600', badgeClassName: 'bg-indigo-50' };
  }
  if (value.includes('tuberculosis') || value.includes('lung') || value.includes('sputum') || value.includes('breathing') || value.includes('respiratory')) {
    return { Icon: HeartPulse, iconClassName: 'text-emerald-600', badgeClassName: 'bg-emerald-50' };
  }
  if (value.includes('urine') || value.includes('stool') || value.includes('semen') || value.includes('koh')) {
    return { Icon: TestTube2, iconClassName: 'text-violet-600', badgeClassName: 'bg-violet-50' };
  }
  if (value.includes('blood') || value.includes('cbc') || value.includes('haematology') || value.includes('platelet') || value.includes('hb')) {
    return { Icon: Droplets, iconClassName: 'text-red-600', badgeClassName: 'bg-red-50' };
  }
  if (value.includes('glucose') || value.includes('sugar') || value.includes('lipid') || value.includes('calcium') || value.includes('albumin') || value.includes('uric')) {
    return { Icon: Beaker, iconClassName: 'text-amber-600', badgeClassName: 'bg-amber-50' };
  }
  if (value.includes('renal') || value.includes('rft') || value.includes('kidney')) {
    return { Icon: HeartPulse, iconClassName: 'text-emerald-600', badgeClassName: 'bg-emerald-50' };
  }
  if (value.includes('liver') || value.includes('lft') || value.includes('thyroid') || value.includes('tft') || value.includes('tsh')) {
    return { Icon: Activity, iconClassName: 'text-teal-600', badgeClassName: 'bg-teal-50' };
  }
  if (value.includes('dengue') || value.includes('hiv') || value.includes('hbsag') || value.includes('hcv') || value.includes('vdrl') || value.includes('widal') || value.includes('serology')) {
    return { Icon: ShieldCheck, iconClassName: 'text-blue-600', badgeClassName: 'bg-blue-50' };
  }
  if (value.includes('gram') || value.includes('afb') || value.includes('micro') || value.includes('parasite') || value.includes('stain')) {
    return { Icon: Microscope, iconClassName: 'text-indigo-600', badgeClassName: 'bg-indigo-50' };
  }
  if (value.includes('consult') || value.includes('chest') || value.includes('x-ray') || value.includes('antenatal') || value.includes('prenatal')) {
    return { Icon: Stethoscope, iconClassName: 'text-cyan-600', badgeClassName: 'bg-cyan-50' };
  }
  if (value.includes('procedure') || value.includes('screening') || value.includes('assessment') || value.includes('review') || value.includes('guidance')) {
    return { Icon: Stethoscope, iconClassName: 'text-cyan-600', badgeClassName: 'bg-cyan-50' };
  }
  if (category.toLowerCase().includes('condition')) {
    return { Icon: HeartPulse, iconClassName: 'text-rose-600', badgeClassName: 'bg-rose-50' };
  }
  if (category.toLowerCase().includes('procedure')) {
    return { Icon: Stethoscope, iconClassName: 'text-cyan-600', badgeClassName: 'bg-cyan-50' };
  }
  if (value.includes('sample') || value.includes('test')) {
    return { Icon: FlaskConical, iconClassName: 'text-primary-600', badgeClassName: 'bg-primary-50' };
  }
  return { Icon: FlaskConical, iconClassName: 'text-primary-600', badgeClassName: 'bg-primary-50' };
}

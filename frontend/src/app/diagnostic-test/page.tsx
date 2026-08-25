'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, FlaskConical, Home, FileText, Phone } from 'lucide-react';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { get } from '@/lib/api';
import { TestCard } from '@/components/diagnostics/TestCard';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { CTAFooter } from '@/components/ui/CTAFooter';
import {
  mapLabTestFromApi,
  type DiagnosticCategory,
  type DiagnosticTest,
} from '@/lib/diagnostic-data';
import {
  FALLBACK_LAB_CATEGORIES,
  FALLBACK_LAB_TESTS,
} from '@/lib/diagnostic-data-fallback';

// Compact, low-key hero for the redesigned lab page (less visual noise than the
// "premium landing hero" pattern used elsewhere).
function LabHeroCompact() {
  return (
    <section className="bg-gradient-to-br from-primary-950 via-primary-900 to-teal-900 text-white py-14 sm:py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 plus-pattern opacity-[0.05]" />
      <div className="container-custom relative z-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
            <FlaskConical className="h-3.5 w-3.5" /> Nita Laboratory Pvt. Ltd.
          </span>
          <h1 className="mt-3 font-heading font-bold text-3xl sm:text-4xl leading-tight">
            Laboratory <span className="text-teal-300">Tests & Panels</span>
          </h1>
          <p className="mt-2 text-white/80 text-sm sm:text-base leading-relaxed">
            Browse our test catalog organized by clinical department — find what you need
            quickly, see pricing up front, and book online.
          </p>
        </div>
      </div>
    </section>
  );
}

// Department → color + icon mapping for clean, low-noise categorization
const DEPARTMENT_META: Record<
  string,
  { label: string; icon: string; accent: string; soft: string; description: string }
> = {
  haematology: {
    label: 'Haematology',
    icon: '🩸',
    accent: 'bg-rose-600',
    soft: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Blood counts, hemoglobin, coagulation, blood smear',
  },
  biochemistry: {
    label: 'Biochemistry',
    icon: '⚗️',
    accent: 'bg-amber-500',
    soft: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Sugar, lipids, liver, kidney, electrolytes, vitamins',
  },
  microbiology: {
    label: 'Microbiology',
    icon: '🧫',
    accent: 'bg-emerald-600',
    soft: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Culture, sensitivity, sputum, urine, stool',
  },
  serology: {
    label: 'Serology',
    icon: '🛡️',
    accent: 'bg-violet-600',
    soft: 'bg-violet-50 text-violet-700 border-violet-200',
    description: 'Blood group, antibody, antigen and infection screening',
  },
  radiology: {
    label: 'Radiology & Imaging',
    icon: '🩻',
    accent: 'bg-sky-600',
    soft: 'bg-sky-50 text-sky-700 border-sky-200',
    description: 'X-Ray, ultrasound, ECG',
  },
  endocrinology: {
    label: 'Endocrinology & Hormones',
    icon: '🦋',
    accent: 'bg-pink-600',
    soft: 'bg-pink-50 text-pink-700 border-pink-200',
    description: 'Thyroid, fertility hormones, cortisol',
  },
  parasitology: {
    label: 'Parasitology',
    icon: '🔬',
    accent: 'bg-lime-600',
    soft: 'bg-lime-50 text-lime-700 border-lime-200',
    description: 'Stool microscopy, malaria, parasites',
  },
  clinical_pathology: {
    label: 'Clinical Pathology',
    icon: '🧪',
    accent: 'bg-indigo-600',
    soft: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Urine, semen, body fluids',
  },
  default: {
    label: 'Other Tests',
    icon: '🧬',
    accent: 'bg-neutral-600',
    soft: 'bg-neutral-50 text-neutral-700 border-neutral-200',
    description: 'Specialized and add-on tests',
  },
};

function pickDepartmentKey(cat: DiagnosticCategory | undefined, test: DiagnosticTest): string {
  // Prefer a slug match in lab_test_categories
  if (cat?.slug && DEPARTMENT_META[cat.slug]) return cat.slug;
  // Try by category name (case-insensitive contains)
  const name = (cat?.label || '').toLowerCase();
  for (const key of Object.keys(DEPARTMENT_META)) {
    if (key === 'default') continue;
    if (name.includes(key) || key.includes(name)) return key;
  }
  // Heuristic from tags
  const tags = (test.tags ?? []).map((t) => t.toLowerCase());
  if (tags.some((t) => t.includes('blood') || t.includes('cbc') || t.includes('hemoglobin'))) {
    return 'hematology';
  }
  if (tags.some((t) => t.includes('sugar') || t.includes('lipid') || t.includes('lft') || t.includes('kft'))) {
    return 'biochemistry';
  }
  if (tags.some((t) => t.includes('culture') || t.includes('sputum'))) return 'microbiology';
  if (tags.some((t) => t.includes('hiv') || t.includes('hbsag') || t.includes('dengue'))) {
    return 'serology';
  }
  if (tags.some((t) => t.includes('x-ray') || t.includes('xray') || t.includes('ultrasound'))) {
    return 'radiology';
  }
  if (tags.some((t) => t.includes('tsh') || t.includes('thyroid') || t.includes('hormone'))) {
    return 'endocrinology';
  }
  if (tags.some((t) => t.includes('stool') || t.includes('malaria') || t.includes('parasit'))) {
    return 'parasitology';
  }
  if (tags.some((t) => t.includes('urine') || t.includes('semen'))) return 'clinical_pathology';
  return 'default';
}

export default function DiagnosticTestPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [categories, setCategories] = useState<DiagnosticCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [openDept, setOpenDept] = useState<string | null>(null); // null = all collapsed in a flat list

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoadError(null);
      // Always seed with the static fallback so the page renders even before
      // the Render backend is up. If the API responds, its data overrides the
      // fallback; otherwise we just keep what we have.
      setTests(FALLBACK_LAB_TESTS);
      setCategories(FALLBACK_LAB_CATEGORIES);
      try {
        const testsRes = await get<any>('lab-tests?limit=100&sortBy=order&sortOrder=asc');
        if (cancelled) return;
        const rows = testsRes?.data ?? [];
        if (Array.isArray(rows) && rows.length > 0) {
          const mapped = rows
            .map((t: Record<string, unknown>) => mapLabTestFromApi(t))
            .filter((test: DiagnosticTest) => FALLBACK_LAB_TESTS.some((fallback) => fallback.slug === test.slug));
          if (mapped.length === FALLBACK_LAB_TESTS.length) {
            const bySlug = new Map(mapped.map((test) => [test.slug, test]));
            setTests(FALLBACK_LAB_TESTS.map((fallback) => bySlug.get(fallback.slug) || fallback));
          }
        }
        // Keep the departments from the workbook. The API currently assigns
        // Urine R/E to Serology, while the workbook places it in Parasitology.
        setCategories(FALLBACK_LAB_CATEGORIES);
      } catch (e) {
        if (!cancelled) {
          // Keep fallback data so the page is not empty. The user can still
          // browse the catalog while the backend is down.
          setLoadError(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Group tests by department
  const testsByDepartment = useMemo(() => {
    const groups: Record<string, DiagnosticTest[]> = {};
    for (const t of tests) {
      const cat = categories.find((c) => c.slug === t.categorySlug);
      const key = pickDepartmentKey(cat, t);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    }
    // Sort: known departments first by sample priority
    const priority = [
      'haematology',
      'biochemistry',
      'serology',
      'microbiology',
      'endocrinology',
      'radiology',
      'parasitology',
      'clinical_pathology',
      'default',
    ];
    const ordered: Array<[string, DiagnosticTest[]]> = [];
    for (const k of priority) {
      if (groups[k]?.length) ordered.push([k, groups[k]]);
    }
    return ordered;
  }, [tests, categories]);

  // Apply search filter
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return testsByDepartment;
    const q = searchQuery.toLowerCase();
    return testsByDepartment
      .map(([key, list]) => {
        const filteredList = list.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q)),
        );
        return [key, filteredList] as [string, DiagnosticTest[]];
      })
      .filter(([, list]) => list.length > 0);
  }, [testsByDepartment, searchQuery]);

  const totalCount = filtered.reduce((acc, [, list]) => acc + list.length, 0);

  return (
    <main>
      <LabHeroCompact />

      {/* ── Compact sticky search bar (no flashy hero overlap) ── */}
      <section className="sticky top-0 z-30 bg-white border-b border-neutral-200 shadow-sm">
        <div className="container-custom py-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tests, conditions, sample types…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700">
                {totalCount} test{totalCount !== 1 ? 's' : ''}
              </span>
              <span className="text-neutral-300">|</span>
              <span>in {filtered.length} department{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Department-organized catalog ── */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
          ) : loadError && tests.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-red-100 bg-red-50/80 px-6">
              <p className="text-neutral-800 font-semibold mb-2">Could not load catalog</p>
              <p className="text-neutral-600 text-sm mb-4">{loadError}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">No tests found</h3>
              <p className="text-neutral-500 text-sm mb-6">
                Try a different search or clear the filter.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
              >
                Clear search <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(([deptKey, list]) => {
                const meta = DEPARTMENT_META[deptKey] || DEPARTMENT_META.default;
                const isOpen = openDept === null ? true : openDept === deptKey;
                return (
                  <div
                    key={deptKey}
                    className="rounded-2xl border border-neutral-200 bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDept(isOpen && openDept !== null ? null : deptKey)}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${meta.soft} text-lg`}
                      >
                        {meta.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-heading font-bold text-neutral-900 text-base">
                            {meta.label}
                          </h2>
                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                            {list.length} test{list.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">{meta.description}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hidden sm:inline">
                        {isOpen ? 'Hide' : 'Show'}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-neutral-100 px-5 py-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {list.map((test, i) => (
                              <motion.div
                                key={test.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: Math.min(i * 0.025, 0.2) }}
                              >
                                <TestCard test={test} />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Compact info strip ── */}
      <section className="py-10 bg-white border-t border-neutral-100">
        <div className="container-custom">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Home,
                title: 'Home Sample Collection',
                desc: 'Our phlebotomist comes to your doorstep.',
              },
              {
                icon: FileText,
                title: 'Digital Reports',
                desc: 'Download from your patient portal after login.',
              },
              {
                icon: Phone,
                title: 'Lab Helpdesk',
                desc: 'Call us to choose the right panel for your needs.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">{item.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAFooter
        title="Need help choosing"
        highlight="the right test?"
        subtitle="Our lab team can recommend the right panel based on your symptoms, age, or doctor advice."
        actions={[
          { label: 'Book a Test', href: '/appointments/book', icon: <FiCalendar className="h-4 w-4" /> },
          { label: 'Call Lab Desk', href: 'tel:+977014533361', icon: <FiPhone className="h-4 w-4" /> },
        ]}
      />
    </main>
  );
}

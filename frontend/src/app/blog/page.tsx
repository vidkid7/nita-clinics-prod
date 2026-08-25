'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, User, ArrowRight, Tag } from 'lucide-react';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DoodleArrow, DoodleBook, DoodleShield } from '@/components/home/BlogArtworks';
import { DoodleHeart } from '@/components/home/TestimonialArtworks';
import { FALLBACK_BLOG_POSTS, type BlogPost } from '@/lib/blog-data';
import { fetchPublishedBlogPosts } from '@/lib/blog-api';

interface CategoryArt {
  icon: ComponentType<{ className?: string; stroke: string; soft: string }>;
  stroke: string;
  soft: string;
  glow: string;
  tagBg: string;
  tagText: string;
  label: string;
}

const CATEGORY_ART: Record<string, CategoryArt> = {
  'Preventive Health': {
    icon: DoodleShield,
    stroke: '#059669',
    soft: 'rgba(5,150,105,0.18)',
    glow: 'rgba(16,185,129,0.32)',
    tagBg: 'bg-emerald-100',
    tagText: 'text-emerald-700',
    label: 'Prevention',
  },
  Vaccination: {
    icon: DoodleHeart,
    stroke: '#0d9488',
    soft: 'rgba(13,148,136,0.18)',
    glow: 'rgba(20,184,166,0.32)',
    tagBg: 'bg-teal-100',
    tagText: 'text-teal-700',
    label: 'Immunity',
  },
  'Check-up': {
    icon: DoodleBook,
    stroke: '#e11d48',
    soft: 'rgba(225,29,72,0.14)',
    glow: 'rgba(244,63,94,0.28)',
    tagBg: 'bg-rose-100',
    tagText: 'text-rose-700',
    label: 'Check-up',
  },
  'Disease Awareness': {
    icon: DoodleShield,
    stroke: '#d97706',
    soft: 'rgba(217,119,6,0.15)',
    glow: 'rgba(245,158,11,0.3)',
    tagBg: 'bg-amber-100',
    tagText: 'text-amber-700',
    label: 'Awareness',
  },
  'Heart Health': {
    icon: DoodleBook,
    stroke: '#e11d48',
    soft: 'rgba(225,29,72,0.14)',
    glow: 'rgba(244,63,94,0.28)',
    tagBg: 'bg-rose-100',
    tagText: 'text-rose-700',
    label: 'Heart Care',
  },
};

const DEFAULT_CATEGORY_ART: CategoryArt = {
  icon: DoodleBook,
  stroke: '#0d9488',
  soft: 'rgba(13,148,136,0.18)',
  glow: 'rgba(20,184,166,0.32)',
  tagBg: 'bg-neutral-100',
  tagText: 'text-neutral-600',
  label: 'Nita Care',
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_BLOG_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchPublishedBlogPosts(48)
      .then((published) => {
        if (published.length) setPosts(published);
      })
      .catch(() => {/* keep fallback */})
      .finally(() => setIsLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(posts.map((p) => p.category))];
    return ['All', ...cats];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <PremiumLandingHero
        eyebrow="Health Knowledge Hub"
        title="Practical health guidance"
        highlight="from the NITA team."
        description="Read preventive care guides, vaccination notes, check-up explainers, disease awareness articles, and clinic updates written for patients and families."
        videoSrc="/videos/hero/clinic-consultation.mp4"
        posterSrc="/videos/hero/clinic-consultation.jpg"
        overlayClassName="from-primary-950/[0.9] via-primary-900/[0.68] to-primary-800/[0.44]"
        actions={[
          { label: 'Browse Articles', href: '#articles' },
          { label: 'Book Appointment', href: '/appointments/book', variant: 'secondary' },
        ]}
        trustPoints={[
          'Preventive health articles',
          'Vaccination and check-up guides',
          'Disease awareness topics',
          'Free patient education',
        ]}
        stats={[
          { value: String(posts.length), label: 'Articles' },
          { value: String(categories.length - 1), label: 'Topics' },
          { value: 'Free', label: 'Access' },
        ]}
        panelEyebrow="Reading Flow"
        panelTitle="Helpful answers before and after a clinic visit."
        panelItems={[
          'Search by health topic, concern, service, or prevention goal.',
          'Use articles to prepare questions before your appointment.',
          'Move from learning to booking when you need clinical support.',
        ]}
      />

      {/* Search & Filters */}
      <section id="articles" className="py-4 sm:py-6 bg-white border-b border-neutral-100 sticky top-0 z-30 shadow-sm scroll-mt-24">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-sm relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-wrap overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white shadow-[0_8px_20px_-8px_rgba(1,173,165,0.7)]'
                      : 'bg-neutral-100/80 text-neutral-600 border border-transparent hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200'
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (() => {
        const art = CATEGORY_ART[featured.category] || DEFAULT_CATEGORY_ART;
        const Art = art.icon;
        return (
          <section className="section-padding relative overflow-hidden bg-neutral-50">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute inset-0 plus-pattern-light opacity-40" />
              <div className="absolute -top-24 left-1/3 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
              <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
            </div>
            <div className="relative container-custom">
              <SectionHeader
                align="left"
                eyebrow="Featured Article"
                title="Editor's"
                highlight="pick"
                className="mb-8"
              />
              <Link href={`/blog/${featured.slug}`} className="group block">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-[1.75rem] border border-neutral-200/70 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-18px_var(--glow)]"
                  style={{ '--glow': art.glow } as React.CSSProperties}
                >
                  <div className="grid lg:grid-cols-5">
                    <div className="lg:col-span-2 relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                      {featured.featuredImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={featured.featuredImage}
                          alt={featured.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${art.tagBg} flex items-center justify-center`}>
                          <Art className="h-16 w-16 opacity-50" stroke={art.stroke} soft={art.soft} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-transparent" />
                      {/* ECG trace */}
                      <svg className="absolute inset-x-0 bottom-0 h-10 w-full" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
                        <path
                          d="M0 28 H120 L138 10 L158 30 L176 16 L194 28 H600"
                          fill="none"
                          stroke="rgba(255,255,255,0.85)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="90 22"
                          className="animate-ecg-flow"
                        />
                      </svg>
                      {/* featured number */}
                      <span className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white backdrop-blur-md ring-1 ring-white/30">
                        01
                      </span>
                      {/* doodle watermark */}
                      <Art className="absolute -bottom-3 -right-3 h-16 w-16 rotate-12 opacity-40" stroke={art.stroke} soft={art.soft} />
                    </div>
                    <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold w-fit shadow-sm mb-4 ${art.tagBg} ${art.tagText}`}>
                        <Tag className="w-3 h-3" /> {featured.category}
                      </span>
                      <h2 className="text-2xl lg:text-3xl font-heading font-bold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors leading-snug">
                        {featured.title}
                      </h2>
                      <p className="text-neutral-600 mb-5 line-clamp-3">{featured.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-neutral-400 mb-5">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {featured.author}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {featured.readingTime} min read</span>
                      </div>
                      <div className="mb-4 flex items-center gap-2">
                        <svg className="h-3.5 w-20 flex-shrink-0" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true">
                          <path d="M0 9 H30 L36 3 L42 11 L48 6 L54 9 H100" fill="none" stroke={art.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="25 6" opacity="0.35" className="animate-ecg-flow" />
                        </svg>
                        <span className="h-px flex-1 bg-neutral-100" />
                      </div>
                      <span className="inline-flex items-center gap-2 text-primary-600 font-bold group-hover:gap-3 transition-all">
                        Read Full Article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </section>
        );
      })()}

      {/* Article Grid */}
      <section className="section-padding relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="All Articles"
            title="Browse the"
            highlight="health hub"
            subtitle="Evidence-based guides, prevention tips, and clinic updates from our medical team."
            className="mb-12"
          />
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[1.75rem] border border-neutral-200/70 shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gradient-to-br from-neutral-100 to-neutral-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-neutral-200 rounded w-1/3" />
                    <div className="h-5 bg-neutral-200 rounded" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : rest.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => {
                const art = CATEGORY_ART[post.category] || DEFAULT_CATEGORY_ART;
                const Art = art.icon;
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="h-full"
                  >
                    <Link href={`/blog/${post.slug}`} className="group block h-full">
                      <article
                        className="h-full overflow-hidden rounded-[1.75rem] border border-neutral-200/70 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-neutral-200 hover:shadow-[0_28px_60px_-18px_var(--glow)]"
                        style={{ '--glow': art.glow } as React.CSSProperties}
                      >
                        <div className="relative h-48 overflow-hidden">
                          {post.featuredImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${art.tagBg} flex items-center justify-center`}>
                              <Art className="h-12 w-12 opacity-50" stroke={art.stroke} soft={art.soft} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-transparent" />
                          {/* ECG trace */}
                          <svg className="absolute inset-x-0 bottom-0 h-8 w-full" viewBox="0 0 400 32" preserveAspectRatio="none" aria-hidden="true">
                            <path
                              d="M0 22 H120 L138 8 L158 28 L176 14 L194 22 H400"
                              fill="none"
                              stroke="rgba(255,255,255,0.85)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="80 20"
                              className="animate-ecg-flow"
                            />
                          </svg>
                          <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm ${art.tagBg} ${art.tagText}`}>
                            <Tag className="w-3 h-3" /> {post.category}
                          </span>
                          <span className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/30">
                            {String(i + 2).padStart(2, '0')}
                          </span>
                          <Art className="absolute -bottom-3 -right-3 h-14 w-14 rotate-12 opacity-45" stroke={art.stroke} soft={art.soft} />
                        </div>
                        <div className="relative px-5 pb-5 pt-4">
                          <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2.5">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readingTime} min</span>
                          </div>
                          <h3 className="font-heading font-bold text-neutral-900 text-base mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{post.excerpt}</p>
                          {/* ECG divider */}
                          <div className="mb-3 flex items-center gap-2">
                            <svg className="h-4 w-24 flex-shrink-0" viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true">
                              <path
                                d="M0 10 H30 L36 4 L42 12 L48 7 L54 10 H100"
                                fill="none"
                                stroke={art.stroke}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="25 5"
                                opacity="0.35"
                                className="animate-ecg-flow"
                              />
                            </svg>
                            <span className="h-px flex-1 bg-neutral-100" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 transition-all duration-300 group-hover:gap-3">
                              Read Article
                              <Art className="h-4 w-4" stroke={art.stroke} soft={art.soft} />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                              {art.label}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-lg">No articles found matching your search.</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-4 text-primary-600 font-semibold text-sm hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-primary-950 py-20 text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-[-5rem] h-64 w-80 rounded-full bg-teal-500/20 blur-3xl" />
          {/* ECG line on top edge */}
          <svg className="absolute inset-x-0 top-0 h-10 w-full" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0 30 H180 L200 10 L220 32 L240 16 L258 30 H1200"
              fill="none"
              stroke="#5de1d8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="140 24"
              className="animate-ecg-flow"
              opacity="0.5"
            />
          </svg>
          <svg className="absolute inset-x-0 -bottom-2 h-6 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 14 H160 L176 6 L194 18 L210 10 L226 14 H1200" fill="none" stroke="#5de1d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="120 20" className="animate-ecg-flow" opacity="0.4" />
          </svg>
        </div>
        <div className="relative container-custom">
          <div className="glass mx-auto max-w-3xl overflow-hidden rounded-3xl p-8 text-center md:p-10">
            <span className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-200 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 animate-vital-ping" />
              Health Newsletter
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              Stay Informed on <span className="bg-gradient-to-r from-primary-300 to-teal-300 bg-clip-text text-transparent">Your Health</span>
            </h2>
            <p className="text-primary-200/90 mb-8">Get the latest health tips and clinic updates delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-xl bg-primary-500 px-5 py-3 font-bold text-white shadow-[0_10px_24px_-10px_rgba(1,173,165,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-[0_14px_30px_-10px_rgba(1,173,165,0.9)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

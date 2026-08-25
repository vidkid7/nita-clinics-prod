'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User, Tag } from 'lucide-react';
import { fetchPublishedBlogPosts } from '@/lib/blog-api';
import { DoodleArrow, DoodleBook, DoodleShield } from './BlogArtworks';
import { DoodleHeart } from './TestimonialArtworks';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  author: string;
  category: string;
  readingTime: number;
  isPublished: boolean;
}

const fallbackPosts: BlogPost[] = [
  {
    id: 'b1',
    title: 'Stay Safe This Monsoon Season: Health Tips from Our Doctors',
    slug: 'stay-safe-this-monsoon-season',
    excerpt:
      'Monsoon brings waterborne and respiratory illnesses. Here are simple steps to protect your family throughout the season.',
    featuredImage: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    author: 'Dr. Nita Clinic Team',
    category: 'Preventive Health',
    readingTime: 5,
    isPublished: true,
  },
  {
    id: 'b2',
    title: 'Why Adults and Children Both Need Regular Vaccination',
    slug: 'adults-and-kids-need-vaccination',
    excerpt:
      'Immunization is not just for children. Discover which vaccines adults should keep updated and why they matter for lifelong health.',
    featuredImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    author: 'Dr. Nita Clinic Team',
    category: 'Vaccination',
    readingTime: 4,
    isPublished: true,
  },
  {
    id: 'b3',
    title: 'Understanding Preventive Health Check-up Packages',
    slug: 'understanding-preventive-checkup-packages',
    excerpt:
      'Choosing the right check-up package can catch health problems early. A guide to our male and female preventive health plans.',
    featuredImage: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80',
    author: 'Nita Path Labs',
    category: 'Check-up',
    readingTime: 6,
    isPublished: true,
  },
];

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

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);

  useEffect(() => {
    fetchPublishedBlogPosts(3)
      .then((rows) => {
        if (rows.length) setPosts(rows.slice(0, 3));
      })
      .catch(() => {/* keep fallback */});
  }, []);

  return (
    <section className="section-padding bg-neutral-50 border-t border-neutral-100 overflow-hidden relative">
      {/* ambient glows + light texture */}
      <div className="absolute inset-0 plus-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-rose-100/40 blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="section-kicker">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Health Blog
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-primary-600">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-vital-ping" />
                Expert Articles
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
              Health Knowledge <span className="text-primary-600">Hub</span>
            </h2>
            <p className="text-neutral-500 max-w-lg text-sm">
              Evidence-based health tips, preventive care guides, and clinic updates from our medical team.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-300 hover:border-primary-300 hover:text-primary-600 hover:shadow-[0_10px_24px_-12px_rgba(1,173,165,0.5)] flex-shrink-0"
          >
            View All Articles
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => {
            const art = CATEGORY_ART[post.category] || DEFAULT_CATEGORY_ART;
            const Art = art.icon;
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="h-full"
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article
                    className="h-full overflow-hidden rounded-[1.75rem] border border-neutral-200/70 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-neutral-200 hover:shadow-[0_28px_60px_-18px_var(--glow)]"
                    style={{ '--glow': art.glow } as React.CSSProperties}
                  >
                    {/* Thumbnail */}
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
                          <p className={`${art.tagText} text-sm font-medium opacity-60`}>Health Article</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/55 via-primary-900/10 to-transparent" />
                      {/* ECG trace on image */}
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

                      {/* category tag */}
                      <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold shadow-sm ${art.tagBg} ${art.tagText}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>

                      {/* article number */}
                      <span className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/30">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* doodle watermark */}
                      <Art className="absolute -bottom-3 -right-3 h-14 w-14 rotate-12 opacity-45" stroke={art.stroke} soft={art.soft} />
                    </div>

                    {/* Body */}
                    <div className="relative px-5 pb-5 pt-4">
                      <div className="flex items-center gap-3 text-xs text-neutral-400 mb-2.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readingTime} min read
                        </span>
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
                          <DoodleArrow className="h-4 w-4" stroke={art.stroke} soft={art.soft} />
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
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Calendar, ArrowLeft, Share2, Tag, Eye, BookOpen } from 'lucide-react';
import { get, type PaginatedResponse } from '@/lib/api';
import { getBlogPost, FALLBACK_BLOG_POSTS, type BlogPost } from '@/lib/blog-data';
import { VideoHeroBackground } from '@/components/ui/VideoHeroBackground';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DoodleArrow, DoodleBook, DoodleShield } from '@/components/home/BlogArtworks';
import { DoodleHeart } from '@/components/home/TestimonialArtworks';
import toast from 'react-hot-toast';

function formatDate(dateString?: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    get<BlogPost>(`blog/slug/${slug}`)
      .then((postData) => {
        setPost(postData);
        // related from API
        get<PaginatedResponse<BlogPost>>('blog', {
          params: { category: postData.category, limit: 8, sortBy: 'publishedAt', sortOrder: 'desc' },
        })
          .then((res) => {
            setRelatedPosts((res.data || []).filter((p) => p.id !== postData.id).slice(0, 3));
          })
          .catch(() => {});
      })
      .catch(() => {
        // Use fallback data
        const fallback = getBlogPost(slug);
        if (fallback) {
          setPost(fallback);
          setRelatedPosts(
            FALLBACK_BLOG_POSTS.filter((p) => p.id !== fallback.id && p.category === fallback.category).slice(0, 3)
          );
        } else {
          // Try first article if slug not found
          const first = FALLBACK_BLOG_POSTS.find((p) => p.isPublished);
          if (first) setPost(first);
        }
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url: window.location.href });
      } catch {/* cancelled */}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 text-sm">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Article Not Found</h1>
          <p className="text-neutral-500 mb-5">This article may have been moved or removed.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const art = CATEGORY_ART[post.category] || DEFAULT_CATEGORY_ART;
  const Art = art.icon;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <VideoHeroBackground
          src="/videos/hero/clinic-consultation.mp4"
          poster="/videos/hero/clinic-consultation.jpg"
          overlayClassName="from-primary-950/[0.9] via-primary-900/[0.68] to-primary-800/[0.44]"
        />
        {post.featuredImage && (
          <div className="absolute inset-0 opacity-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 to-primary-950" />
          </div>
        )}
        <div className="container-custom relative z-10 py-12 sm:py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary-300 hover:text-white mb-6 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Health Blog
            </Link>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-5 ${art.tagBg} ${art.tagText}`}>
              <Tag className="w-3 h-3" /> {post.category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-5 leading-tight break-words">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-primary-100/90 mb-7 leading-relaxed break-words">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-primary-100/80 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readingTime} min read</span>
              {(post as any).views && <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {(post as any).views} views</span>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="bg-white py-10">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="group relative overflow-hidden rounded-3xl border border-white/60 shadow-[0_30px_70px_-30px_rgba(0,42,40,0.55)]">
                <div className="relative aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-transparent" />
                {/* ECG trace */}
                <svg className="absolute inset-x-0 bottom-0 h-10 w-full" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M0 28 H180 L200 10 L220 32 L240 16 L258 28 H1200"
                    fill="none"
                    stroke="#5de1d8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="130 24"
                    className="animate-ecg-flow"
                    opacity="0.9"
                  />
                </svg>
                {/* doodle watermark */}
                <Art className="absolute -bottom-3 -right-3 h-16 w-16 rotate-12 opacity-40" stroke={art.stroke} soft={art.soft} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="section-padding bg-white overflow-x-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8 lg:gap-10">
              {/* Main Content */}
              <div className="lg:col-span-3 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div
                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none break-words
                      prose-headings:font-heading prose-headings:text-neutral-900
                      prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
                      prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3
                      prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:mb-4
                      prose-li:text-neutral-700 prose-li:mb-1
                      prose-ul:my-4 prose-ol:my-4
                      prose-strong:text-neutral-900 prose-strong:font-bold
                      prose-blockquote:border-l-4 prose-blockquote:border-primary-400
                      prose-blockquote:bg-primary-50 prose-blockquote:rounded-r-2xl
                      prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:my-6
                      prose-blockquote:text-primary-800 prose-blockquote:font-medium prose-blockquote:not-italic
                      prose-img:rounded-xl prose-img:max-w-full"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </motion.div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-neutral-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-teal-500 text-white shadow-md">
                        <Tag className="w-3 h-3" />
                      </span>
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-neutral-200/70 bg-white px-3 py-1 text-xs font-semibold text-neutral-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700 cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share */}
                <div className="mt-8 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-neutral-600 font-semibold text-sm">Found this helpful? Share it:</p>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors font-semibold text-sm w-full sm:w-auto shadow-[0_8px_18px_-10px_rgba(1,173,165,0.5)]"
                  >
                    <Share2 className="w-4 h-4" /> Share Article
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 min-w-0">
                <div className="lg:sticky lg:top-24 space-y-5">
                  {/* Author */}
                  <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-soft">
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-400 via-teal-400 to-primary-500 opacity-60" />
                    <p className="font-bold text-neutral-900 text-sm mb-3 flex items-center gap-2">
                      About the Author
                      <svg className="h-3 w-8" viewBox="0 0 40 12" fill="none" aria-hidden="true">
                        <path d="M0 8 H12 L16 3 L20 9 L24 5 L28 8 H40" stroke="rgba(1,173,165,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 4" className="animate-ecg-flow" />
                      </svg>
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-primary-100 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-primary-200">
                        <span className="text-primary-700 font-black text-sm">
                          {post.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm leading-tight">{post.author}</p>
                        <p className="text-xs text-neutral-500">{(post as any).authorRole || post.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Article Info */}
                  <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-soft">
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-60" />
                    <p className="font-bold text-neutral-900 text-sm mb-3 flex items-center gap-2">
                      Article Info
                      <span className="ml-auto text-[10px] font-black tracking-wider text-neutral-300">DATA · 01</span>
                    </p>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center rounded-lg bg-neutral-50/70 px-3 py-2">
                        <span className="text-neutral-500">Reading Time</span>
                        <span className="font-semibold text-neutral-800">{post.readingTime} min</span>
                      </div>
                      <div className="flex justify-between items-center rounded-lg bg-neutral-50/70 px-3 py-2">
                        <span className="text-neutral-500">Category</span>
                        <span className="font-semibold text-neutral-800">{post.category}</span>
                      </div>
                      <div className="flex justify-between items-center rounded-lg bg-neutral-50/70 px-3 py-2">
                        <span className="text-neutral-500">Published</span>
                        <span className="font-semibold text-neutral-800">{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA — clinical ward card */}
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-800 to-primary-950 p-5 text-white shadow-[0_18px_40px_-18px_rgba(0,42,40,0.7)]">
                    <div className="pointer-events-none absolute inset-0 plus-pattern opacity-30" />
                    <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-teal-400/20 blur-2xl" />
                    <svg className="absolute inset-x-3 bottom-1 h-4 w-[calc(100%-1.5rem)] opacity-40" viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M0 12 H60 L68 4 L76 14 L82 8 L88 12 H200" fill="none" stroke="#5de1d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40 10" className="animate-ecg-flow" />
                    </svg>
                    <div className="relative">
                      <p className="font-bold text-sm mb-2">Need a Consultation?</p>
                      <p className="text-primary-200 text-xs mb-4 leading-relaxed">
                        Our specialist team is available 7 days a week.
                      </p>
                      <Link
                        href="/appointments/book"
                        className="block text-center bg-white text-primary-700 font-bold text-xs py-2.5 rounded-xl hover:bg-primary-50 transition-colors shadow-[0_8px_18px_-8px_rgba(1,173,165,0.6)]"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding relative overflow-hidden bg-neutral-50 border-t border-neutral-100">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 plus-pattern-light opacity-40" />
            <div className="absolute -top-24 left-1/3 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
            <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
          </div>
          <div className="relative container-custom">
            <SectionHeader
              align="left"
              eyebrow="Keep Reading"
              title="Related"
              highlight="articles"
              className="mb-8"
            />
            <div className="grid md:grid-cols-3 gap-5">
              {relatedPosts.map((rp, i) => {
                const rArt = CATEGORY_ART[rp.category] || DEFAULT_CATEGORY_ART;
                const RArt = rArt.icon;
                return (
                  <motion.div
                    key={rp.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="h-full"
                  >
                    <Link href={`/blog/${rp.slug}`} className="group block h-full">
                      <div
                        className="h-full overflow-hidden rounded-3xl border border-neutral-200/70 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_50px_-18px_var(--glow)]"
                        style={{ '--glow': rArt.glow } as React.CSSProperties}
                      >
                        {rp.featuredImage && (
                          <div className="relative h-40 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={rp.featuredImage} alt={rp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-transparent" />
                            <svg className="absolute inset-x-0 bottom-0 h-7 w-full" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true">
                              <path d="M0 18 H120 L138 6 L158 22 L176 10 L194 18 H400" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70 18" className="animate-ecg-flow" />
                            </svg>
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm ${rArt.tagBg} ${rArt.tagText}`}>{rp.category}</span>
                            <span className="text-[10px] font-black tracking-wider text-neutral-300">{String(i + 1).padStart(2, '0')}</span>
                          </div>
                          <h3 className="font-bold text-neutral-900 text-sm mt-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{rp.title}</h3>
                          <p className="text-xs text-neutral-500 mt-1">{rp.readingTime} min read</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTAFooter
        title="Need Clinical"
        highlight="Consultation?"
        subtitle="Book an appointment with our specialist team today."
        actions={[
          { label: 'Book Appointment', href: '/appointments/book' },
          { label: 'Read More Articles', href: '/blog' },
        ]}
      />
    </>
  );
}

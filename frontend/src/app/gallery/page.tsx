'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi';
import { PremiumLandingHero } from '@/components/ui/PremiumLandingHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CTAFooter } from '@/components/ui/CTAFooter';
import { get } from '@/lib/api';

const mediaTypes = ['All', 'Images', 'Videos'];

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  folder?: string;
  caption?: string;
  alt?: string;
}

interface PaginatedResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

export default function GalleryPage() {
  const [selectedMediaType, setSelectedMediaType] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load gallery items from database
  useEffect(() => {
    const loadGallery = async () => {
      try {
        setIsLoading(true);
        // Call public API endpoint (no authentication required)
        const response = await get<PaginatedResponse>('media/public');
        setGalleryItems(response.data || []);
      } catch (error) {
        console.error('Failed to load gallery', error);
        // Fallback to empty array if API fails
        setGalleryItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadGallery();
  }, []);

  const filteredItems = galleryItems.filter(item => {
    // Exclude doctor photos from gallery
    if (item.folder === 'doctors') return false;
    
    // Filter by media type only
    if (selectedMediaType === 'All') return true;
    if (selectedMediaType === 'Images') return item.type === 'image';
    if (selectedMediaType === 'Videos') return item.type === 'video';
    return true;
  });

  const currentIndex = selectedItem ? filteredItems.findIndex(item => item.id === selectedItem.id) : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1]);
    }
  };

  return (
    <main className="min-h-screen">
      <PremiumLandingHero
        eyebrow="Clinic Gallery"
        title="See the spaces and"
        highlight="people behind NITA."
        description="Explore clinic facilities, team moments, service visuals, and patient-centered care through our photo and video gallery."
        videoSrc="/videos/hero/clinic-consultation.mp4"
        posterSrc="/videos/hero/clinic-consultation.jpg"
        overlayClassName="from-primary-950/[0.88] via-primary-900/[0.64] to-teal-900/[0.42]"
        actions={[
          { label: 'View Gallery', href: '#gallery' },
          { label: 'Visit Contact Page', href: '/contact', variant: 'secondary' },
        ]}
        trustPoints={[
          'Clinic facilities and service spaces',
          'Photos and videos in one view',
          'Simple media filtering',
          'Fullscreen gallery preview',
        ]}
        stats={[
          { value: isLoading ? '…' : String(filteredItems.length), label: 'Gallery Items' },
          { value: 'Photo', label: 'Facility Views' },
          { value: 'Video', label: 'Clinic Moments' },
        ]}
        panelEyebrow="Gallery Flow"
        panelTitle="A visual look before you visit."
        panelItems={[
          'Filter media by photos, videos, or all clinic content.',
          'Open any gallery item in a focused preview.',
          'Use the gallery to understand the clinic environment before arrival.',
        ]}
      />

      {/* Filter Tabs */}
      <section id="gallery" className="sticky top-20 z-30 border-b border-neutral-200/60 bg-white/85 py-6 backdrop-blur-xl scroll-mt-24">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center">
            {mediaTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMediaType(type)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedMediaType === type
                    ? 'bg-primary-600 text-white shadow-[0_8px_20px_-8px_rgba(1,173,165,0.7)]'
                    : 'bg-white text-neutral-600 border border-neutral-200/70 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                {type}
                {selectedMediaType === type && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding relative overflow-hidden bg-neutral-50">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 plus-pattern-light opacity-40" />
          <div className="absolute -top-24 left-1/4 h-72 w-96 rounded-full bg-primary-50 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-64 w-80 rounded-full bg-emerald-50/60 blur-3xl" />
        </div>
        <div className="relative container-custom">
          <SectionHeader
            eyebrow="Clinic Gallery"
            title="Explore the"
            highlight="NITA spaces"
            subtitle="Facilities, team moments, and patient-centered care — in one visual gallery."
            className="mb-12"
          />
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-3" />
              <p className="text-neutral-500">Loading gallery...</p>
            </div>
          ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-primary-200/70 hover:shadow-[0_24px_50px_-18px_rgba(1,173,165,0.4)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
                      {item.type === 'image' ? (
                        <Image
                          src={item.url}
                          alt={item.alt || ''}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <>
                          {/* Video thumbnail */}
                          <video
                            src={item.url}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            preload="metadata"
                          />
                          {/* Video Play Icon Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_14px_30px_-10px_rgba(1,173,165,0.6)]">
                              <FiPlay className="w-7 h-7 text-primary-600 ml-1" />
                            </div>
                          </div>
                        </>
                      )}
                      {/* gradient overlay + ECG trace */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-transparent" />
                      <svg className="absolute inset-x-0 bottom-0 h-7 w-full" viewBox="0 0 400 28" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M0 18 H120 L138 6 L158 22 L176 10 L194 18 H400" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70 18" className="animate-ecg-flow" />
                      </svg>
                      {/* ward number */}
                      <span className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white backdrop-blur-md ring-1 ring-white/30">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {item.caption && (
                        <span className="absolute inset-x-3 bottom-2 line-clamp-1 text-[11px] font-medium text-white/90">
                          {item.caption}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTAFooter
        title="Want to see it"
        highlight="in person?"
        subtitle="Visit the NITA Clinic team, tour the facilities, and meet our care staff."
        actions={[
          { label: 'Book Appointment', href: '/appointments/book' },
          { label: 'Visit Contact Page', href: '/contact' },
        ]}
      />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
            >
              <FiX className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
              >
                <FiChevronLeft className="w-10 h-10" />
              </button>
            )}
            {currentIndex < filteredItems.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 z-10"
              >
                <FiChevronRight className="w-10 h-10" />
              </button>
            )}

            {/* Content */}
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'image' ? (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.alt || ''}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <video
                    src={selectedItem.url}
                    className="w-full h-full"
                    controls
                    autoPlay
                  >
                    <source src={selectedItem.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

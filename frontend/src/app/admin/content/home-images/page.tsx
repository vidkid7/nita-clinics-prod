'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiImage, FiUpload, FiInfo } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { get, getErrorMessage, uploadFile } from '@/lib/api';
import { mergeContentSection } from '@/lib/content-section';
import { DEFAULT_HERO, DEFAULT_ABOUT } from '@/lib/home-page-content';
import Image from 'next/image';

type SlotId = 'hero' | 'why-main' | 'why-accent';

function pickHeroImageUrl(content: Record<string, unknown> | undefined): string {
  if (!content) return DEFAULT_HERO.backgroundImage;
  if (typeof content.backgroundImage === 'string' && content.backgroundImage) return content.backgroundImage;
  if (typeof content.imagePath === 'string' && content.imagePath) return content.imagePath;
  const imgs = content.images;
  if (Array.isArray(imgs) && typeof imgs[0] === 'string') return imgs[0];
  return DEFAULT_HERO.backgroundImage;
}

function pickWhyImages(content: Record<string, unknown> | undefined): [string, string] {
  if (!content) return [...DEFAULT_ABOUT.imagePaths] as [string, string];
  const paths = Array.isArray(content.imagePaths)
    ? (content.imagePaths as unknown[]).filter((x): x is string => typeof x === 'string')
    : [];
  if (paths.length >= 2) return [paths[0], paths[1]];
  if (paths.length === 1) return [paths[0], DEFAULT_ABOUT.imagePaths[1]];
  if (typeof content.imagePath === 'string' && content.imagePath) {
    return [content.imagePath, DEFAULT_ABOUT.imagePaths[1]];
  }
  return [...DEFAULT_ABOUT.imagePaths] as [string, string];
}

export default function HomeImagesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<SlotId | null>(null);

  const [heroUrl, setHeroUrl] = useState(DEFAULT_HERO.backgroundImage);
  const [whyMainUrl, setWhyMainUrl] = useState(DEFAULT_ABOUT.imagePaths[0]);
  const [whyAccentUrl, setWhyAccentUrl] = useState(DEFAULT_ABOUT.imagePaths[1]);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const [heroRes, aboutRes] = await Promise.all([
        get<{ content?: Record<string, unknown> }>('content/page/home/hero').catch(() => null),
        get<{ content?: Record<string, unknown> }>('content/page/home/about').catch(() => null),
      ]);
      setHeroUrl(pickHeroImageUrl(heroRes?.content));
      const [m, a] = pickWhyImages(aboutRes?.content);
      setWhyMainUrl(m);
      setWhyAccentUrl(a);
    } catch (error) {
      console.error('Failed to load images', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const runUpload = async (file: File, slot: SlotId) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const folder =
      slot === 'hero'
        ? 'home-hero'
        : slot === 'why-main'
          ? 'home-why-nita-main'
          : 'home-why-nita-accent';

    setIsUploading(slot);
    try {
      const { url } = await uploadFile('media/upload', file, undefined, folder);
      if (!url) throw new Error('No URL returned from upload');

      if (slot === 'hero') {
        setHeroUrl(url);
        await mergeContentSection('home', 'hero', {
          backgroundImage: url,
          imagePath: url,
        });
      } else {
        const aboutData = await get<{ content?: Record<string, unknown> }>('content/page/home/about').catch(
          () => null,
        );
        const current = pickWhyImages(aboutData?.content);
        const next: [string, string] =
          slot === 'why-main' ? [url, current[1]] : [current[0], url];
        setWhyMainUrl(next[0]);
        setWhyAccentUrl(next[1]);
        await mergeContentSection('home', 'about', {
          imagePaths: [next[0], next[1]],
          imagePath: next[0],
        });
      }

      toast.success('Image uploaded to Cloudinary and saved');
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error) || 'Upload failed');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await mergeContentSection('home', 'hero', {
        backgroundImage: heroUrl,
        imagePath: heroUrl,
      });
      await mergeContentSection('home', 'about', {
        imagePaths: [whyMainUrl, whyAccentUrl],
        imagePath: whyMainUrl,
      });
      toast.success('Home page images saved');
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error) || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const ImageCard = ({
    title,
    description,
    url,
    slot,
    aspectClass = 'aspect-video',
  }: {
    title: string;
    description: string;
    url: string;
    slot: SlotId;
    aspectClass?: string;
  }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    return (
      <div className="bg-white rounded-xl shadow-soft p-6 border border-neutral-100">
        <h3 className="font-heading font-semibold text-neutral-900 mb-2">{title}</h3>
        <p className="text-sm text-neutral-600 mb-4">{description}</p>
        <div className={`relative ${aspectClass} rounded-lg overflow-hidden bg-neutral-100 mb-4`}>
          <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) runUpload(file, slot);
            e.target.value = '';
          }}
          disabled={isUploading === slot}
        />
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading === slot}
          isLoading={isUploading === slot}
        >
          <FiUpload className="w-4 h-4 mr-2" />
          {isUploading === slot ? 'Uploading…' : 'Upload image'}
        </Button>
        <p className="text-xs text-neutral-500 mt-2">JPG / PNG / WebP · max 5MB · stored in Cloudinary</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Home page images</h1>
          <p className="text-neutral-600 mt-1">
            Matches the current Nita Clinic homepage layout — not the old multi-slide hero.
          </p>
        </div>
        <Button onClick={handleSaveAll} isLoading={isSaving} variant="secondary">
          <FiSave className="w-4 h-4 mr-2" />
          Save URLs
        </Button>
      </div>

      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex gap-3">
        <FiInfo className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-primary-900">
          <p className="font-medium mb-1">Cloudinary</p>
          <p>
            Uploads go to your Cloudinary account (folder <code className="text-xs bg-white/80 px-1 rounded">nita-clinics/images/…</code>
            ). Hero copy and headings are edited under{' '}
            <a href="/admin/content" className="underline font-medium">
              Content Management
            </a>
            ; this page only sets which photos appear on the home hero and &ldquo;Why NITA&rdquo; section.
          </p>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-heading font-semibold text-neutral-900 flex items-center gap-2">
          <FiImage className="w-5 h-5 text-primary-600" />
          Hero — right panel photo
        </h2>
        <p className="text-sm text-neutral-600 max-w-3xl">
          Large image beside the headline on desktop (same field as <strong>Background image</strong> in Content → Hero).
          One image only — the site does not use a rotating slider.
        </p>
        <div className="max-w-lg">
          <ImageCard
            title="Hero image"
            description="Portrait-friendly (about 4:5). Shown on large screens next to the hero text."
            url={heroUrl}
            slot="hero"
            aspectClass="aspect-[4/5] max-h-[420px]"
          />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-heading font-semibold text-neutral-900 flex items-center gap-2">
          <FiImage className="w-5 h-5 text-primary-600" />
          Why NITA — photo column
        </h2>
        <p className="text-sm text-neutral-600 max-w-3xl">
          Two images: the tall main photo and the small accent on the right. They map to the &ldquo;Why Choose NITA&rdquo; block on the homepage.
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <ImageCard
            title="Main photo"
            description="Large rounded image (lab / facility / team)."
            url={whyMainUrl}
            slot="why-main"
            aspectClass="aspect-[4/5]"
          />
          <ImageCard
            title="Accent thumbnail"
            description="Small square on the side (e.g. consultation). Optional but recommended."
            url={whyAccentUrl}
            slot="why-accent"
            aspectClass="aspect-square max-w-[280px]"
          />
        </div>
      </motion.section>

    </div>
  );
}

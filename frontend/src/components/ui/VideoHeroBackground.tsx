'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type VideoHeroBackgroundProps = {
  src: string;
  poster: string;
  overlayClassName?: string;
  className?: string;
};

export function VideoHeroBackground({
  src,
  poster,
  overlayClassName,
  className,
}: VideoHeroBackgroundProps) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Autoplay on every screen size (mobile, tablet, desktop).
  // Respects prefers-reduced-motion by showing the poster instead.
  const showVideo = !reduceMotion;

  // Detect playback with a native listener. The video can autoplay from SSR
  // HTML before React hydrates, so React's synthetic onPlay may never fire —
  // also handle the already-playing case so the poster reliably fades out.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;
    const markPlaying = () => setVideoPlaying(true);
    video.addEventListener('play', markPlaying);
    if (!video.paused) setVideoPlaying(true);
    return () => video.removeEventListener('play', markPlaying);
  }, [showVideo]);

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', maxWidth: '100vw' }}
      aria-hidden="true"
    >
      {/* Static poster image — always visible, instant paint */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
          videoPlaying && showVideo ? 'opacity-0' : 'opacity-100'
        )}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', maxWidth: 'none' }}
        fetchPriority="high"
      />

      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.03] object-cover saturate-[1.05] contrast-[1.03]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            maxWidth: 'none',
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Readability overlay — sits above the poster/video, below content */}
      {overlayClassName && (
        <div
          className={cn('pointer-events-none absolute inset-0 bg-gradient-to-b', overlayClassName)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

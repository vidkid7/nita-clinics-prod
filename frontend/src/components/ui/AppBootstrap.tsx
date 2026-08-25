'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BrandLoader } from './BrandLoader';
import { WelcomeAdModal } from './WelcomeAdModal';

/**
 * Mounts the brand-themed full-screen loader on first paint and removes it
 * after the page has finished its initial hydration. The two-step welcome ads
 * are revealed *at the same instant* the loader starts fading out, so the ads
 * appear seamlessly during the loader's fade-off (no after-the-fact modal).
 * The welcome ad is shown once per full public page load (including a hard
 * refresh), does not reopen during client-side navigation, and never appears
 * inside admin.
 */
export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const initialPathname = useRef(pathname);
  const dismissAds = useCallback(() => setShowAds(false), []);

  useEffect(() => {
    // Wait for two animation frames + a small delay so the hero / chrome
    // have a chance to render, then fade the loader into the welcome ads.
    const shouldShowAds = !initialPathname.current?.startsWith('/admin');

    const t = window.setTimeout(() => {
      setReady(true);
      setShowAds(shouldShowAds && !window.location.pathname.startsWith('/admin'));
    }, 700);
    return () => {
      window.clearTimeout(t);
    };
  }, []);

  // The root layout stays mounted during Next client-side navigation. Hide
  // the public ad immediately if the user enters any admin route.
  useEffect(() => {
    if (pathname?.startsWith('/admin')) setShowAds(false);
  }, [pathname]);

  return (
    <>
      <BrandLoader done={ready} />
      <WelcomeAdModal visible={showAds} onDismiss={dismissAds} />
      {children}
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  fetchHomePageContent,
  type HomePageContentBundle,
} from '@/lib/home-page-content';

export function useHomePageContent() {
  const [data, setData] = useState<HomePageContentBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchHomePageContent()
      .then((bundle) => {
        if (!cancelled) setData(bundle);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}

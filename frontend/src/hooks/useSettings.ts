import { useState, useEffect } from 'react';
import { get } from '@/lib/api';

const DEFAULT_LOGO = '/images/nita-clinics-logo.png';

function normalizeSiteName(value?: string) {
  return value?.replace(/\bNita Clinics\b/gi, 'Nita Clinic') || 'Nita Clinic';
}

interface Settings {
  logo?: string;
  favicon?: string;
  siteName?: string;
  [key: string]: string | undefined;
}

let cachedSettings: Settings | null = null;
let fetchPromise: Promise<Settings> | null = null;

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(cachedSettings || {
    logo: DEFAULT_LOGO,
    favicon: DEFAULT_LOGO,
    siteName: 'Nita Clinic',
  });
  const [isLoading, setIsLoading] = useState(!cachedSettings);

  useEffect(() => {
    const loadSettings = async () => {
      // If already cached, use cache
      if (cachedSettings) {
        setSettings(cachedSettings);
        setIsLoading(false);
        return;
      }

      // If already fetching, wait for that promise
      if (fetchPromise) {
        try {
          const data = await fetchPromise;
          setSettings(data);
        } catch (error) {
          console.error('Failed to load settings', error);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Start new fetch
      setIsLoading(true);
      fetchPromise = get<Settings>('settings/object')
        .then((data) => {
          cachedSettings = {
            logo: data.logo || DEFAULT_LOGO,
            favicon: data.favicon || DEFAULT_LOGO,
            ...data,
            siteName: normalizeSiteName(data.siteName),
          };
          return cachedSettings;
        })
        .catch((error) => {
          console.error('Failed to load settings', error);
          return {
            logo: DEFAULT_LOGO,
            favicon: DEFAULT_LOGO,
            siteName: 'Nita Clinic',
          };
        })
        .finally(() => {
          fetchPromise = null;
        });

      try {
        const data = await fetchPromise;
        setSettings(data);
      } catch (error) {
        // Error already handled above
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { settings, isLoading };
}

// Function to clear cache when settings are updated
export function clearSettingsCache() {
  cachedSettings = null;
}

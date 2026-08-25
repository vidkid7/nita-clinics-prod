'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { get, getErrorMessage, post } from '@/lib/api';

type SeoForm = {
  site_title: string;
  site_tagline: string;
  meta_description: string;
  ga_id: string;
  google_verification: string;
  fb_pixel_id: string;
  og_image_url: string;
  robots_txt: string;
};

const defaults: SeoForm = {
  site_title: 'Nita Clinic',
  site_tagline: 'Your Trusted Healthcare Partner',
  meta_description: '',
  ga_id: '',
  google_verification: '',
  fb_pixel_id: '',
  og_image_url: '',
  robots_txt: 'User-agent: *\nAllow: /',
};

export default function AdminSeoSettingsPage() {
  const [form, setForm] = useState<SeoForm>(defaults);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await get<Record<string, string>>('settings/object');
        setForm((prev) => ({ ...prev, ...(data as Partial<SeoForm>) }));
      } catch {
        // keep defaults
      }
    };
    load();
  }, []);

  const setValue = (key: keyof SeoForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await post('settings/bulk', {
        settings: Object.entries(form).map(([key, value]) => ({
          key,
          value,
          category: 'seo',
        })),
      });
      toast.success('SEO settings saved');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-neutral-900">SEO Settings</h1>
        <p className="text-neutral-600">Manage metadata and verification values.</p>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
        <Input label="Site Title" value={form.site_title} onChange={(e) => setValue('site_title', e.target.value)} />
        <Input label="Site Tagline" value={form.site_tagline} onChange={(e) => setValue('site_tagline', e.target.value)} />
        <Textarea
          label={`Homepage Meta Description (${form.meta_description.length}/160)`}
          rows={3}
          value={form.meta_description}
          onChange={(e) => setValue('meta_description', e.target.value.slice(0, 160))}
        />
        <Input label="Google Analytics ID" value={form.ga_id} onChange={(e) => setValue('ga_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
        <Input label="Google Verification" value={form.google_verification} onChange={(e) => setValue('google_verification', e.target.value)} />
        <Input label="Facebook Pixel ID" value={form.fb_pixel_id} onChange={(e) => setValue('fb_pixel_id', e.target.value)} />
        <Input label="OG Image URL" value={form.og_image_url} onChange={(e) => setValue('og_image_url', e.target.value)} />
        <Textarea label="Robots.txt content" rows={6} value={form.robots_txt} onChange={(e) => setValue('robots_txt', e.target.value)} />

        <Button onClick={save} isLoading={saving}>Save SEO Settings</Button>
      </div>
    </main>
  );
}


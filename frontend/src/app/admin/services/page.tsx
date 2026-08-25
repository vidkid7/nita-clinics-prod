'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { get, post, getErrorMessage } from '@/lib/api';
import { clearSettingsCache } from '@/hooks/useSettings';
import {
  HOME_SERVICES_DEFAULT,
  type HomeServicesBlock,
  type HomeServiceItem,
  type HomeServiceIconKey,
  type HomeServiceColorKey,
} from '@/lib/home-services-data';

const ICON_OPTIONS: { value: HomeServiceIconKey; label: string }[] = [
  { value: 'microscope', label: 'Microscope (labs)' },
  { value: 'female', label: 'Female (gynecology / womens health)' },
  { value: 'heartbeat', label: 'Heartbeat (wellness)' },
  { value: 'creditCard', label: 'Card (membership)' },
  { value: 'xray', label: 'X-ray (imaging)' },
  { value: 'syringe', label: 'Syringe (vaccination)' },
];

const COLOR_OPTIONS: { value: HomeServiceColorKey; label: string }[] = [
  { value: 'primary', label: 'Teal / primary' },
  { value: 'rose', label: 'Rose' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'sky', label: 'Sky / indigo' },
  { value: 'amber', label: 'Amber' },
  { value: 'indigo', label: 'Indigo / violet' },
];

const emptyItem = (): HomeServiceItem => ({
  iconKey: 'microscope',
  colorKey: 'primary',
  title: 'New service',
  desc: '',
  href: '/',
  tag: 'Service',
});

export default function AdminHomeServicesPage() {
  const [block, setBlock] = useState<HomeServicesBlock>(HOME_SERVICES_DEFAULT);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const obj = await get<Record<string, string>>('settings/object');
      const raw = obj?.home_services;
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw) as HomeServicesBlock;
        if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setBlock({
            badge: parsed.badge || HOME_SERVICES_DEFAULT.badge,
            heading: parsed.heading || HOME_SERVICES_DEFAULT.heading,
            subheading: parsed.subheading || HOME_SERVICES_DEFAULT.subheading,
            items: parsed.items.map((it, i) => ({ ...emptyItem(), ...it, title: it.title || `Service ${i + 1}` })),
          });
        } else {
          setBlock(HOME_SERVICES_DEFAULT);
        }
      } else {
        setBlock(HOME_SERVICES_DEFAULT);
      }
    } catch (e) {
      console.error(e);
      toast.error(getErrorMessage(e) || 'Failed to load home services');
      setBlock(HOME_SERVICES_DEFAULT);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    try {
      await post('settings', {
        key: 'home_services',
        value: JSON.stringify(block),
        category: 'homepage',
        description: 'Home page “Our Services” section (JSON)',
      });
      clearSettingsCache();
      toast.success('Home page services saved');
    } catch (e) {
      toast.error(getErrorMessage(e) || 'Save failed');
    }
  };

  const updateItem = (index: number, patch: Partial<HomeServiceItem>) => {
    setBlock((prev) => ({
      ...prev,
      items: prev.items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    }));
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= block.items.length) return;
    setBlock((prev) => {
      const items = [...prev.items];
      [items[index], items[next]] = [items[next], items[index]];
      return { ...prev, items };
    });
  };

  const remove = (index: number) => {
    if (!window.confirm('Remove this card from the home page?')) return;
    setBlock((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-8 text-neutral-500">Loading…</div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-neutral-900">Home page services</h1>
        <p className="text-neutral-600 mt-1 text-sm">
          Controls the <strong>Our Services</strong> section on the homepage only. There is no separate public
          services listing page.
        </p>
      </div>

      <section className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-neutral-900">Section heading</h2>
        <Input
          label="Badge"
          value={block.badge}
          onChange={(e) => setBlock((b) => ({ ...b, badge: e.target.value }))}
        />
        <Input
          label="Title"
          value={block.heading}
          onChange={(e) => setBlock((b) => ({ ...b, heading: e.target.value }))}
        />
        <Textarea
          label="Subtitle"
          value={block.subheading}
          onChange={(e) => setBlock((b) => ({ ...b, subheading: e.target.value }))}
          rows={3}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Service cards</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setBlock((b) => ({ ...b, items: [...b.items, emptyItem()] }))}
          >
            <FiPlus className="w-4 h-4 mr-1" />
            Add card
          </Button>
        </div>

        {block.items.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-neutral-500">Card {index + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
                  title="Move up"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                >
                  <FiChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
                  title="Move down"
                  onClick={() => move(index, 1)}
                  disabled={index === block.items.length - 1}
                >
                  <FiChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                  title="Remove"
                  onClick={() => remove(index)}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="Title"
                value={item.title}
                onChange={(e) => updateItem(index, { title: e.target.value })}
              />
              <Input
                label="Link (path)"
                placeholder="/services/laboratory"
                value={item.href}
                onChange={(e) => updateItem(index, { href: e.target.value })}
              />
            </div>
            <Textarea
              label="Description"
              value={item.desc}
              onChange={(e) => updateItem(index, { desc: e.target.value })}
              rows={3}
            />
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="Tag (small label)"
                value={item.tag}
                onChange={(e) => updateItem(index, { tag: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Icon</label>
                <select
                  className="input w-full"
                  value={item.iconKey}
                  onChange={(e) => updateItem(index, { iconKey: e.target.value as HomeServiceIconKey })}
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Color theme</label>
              <select
                className="input w-full max-w-md"
                value={item.colorKey}
                onChange={(e) => updateItem(index, { colorKey: e.target.value as HomeServiceColorKey })}
              >
                {COLOR_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </section>

      <div className="flex gap-3 pb-8">
        <Button onClick={save}>Save to homepage</Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (window.confirm('Reset editor to built-in defaults (does not save until you click Save)?')) {
              setBlock(HOME_SERVICES_DEFAULT);
            }
          }}
        >
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}

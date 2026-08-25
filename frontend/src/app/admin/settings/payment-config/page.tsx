'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { get, getErrorMessage, patch } from '@/lib/api';
import { Button } from '@/components/ui/Button';

type PaymentSettings = {
  payment_esewa_enabled?: string;
  payment_khalti_enabled?: string;
  payment_fonepay_enabled?: string;
  payment_sandbox_mode?: string;
};

export default function PaymentConfigPage() {
  const [settings, setSettings] = useState<PaymentSettings>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await get<PaymentSettings>('payments/settings');
      setSettings(data || {});
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (next: PaymentSettings) => {
    setSaving(true);
    try {
      await patch('payments/settings', {
        esewaEnabled: next.payment_esewa_enabled === 'true',
        khaltiEnabled: next.payment_khalti_enabled === 'true',
        fonepayEnabled: next.payment_fonepay_enabled === 'true',
        sandboxMode: next.payment_sandbox_mode !== 'false',
      });
      toast.success('Payment settings updated');
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key: keyof PaymentSettings) => {
    const next = {
      ...settings,
      [key]: settings[key] === 'true' ? 'false' : 'true',
    };
    setSettings(next);
    update(next);
  };

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-neutral-900">Payment Config</h1>
        <p className="text-neutral-600">Enable or disable payment gateways and sandbox mode.</p>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
        <ToggleRow
          title="eSewa"
          enabled={settings.payment_esewa_enabled === 'true'}
          onToggle={() => toggle('payment_esewa_enabled')}
        />
        <ToggleRow
          title="Khalti"
          enabled={settings.payment_khalti_enabled === 'true'}
          onToggle={() => toggle('payment_khalti_enabled')}
        />
        <ToggleRow
          title="FonePay"
          enabled={settings.payment_fonepay_enabled === 'true'}
          onToggle={() => toggle('payment_fonepay_enabled')}
        />
        <ToggleRow
          title="Sandbox Mode"
          enabled={settings.payment_sandbox_mode !== 'false'}
          onToggle={() => toggle('payment_sandbox_mode')}
        />

        {saving && (
          <div className="text-sm text-neutral-500">Updating settings...</div>
        )}
      </div>
    </main>
  );
}

function ToggleRow({
  title,
  enabled,
  onToggle,
}: {
  title: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between border border-neutral-200 rounded-lg p-4">
      <div>
        <p className="font-medium text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-500">{enabled ? 'Enabled' : 'Disabled'}</p>
      </div>
      <Button variant={enabled ? 'primary' : 'secondary'} onClick={onToggle}>
        {enabled ? 'Disable' : 'Enable'}
      </Button>
    </div>
  );
}


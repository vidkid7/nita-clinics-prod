'use client';

import { useEffect, useState } from 'react';
import { get, patch } from '@/lib/api';
import { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

interface PaymentTransaction {
  id: string;
  reference: string;
  gateway: string;
  amount: number;
  status: string;
  purpose: string;
  createdAt: string;
}

interface PaymentSettings {
  payment_esewa_enabled?: string;
  payment_khalti_enabled?: string;
  payment_fonepay_enabled?: string;
  payment_sandbox_mode?: string;
  payment_default_currency?: string;
}

export default function AdminPaymentsPage() {
  const [settings, setSettings] = useState<PaymentSettings>({});
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  const loadData = async () => {
    try {
      const [settingResponse, transactionResponse] = await Promise.all([
        get<PaymentSettings>('payments/settings'),
        get<PaymentTransaction[]>('payments/transactions', { params: { limit: 100 } }),
      ]);
      setSettings(settingResponse || {});
      setTransactions(transactionResponse || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateSetting = async (key: string, enabled: boolean) => {
    const payload: Record<string, boolean> = {
      esewaEnabled: key === 'esewa' ? enabled : settings.payment_esewa_enabled === 'true',
      khaltiEnabled: key === 'khalti' ? enabled : settings.payment_khalti_enabled === 'true',
      fonepayEnabled: key === 'fonepay' ? enabled : settings.payment_fonepay_enabled === 'true',
      sandboxMode: settings.payment_sandbox_mode !== 'false',
    };

    try {
      await patch('payments/settings', payload);
      toast.success('Payment settings updated');
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-semibold text-neutral-900">Payments</h1>

      <section className="bg-white border border-neutral-200 rounded-xl p-5">
        <h2 className="text-lg font-medium mb-4">Gateway Settings</h2>
        <div className="space-y-3">
          {[
            { key: 'esewa', label: 'eSewa', value: settings.payment_esewa_enabled === 'true' },
            { key: 'khalti', label: 'Khalti', value: settings.payment_khalti_enabled === 'true' },
            { key: 'fonepay', label: 'Fonepay', value: settings.payment_fonepay_enabled === 'true' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between border border-neutral-200 rounded-lg px-4 py-3">
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={item.value}
                onChange={(e) => updateSetting(item.key, e.target.checked)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white border border-neutral-200 rounded-xl p-5">
        <h2 className="text-lg font-medium mb-4">Transaction Log</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Reference</th>
                <th className="py-2 pr-4">Gateway</th>
                <th className="py-2 pr-4">Purpose</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="py-2 pr-4">{tx.reference}</td>
                  <td className="py-2 pr-4 capitalize">{tx.gateway}</td>
                  <td className="py-2 pr-4 capitalize">{tx.purpose}</td>
                  <td className="py-2 pr-4">NPR {tx.amount}</td>
                  <td className="py-2 pr-4 capitalize">{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

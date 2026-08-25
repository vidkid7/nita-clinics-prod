'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { get, getErrorMessage } from '@/lib/api';

type IssuedCard = {
  id: string;
  fullName: string;
  holderType: string;
  cardNumber: string;
  validUntil?: string;
  createdAt: string;
};

export default function IssuedHealthCardsPage() {
  const [rows, setRows] = useState<IssuedCard[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await get<IssuedCard[]>('health-card/applications/admin', {
          params: { status: 'approved' },
        });
        setRows(data || []);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };
    load();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-4">Issued Health Cards</h1>
      <div className="overflow-x-auto bg-white rounded-xl border border-neutral-200">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left">Card Number</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Valid Until</th>
              <th className="px-4 py-3 text-left">Issued Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-semibold text-primary-700">{row.cardNumber}</td>
                <td className="px-4 py-3">{row.fullName}</td>
                <td className="px-4 py-3">{row.holderType}</td>
                <td className="px-4 py-3">
                  {row.validUntil ? new Date(row.validUntil).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3">{new Date(row.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


'use client';

import Image from 'next/image';

interface PartnerItem {
  id: string;
  name: string;
  logoUrl?: string;
  alt?: string;
  url: string;
}

interface PartnerGridProps {
  partners: PartnerItem[];
}

export function PartnerGrid({ partners }: PartnerGridProps) {
  if (!partners.length) {
    return (
      <div className="text-center py-10 border border-dashed border-neutral-300 rounded-xl text-neutral-500">
        Partner listings will be published shortly.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {partners.map((partner) => (
        <a
          key={partner.id}
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border border-neutral-200 p-4 flex flex-col items-center justify-center min-h-28 hover:border-primary-300 transition-colors"
        >
          <div className="relative w-full h-12">
            {partner.logoUrl ? (
              <Image
                src={partner.logoUrl}
                alt={partner.alt || partner.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm text-center">
                {partner.name}
              </div>
            )}
          </div>
          <p className="text-xs text-neutral-600 mt-3 text-center">{partner.name}</p>
        </a>
      ))}
    </div>
  );
}

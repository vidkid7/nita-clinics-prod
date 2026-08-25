'use client';

interface CategoryBenefitCardProps {
  name: string;
  opdDiscount?: string;
  labDiscount?: string;
  medicineDiscount?: string;
  queueBenefit?: string;
  notes?: string;
  price?: number;
}

export function CategoryBenefitCard({
  name,
  opdDiscount,
  labDiscount,
  medicineDiscount,
  queueBenefit,
  notes,
  price,
}: CategoryBenefitCardProps) {
  return (
    <article className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-soft">
      <h3 className="text-xl font-heading font-semibold text-neutral-900">{name}</h3>
      {typeof price === 'number' && (
        <p className="text-primary-700 font-semibold mt-2">Membership: NPR {price}</p>
      )}
      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
        <li>OPD Discount: {opdDiscount || 'N/A'}</li>
        <li>Lab Tests Discount: {labDiscount || 'N/A'}</li>
        <li>Medicines Discount: {medicineDiscount || 'N/A'}</li>
        <li>Priority Access: {queueBenefit || 'Standard queue'}</li>
      </ul>
      {notes && <p className="text-sm text-neutral-500 mt-3">{notes}</p>}
    </article>
  );
}

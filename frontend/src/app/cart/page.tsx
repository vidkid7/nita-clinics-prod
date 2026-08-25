'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FiShoppingCart, FiTrash2, FiCreditCard, FiCalendar } from 'react-icons/fi';
import { CartItem, getCartItems, getCartTotals, removeFromCart } from '@/lib/cart';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  const totals = useMemo(() => getCartTotals(items), [items]);
  const checkoutLink = `/payment/checkout?amount=${totals.amount}&productName=${encodeURIComponent(
    'Health Packages Cart'
  )}&purpose=cart&fromCart=1`;

  const handleRemove = (id: string) => {
    setItems(removeFromCart(id));
  };

  return (
    <main>
      <section className="py-16 bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">Your Cart</h1>
          <p className="text-primary-100 mt-4 max-w-3xl">
            Review your selected health packages and continue to secure payment.
          </p>
        </div>
      </section>

      <section className="section-padding bg-neutral-50">
        <div className="container-custom max-w-5xl">
          {items.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-10 text-center">
              <FiShoppingCart className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
              <h2 className="text-xl font-heading font-semibold text-neutral-900">Your cart is empty</h2>
              <p className="text-neutral-600 mt-2">
                Browse check-up packages and add items to cart.
              </p>
              <Link href="/checkup/packages" className="btn-primary mt-6 inline-flex">
                Explore Packages
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-start justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{item.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1">
                        {item.category || 'Health Package'} x {item.quantity}
                      </p>
                      <p className="text-primary-700 font-bold mt-3">
                        NPR {(item.amount * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </article>
                ))}
              </div>

              <aside className="bg-white border border-neutral-200 rounded-2xl p-5 h-fit">
                <h3 className="font-heading text-lg font-semibold text-neutral-900">Order Summary</h3>
                <div className="mt-4 space-y-2 text-sm text-neutral-600">
                  <p className="flex justify-between">
                    <span>Total items</span>
                    <span>{totals.count}</span>
                  </p>
                  <p className="flex justify-between text-base font-semibold text-neutral-900 pt-2 border-t border-neutral-100">
                    <span>Total amount</span>
                    <span>NPR {totals.amount.toLocaleString()}</span>
                  </p>
                </div>
                <Link href={checkoutLink} className="btn-primary w-full mt-6 justify-center">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  Request Booking
                </Link>
                <p className="text-xs text-neutral-500 mt-3">
                  Submit a request — our team will call you within 24 hours to confirm.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

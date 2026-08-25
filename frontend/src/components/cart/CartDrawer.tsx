'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiCreditCard } from 'react-icons/fi';
import { CartItem, getCartItems, getCartTotals, removeFromCart, setCartItems } from '@/lib/cart';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (open) setItems(getCartItems());
  }, [open]);

  const totals = useMemo(() => getCartTotals(items), [items]);
  const checkoutHref = `/payment/checkout?amount=${totals.amount}&productName=${encodeURIComponent('Health Packages')}&purpose=cart&fromCart=1`;

  const updateQty = (id: string, delta: number) => {
    const updated = items
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updated);
    setItems(updated);
  };

  const handleRemove = (id: string) => {
    setItems(removeFromCart(id));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <FiShoppingCart className="w-5 h-5 text-primary-600" />
                <h2 className="font-heading font-semibold text-neutral-900">
                  Cart
                  {totals.count > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold">
                      {totals.count}
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
                aria-label="Close cart"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <FiShoppingCart className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="font-semibold text-neutral-700">Your cart is empty</p>
                  <p className="text-sm text-neutral-500 mt-1 mb-5">
                    Browse packages and add items to cart.
                  </p>
                  <Link
                    href="/checkup/packages"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                  >
                    Explore Packages
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 p-3 rounded-xl border border-neutral-100 bg-neutral-50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-neutral-900 line-clamp-2 leading-snug">
                          {item.name}
                        </p>
                        {item.category && (
                          <p className="text-xs text-neutral-500 mt-0.5 capitalize">
                            {item.category.replace(/_/g, ' ')}
                          </p>
                        )}
                        <p className="text-primary-700 font-bold text-sm mt-1.5">
                          NPR {(item.amount * item.quantity).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-6 h-6 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-6 h-6 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="flex-shrink-0 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-100 px-5 py-4 space-y-3">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Subtotal ({totals.count} item{totals.count !== 1 ? 's' : ''})</span>
                  <span className="font-bold text-neutral-900">NPR {totals.amount.toLocaleString()}</span>
                </div>
                <Link
                  href={checkoutHref}
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors"
                >
                  <FiCreditCard className="w-4 h-4" />
                  Proceed to Payment
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-2 border border-neutral-200 text-neutral-700 font-medium py-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-sm"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function CartIconButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      const items = getCartItems();
      setCount(items.reduce((s, i) => s + i.quantity, 0));
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('cart-updated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('cart-updated', sync);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className || 'relative p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors'}
        aria-label={`Shopping cart${count > 0 ? `, ${count} items` : ''}`}
      >
        <FiShoppingCart className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-600 text-white text-[9px] font-bold flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

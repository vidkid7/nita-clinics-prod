'use client';

export type CartItem = {
  id: string;
  name: string;
  category?: string;
  amount: number;
  quantity: number;
};

const CART_KEY = 'nita_cart_items';

function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

export function getCartItems(): CartItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function setCartItems(items: CartItem[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, 'quantity'>): CartItem[] {
  const current = getCartItems();
  const existing = current.find((cartItem) => cartItem.id === item.id);
  if (existing) {
    const updated = current.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    setCartItems(updated);
    return updated;
  }
  const updated = [...current, { ...item, quantity: 1 }];
  setCartItems(updated);
  return updated;
}

export function removeFromCart(id: string): CartItem[] {
  const updated = getCartItems().filter((item) => item.id !== id);
  setCartItems(updated);
  return updated;
}

export function clearCart(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(CART_KEY);
}

export function getCartTotals(items: CartItem[]): { count: number; amount: number } {
  return items.reduce(
    (acc, item) => ({
      count: acc.count + item.quantity,
      amount: acc.amount + item.amount * item.quantity,
    }),
    { count: 0, amount: 0 }
  );
}

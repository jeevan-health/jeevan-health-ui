import { create } from 'zustand';

const KEY = 'jh_cart_v2';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

/**
 * Cart item: { testId, jhcCode, name, price, quantity }
 */
const useCartStore = create((set, get) => ({
  items: load(),

  count: () => get().items.reduce((n, i) => n + i.quantity, 0),

  subtotal: () => get().items.reduce((n, i) => n + i.price * i.quantity, 0),

  addTest: (test) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.testId === test.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: Math.min(10, items[idx].quantity + 1) };
    } else {
      items.push({
        testId: test.id,
        jhcCode: test.jhcCode,
        name: test.name,
        price: Number(test.price),
        quantity: 1,
      });
    }
    save(items);
    set({ items });
  },

  setQty: (testId, quantity) => {
    let items = get().items.map((i) =>
      i.testId === testId ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) } : i,
    );
    save(items);
    set({ items });
  },

  remove: (testId) => {
    const items = get().items.filter((i) => i.testId !== testId);
    save(items);
    set({ items });
  },

  clear: () => {
    save([]);
    set({ items: [] });
  },
}));

export default useCartStore;

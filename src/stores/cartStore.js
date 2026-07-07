import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('jh_cart') || '[]'),
  coupon: null,
  discount: 0,

  addItem: (item) => {
    const exists = get().items.find(i => i.id === item.id && i.type === item.type);
    let items;
    if (exists) {
      items = get().items.map(i => i.id === item.id && i.type === item.type ? { ...i, qty: (i.qty || 1) + 1 } : i);
    } else {
      items = [...get().items, { ...item, qty: 1 }];
    }
    set({ items });
    localStorage.setItem('jh_cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  },

  removeItem: (id, type) => {
    const items = get().items.filter(i => !(i.id === id && i.type === type));
    set({ items });
    localStorage.setItem('jh_cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  },

  updateQty: (id, type, qty) => {
    const items = get().items.map(i => i.id === id && i.type === type ? { ...i, qty } : i);
    set({ items });
    localStorage.setItem('jh_cart', JSON.stringify(items));
  },

  clearCart: () => {
    set({ items: [], coupon: null, discount: 0 });
    localStorage.removeItem('jh_cart');
    window.dispatchEvent(new Event('cart-updated'));
  },

  applyCoupon: (code) => {
    const coupons = { 'WELCOME10': 10, 'HEALTH20': 20, 'JH50': 50 };
    const disc = coupons[code] || 0;
    set({ coupon: code, discount: disc });
    return disc > 0;
  },

  getTotal: () => {
    const items = get().items;
    const subtotal = items.reduce((s, i) => s + ((i.offerPrice || i.price) * (i.qty || 1)), 0);
    const disc = get().discount;
    return { subtotal, discount: Math.round(subtotal * disc / 100), total: subtotal - Math.round(subtotal * disc / 100) };
  },

  getCount: () => get().items.reduce((s, i) => s + (i.qty || 1), 0),
}));

export default useCartStore;

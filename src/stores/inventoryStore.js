import { create } from 'zustand';

const KEY = 'jh_inventory';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const genId = () => 'INV-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();

const CATEGORIES = ['Consumables', 'Equipment', 'Pharmacy', 'PPE', 'Stationery', 'Other'];
const UNITS = ['pieces', 'boxes', 'packs', 'bottles', 'litres', 'kits', 'pairs', 'sets'];

const useInventoryStore = create((set, get) => ({
  items: load(),

  addItem: (data) => {
    const item = { ...data, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const items = [...get().items, item];
    save(items); set({ items }); return item;
  },

  updateItem: (id, data) => {
    const items = get().items.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i);
    save(items); set({ items });
  },

  deleteItem: (id) => {
    const items = get().items.filter(i => i.id !== id);
    save(items); set({ items });
  },

  adjustStock: (id, delta, reason) => {
    const items = get().items.map(i => {
      if (i.id !== id) return i;
      const newQty = (i.quantity || 0) + delta;
      const history = [...(i.history || []), { delta, reason, qty: newQty, at: new Date().toISOString() }];
      return { ...i, quantity: Math.max(0, newQty), updatedAt: new Date().toISOString(), history };
    });
    save(items); set({ items });
  },

  getLowStock: () => get().items.filter(i => (i.quantity || 0) <= (i.minStock || 0)),
}));

export { CATEGORIES, UNITS };
export default useInventoryStore;
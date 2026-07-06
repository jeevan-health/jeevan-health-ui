const STORAGE_KEY = 'jeevan_orders';

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
};

const save = (orders) => localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

export const getOrders = () => load();

export const getOrder = (id) => load().find((o) => o.id === id);

export const createOrder = (data) => {
  const orders = load();
  const id = 'JHC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  const order = {
    id,
    tests: data.tests || [],
    totalAmount: data.totalAmount || 0,
    collectionDate: data.collectionDate || null,
    collectionTime: data.collectionTime || null,
    collectionAddress: data.collectionAddress || null,
    bookedFor: data.bookedFor || null,
    paymentMethod: data.paymentMethod || 'pay_at_collection',
    patientInfo: data.patientInfo || null,
    prescriptionFile: data.prescriptionFile || null,
    status: 'confirmed',
    statusHistory: [{ from: 'pending', to: 'confirmed', at: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.unshift(order);
  save(orders);
  return order;
};

export const updateOrderStatus = (id, status) => {
  const orders = load();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  const validTransitions = { pending: ['confirmed', 'cancelled'], confirmed: ['sample_collected', 'cancelled'], sample_collected: ['processing', 'cancelled'], processing: ['results_ready'], results_ready: ['completed'], };
  if (!validTransitions[order.status]?.includes(status)) return null;
  order.statusHistory.push({ from: order.status, to: status, at: new Date().toISOString() });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  save(orders);
  return order;
};

export const updateOrder = (id, updates) => {
  const orders = load();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  Object.assign(order, updates, { updatedAt: new Date().toISOString() });
  save(orders);
  return order;
};

export const cancelOrder = (id) => updateOrderStatus(id, 'cancelled');

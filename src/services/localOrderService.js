const STORAGE_KEY = 'jeevan_orders';
const PHLEBO_KEY = 'jh_phlebotomists';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || def); } catch { return def; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const loadOrders = () => load(STORAGE_KEY, '[]');
const saveOrders = (orders) => save(STORAGE_KEY, orders);

export const getOrders = () => loadOrders();

export const getOrder = (id) => loadOrders().find((o) => o.id === id);

export const createOrder = (data) => {
  const orders = loadOrders();
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
    timeline: [{ event: 'Order Created', detail: 'Booking confirmed', at: new Date().toISOString() }],
    phlebotomist: null,
    notes: [],
    refund: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.unshift(order);
  saveOrders(orders);
  return order;
};

export const updateOrderStatus = (id, status) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  const validTransitions = { pending: ['confirmed', 'cancelled'], confirmed: ['sample_collected', 'cancelled'], sample_collected: ['processing', 'cancelled'], processing: ['results_ready'], results_ready: ['completed'], };
  if (!validTransitions[order.status]?.includes(status)) return null;
  order.statusHistory.push({ from: order.status, to: status, at: new Date().toISOString() });
  order.timeline.push({ event: `Status: ${order.status} → ${status}`, detail: '', at: new Date().toISOString() });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveOrders(orders);
  return order;
};

export const updateOrder = (id, updates) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  Object.assign(order, updates, { updatedAt: new Date().toISOString() });
  saveOrders(orders);
  return order;
};

export const cancelOrder = (id) => updateOrderStatus(id, 'cancelled');

export const assignPhlebotomist = (id, phlebo) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.phlebotomist = { name: phlebo.name, phone: phlebo.phone, assignedAt: new Date().toISOString() };
  order.timeline.push({ event: 'Phlebotomist Assigned', detail: `${phlebo.name} assigned for collection`, at: new Date().toISOString() });
  order.updatedAt = new Date().toISOString();
  saveOrders(orders);
  return order;
};

export const addOrderNote = (id, text, author) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  if (!order.notes) order.notes = [];
  order.notes.push({ text, author, at: new Date().toISOString() });
  order.updatedAt = new Date().toISOString();
  saveOrders(orders);
  return order;
};

export const processRefund = (id, amount, reason) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.refund = { amount, reason, processedAt: new Date().toISOString() };
  order.timeline.push({ event: 'Refund Processed', detail: `₹${amount} refunded — ${reason}`, at: new Date().toISOString() });
  order.updatedAt = new Date().toISOString();
  saveOrders(orders);
  return order;
};

export const rescheduleOrder = (id, newDate, newTime) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.collectionDate = newDate;
  order.collectionTime = newTime;
  order.timeline.push({ event: 'Rescheduled', detail: `New slot: ${newDate} ${newTime}`, at: new Date().toISOString() });
  order.updatedAt = new Date().toISOString();
  saveOrders(orders);
  return order;
};

// Phlebotomist management
export const getPhlebotomists = () => load(PHLEBO_KEY, '[]');
export const savePhlebotomist = (phlebo) => {
  const list = getPhlebotomists();
  const idx = list.findIndex(p => p.id === phlebo.id);
  if (idx >= 0) list[idx] = phlebo;
  else list.push(phlebo);
  save(PHLEBO_KEY, list);
  return list;
};
export const deletePhlebotomist = (id) => {
  const list = getPhlebotomists().filter(p => p.id !== id);
  save(PHLEBO_KEY, list);
  return list;
};

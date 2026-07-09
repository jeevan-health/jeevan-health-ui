import { create } from 'zustand';

const KEY = 'jh_bookings';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || 'null') || def; } catch { return def; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const genId = () => 'BK-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();

const defaultSlots = ['7:00 AM – 9:00 AM', '9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM', '2:00 PM – 4:00 PM', '4:00 PM – 6:00 PM', '6:00 PM – 8:00 PM'];

const useBookingsStore = create((set, get) => ({
  bookings: load(KEY, []),
  timeSlots: load(KEY + '_slots', defaultSlots),

  addBooking: (data) => {
    const booking = { ...data, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: data.status || 'scheduled' };
    const bookings = [...get().bookings, booking];
    save(KEY, bookings);
    set({ bookings });
    return booking;
  },

  updateBooking: (id, data) => {
    const bookings = get().bookings.map(b => b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b);
    save(KEY, bookings);
    set({ bookings });
  },

  deleteBooking: (id) => {
    const bookings = get().bookings.filter(b => b.id !== id);
    save(KEY, bookings);
    set({ bookings });
  },

  getBookingsByDate: (date) => get().bookings.filter(b => b.date === date),

  setTimeSlots: (slots) => { save(KEY + '_slots', slots); set({ timeSlots: slots }); },

  addTimeSlot: (slot) => { const s = [...get().timeSlots, slot]; save(KEY + '_slots', s); set({ timeSlots: s }); },

  removeTimeSlot: (index) => { const s = get().timeSlots.filter((_, i) => i !== index); save(KEY + '_slots', s); set({ timeSlots: s }); },
}));

export default useBookingsStore;
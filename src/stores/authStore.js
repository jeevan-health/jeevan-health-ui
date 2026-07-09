import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('jh_token'),
  isLoading: false,
  family: [],
  addresses: [],

  setUser: (user) => set({ user, isAuthenticated: true }),

  login: async (phone) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 500));
    const user = { id: '1', phone, name: 'User', email: '' };
    localStorage.setItem('jh_token', 'mock-token');
    localStorage.setItem('jh_user', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  verifyOtp: async (phone, otp) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 500));
    const user = { id: '1', phone, name: phone === '9999999999' ? 'Demo User' : 'User', email: '' };
    localStorage.setItem('jh_token', 'mock-token');
    localStorage.setItem('jh_user', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
    return true;
  },

  googleLogin: async () => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 1200));
    const user = {
      id: 'google_1',
      name: 'Ashwin Kumar',
      email: 'ashwin.kumar@gmail.com',
      phone: '+91 98765 43210',
      avatar: null,
      provider: 'google',
    };
    localStorage.setItem('jh_token', 'mock-token-google');
    localStorage.setItem('jh_user', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
    return true;
  },

  fetchProfile: async () => {
    try {
      const stored = localStorage.getItem('jh_user');
      if (stored) set({ user: JSON.parse(stored), isAuthenticated: true });
    } catch { /* noop */ }
  },

  addFamilyMember: (member) => {
    const fam = [...get().family, { ...member, id: Date.now().toString() }];
    set({ family: fam });
    localStorage.setItem('jh_family', JSON.stringify(fam));
  },

  addAddress: (addr) => {
    const addrs = [...get().addresses, { ...addr, id: Date.now().toString() }];
    set({ addresses: addrs });
    localStorage.setItem('jh_addresses', JSON.stringify(addrs));
  },

  logout: () => {
    localStorage.removeItem('jh_token');
    localStorage.removeItem('jh_user');
    set({ user: null, isAuthenticated: false });
  },
}));

// Load stored data
const stored = localStorage.getItem('jh_user');
if (stored) {
  try { useAuthStore.getState().setUser(JSON.parse(stored)); } catch { /* noop */ }
}
const fam = localStorage.getItem('jh_family');
if (fam) {
  try { useAuthStore.getState().family = JSON.parse(fam); } catch { /* noop */ }
}
const addrs = localStorage.getItem('jh_addresses');
if (addrs) {
  try { useAuthStore.getState().addresses = JSON.parse(addrs); } catch { /* noop */ }
}

export default useAuthStore;

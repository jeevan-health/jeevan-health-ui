import { create } from 'zustand';
import * as settingsService from '../services/settingsService';

/**
 * Launch / feature access for patient UI.
 * accessMode: full | reports_only | reports_only_camp_users
 */
const useSettingsStore = create((set, get) => ({
  accessMode: 'full', // optimistic until loaded — then API decides
  accessMessage: '',
  reportsOnly: false,
  isCampUser: false,
  loaded: false,
  loading: false,

  fetchPublic: async () => {
    try {
      const { data } = await settingsService.getPublicSettings();
      set({
        accessMode: data.accessMode || 'full',
        accessMessage: data.accessMessage || '',
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  fetchMyAccess: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsService.getMyAccess();
      set({
        accessMode: data.accessMode || 'full',
        accessMessage: data.accessMessage || '',
        reportsOnly: !!data.reportsOnly,
        isCampUser: !!data.isCampUser,
        loaded: true,
        loading: false,
      });
      return data;
    } catch {
      set({ loading: false, loaded: true, reportsOnly: false });
      return null;
    }
  },

  /** True if patient should not book / use incomplete modules */
  isReportsOnly: () => get().reportsOnly,

  reset: () => set({
    accessMode: 'full',
    accessMessage: '',
    reportsOnly: false,
    isCampUser: false,
    loaded: false,
    loading: false,
  }),
}));

export default useSettingsStore;

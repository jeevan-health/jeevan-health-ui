import { create } from 'zustand';

/**
 * Global confirm dialog. Usage:
 *   const ok = await confirmDialog({ title, message, danger: true });
 *   if (!ok) return;
 */
const useDialogStore = create((set, get) => ({
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  danger: false,
  resolve: null,

  show: (opts) => {
    const {
      title = 'Please confirm',
      message = '',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      danger = false,
    } = opts || {};
    return new Promise((resolve) => {
      // Resolve any previous pending dialog as false
      const prev = get().resolve;
      if (typeof prev === 'function') prev(false);
      set({
        open: true,
        title,
        message,
        confirmLabel,
        cancelLabel,
        danger: !!danger,
        resolve,
      });
    });
  },

  accept: () => {
    const { resolve } = get();
    set({ open: false, resolve: null });
    if (resolve) resolve(true);
  },

  dismiss: () => {
    const { resolve } = get();
    set({ open: false, resolve: null });
    if (resolve) resolve(false);
  },
}));

export function confirmDialog(opts) {
  // Support string shorthand: confirmDialog('Delete this?')
  if (typeof opts === 'string') {
    return useDialogStore.getState().show({ message: opts, danger: true });
  }
  return useDialogStore.getState().show(opts || {});
}

export default useDialogStore;

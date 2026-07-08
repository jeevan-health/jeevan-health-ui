import { create } from 'zustand';

const useUploadModal = create((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export default useUploadModal;

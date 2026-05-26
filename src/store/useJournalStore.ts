import { create } from "zustand";
import { Entry } from "@/generated/prisma/client";

interface JournalState {
  isOpen: boolean;
  editingEntry: Entry | null;
  openModal: (entry?: Entry) => void;
  closeModal: () => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  isOpen: false,
  editingEntry: null,
  openModal: (entry) => set({ isOpen: true, editingEntry: entry || null }),
  closeModal: () => set({ isOpen: false, editingEntry: null }),
}));

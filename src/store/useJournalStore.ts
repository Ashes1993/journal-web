import { create } from "zustand";
import { Entry } from "@/generated/prisma/client";
import { persist } from "zustand/middleware";

interface JournalState {
  isOpen: boolean;
  editingEntry: Entry | null;
  openModal: (entry?: Entry) => void;
  closeModal: () => void;
  sortBy: "newest" | "oldest";
  setSortBy: (sort: "newest" | "oldest") => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      isOpen: false,
      editingEntry: null,
      sortBy: "newest",
      openModal: (entry) => set({ isOpen: true, editingEntry: entry || null }),
      closeModal: () => set({ isOpen: false, editingEntry: null }),
      setSortBy: (sort) => set({ sortBy: sort }),
    }),
    {
      name: "journal-storage",
      // Only save 'sortBy', don't save 'isOpen'
      partialize: (state) => ({ sortBy: state.sortBy }),
    },
  ),
);

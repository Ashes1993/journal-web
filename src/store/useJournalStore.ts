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
  filterMood: string | null;
  setFilterMood: (mood: string | null) => void;
  filterTags: string[];
  toggleFilterTag: (tag: string) => void;
  clearFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
      filterMood: null,
      setFilterMood: (mood) =>
        set((state) => ({
          filterMood: state.filterMood === mood ? null : mood,
        })),
      filterTags: [],
      // Adds a tag if missing, removes it if clicked again
      toggleFilterTag: (tag) =>
        set((state) => {
          const exists = state.filterTags.includes(tag);
          return {
            filterTags: exists
              ? state.filterTags.filter((t) => t !== tag)
              : [...state.filterTags, tag],
          };
        }),
      clearFilters: () => set({ filterMood: null, filterTags: [] }),
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "journal-storage",
      // Only save 'sortBy', don't save 'isOpen'
      partialize: (state) => ({ sortBy: state.sortBy }),
    },
  ),
);

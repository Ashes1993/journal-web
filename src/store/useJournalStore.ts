import { create } from "zustand";
import { Entry } from "@/generated/prisma/client";
import { persist } from "zustand/middleware";
import { fetchJournalEntries } from "@/actions/journal-entries";

interface JournalState {
  // Modal states
  isOpen: boolean;
  editingEntry: Entry | null;
  openModal: (entry?: Entry) => void;
  closeModal: () => void;

  // Card actions
  updateEntry: (updatedEntry: Entry) => void;
  removeEntry: (entryId: string) => void;
  isDeleting: string | null;
  setIsDeleting: (id: string | null) => void;

  // List Controls
  sortBy: "newest" | "oldest";
  setSortBy: (sort: "newest" | "oldest") => void;
  filterMood: string | null;
  setFilterMood: (mood: string | null) => void;
  filterTags: string[];
  toggleFilterTag: (tag: string) => void;
  clearFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data and Pagination
  journalEntries: Entry[];
  hasMore: boolean;
  isLoadingMore: boolean;
  setInitialEntries: (entries: Entry[], hasMore: boolean) => void;
  loadMoreEntries: () => Promise<void>;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      // Modal logic
      isOpen: false,
      editingEntry: null,
      sortBy: "newest",
      openModal: (entry) => set({ isOpen: true, editingEntry: entry || null }),
      closeModal: () => set({ isOpen: false, editingEntry: null }),

      // Card logic
      isDeleting: null,
      updateEntry: (updatedEntry) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((e) =>
            e.id === updatedEntry?.id ? updatedEntry : e,
          ),
        })),
      removeEntry: (entryId) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter((e) => e.id !== entryId),
        })),
      setIsDeleting: (id) => set({ isDeleting: id }),

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

      // Pagination state and actions
      journalEntries: [],
      hasMore: true,
      isLoadingMore: false,
      setInitialEntries: (entries, hasMore) =>
        set({ journalEntries: entries, hasMore }),
      loadMoreEntries: async () => {
        const { journalEntries, hasMore, isLoadingMore } = get();
        if (!hasMore || isLoadingMore) return;
        set({ isLoadingMore: true });
        const currentOffset = journalEntries.length;

        // Fetch the next batch of entries
        const newEntries = (
          await fetchJournalEntries({ skip: currentOffset, take: 12 })
        ).entries as Entry[];
        if (newEntries.length < 12) {
          set({
            journalEntries: [...journalEntries, ...newEntries],
            hasMore: false,
          });
        } else {
          set({
            journalEntries: [...journalEntries, ...newEntries],
            hasMore: true,
          });
        }
        set({ isLoadingMore: false });
      },
    }),
    {
      name: "journal-storage",
      // Only save 'sortBy'
      partialize: (state) => ({ sortBy: state.sortBy }),
    },
  ),
);

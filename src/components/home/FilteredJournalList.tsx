"use client";

import { useEffect } from "react";
import { Entry } from "@/generated/prisma/client";
import { useJournalStore } from "@/store/useJournalStore";
import { SearchX, FilterX } from "lucide-react";
import JournalEntryCard from "./JournalEntryCard";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import SortBar from "./SortBar";
import JournalLoader from "../ui/JournalLoader";

export default function FilteredJournalList({
  initialEntries,
  initialHasMore,
}: {
  initialEntries: Entry[];
  initialHasMore: boolean;
}) {
  const {
    journalEntries,
    setInitialEntries,
    loadMoreEntries,
    hasMore,
    isLoadingMore,
    sortBy,
    filterMood,
    filterTags,
    searchQuery,
    clearFilters,
  } = useJournalStore();

  // Sync server data to client store safely on mount
  useEffect(() => {
    setInitialEntries(initialEntries, initialHasMore);
  }, [initialEntries, initialHasMore, setInitialEntries]);

  // Gather all unique tags from the journal entries for the filter options
  const uniqueAvailableTags = Array.from(
    new Set(journalEntries.flatMap((entry) => entry.tags || [])),
  );

  // Execute the Cumulative filtering pipeline
  let processedEntries = [...journalEntries];

  // Gate A: Apply Search Query
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase().trim();
    processedEntries = processedEntries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(lowerQuery) ||
        (entry.content || "").toLowerCase().includes(lowerQuery),
    );
  }

  // Gate B: Apply Mood Filter
  if (filterMood) {
    processedEntries = processedEntries.filter(
      (entry) => entry.mood === filterMood,
    );
  }

  // Gate C: Apply Tag Filter (Ensures entry contain ALL selected tags)
  if (filterTags.length > 0) {
    processedEntries = processedEntries.filter((entry) =>
      filterTags.every((tag) => entry.tags.includes(tag)),
    );
  }

  // Gate C: Sort execution layer
  processedEntries.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Logic Check: Are we currently filtering?
  const isFilteringActive =
    searchQuery.trim() !== "" || filterMood !== null || filterTags.length > 0;

  return (
    <div className="relative">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-4 mb-6 bg-app-bg/80 backdrop-blur-md border-b border-transparent md:border-none transition-all">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar />
          </div>

          {/* Houses Mood, Tags, and Sort tightly side-by-side */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <FilterBar availableTags={uniqueAvailableTags} />
            <SortBar />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {processedEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in face-in zoom-in duration-300">
          <div className="bg-slate-100 dark:bg-slate-800 p6 rounded-full mb-4">
            <SearchX className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-app-text">No results found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
            We couldn&apos;t find any entries matching your current filters. Try
            adjusting your search or tags.
          </p>
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-muted-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <FilterX className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      ) : (
        // Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop
        <div className="space-y-10">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedEntries.map((entry) => (
              <li
                key={entry.id}
                className="animate-in fade-in animate-fade-slide-up duration-300"
              >
                <JournalEntryCard entry={entry} />
              </li>
            ))}
          </ul>

          {/* Pagination UI: Only show if not filtering and more exist in DB */}
          {hasMore && !isFilteringActive && (
            <div className="flex flex-col items-center justify-center pt-6 border-t border-slate-100 dark:border-slate-800/50">
              <button
                type="button"
                disabled={isLoadingMore}
                onClick={loadMoreEntries}
                className="min-w-[160px] h-11 px-6 text-xs font-bold tracking-widest uppercase 
                           bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 
                           border border-muted-border rounded-2xl shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all 
                           disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {isLoadingMore ? (
                  <JournalLoader message="" heightClassName="sm" />
                ) : (
                  "Load More Entries"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

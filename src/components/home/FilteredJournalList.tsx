"use client";

import { Entry } from "@/generated/prisma/client";
import { useJournalStore } from "@/store/useJournalStore";
import JournalEntryCard from "./JournalEntryCard";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import SortBar from "./SortBar";

export default function FilteredJournalList({
  journalEntries,
}: {
  journalEntries: Entry[];
}) {
  const sortBy = useJournalStore((state) => state.sortBy);
  const filterMood = useJournalStore((state) => state.filterMood);
  const filterTags = useJournalStore((state) => state.filterTags);
  const searchQuery = useJournalStore((state) => state.searchQuery);

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

  return (
    <div className="space-y-2">
      <SearchBar />
      <FilterBar availableTags={uniqueAvailableTags} />
      <SortBar />
      {processedEntries.length === 0 ? (
        <div className="text-center py-12 mx-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
          <p className="text-sm text-slate-400 font-medium">
            No entries match your current filter parameters.
          </p>
        </div>
      ) : (
        <ul className="space-y-1">
          {processedEntries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  );
}

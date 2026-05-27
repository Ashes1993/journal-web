"use client";

import { Entry } from "@/generated/prisma/client";
import { useJournalStore } from "@/store/useJournalStore";
import JournalEntryCard from "./JournalEntryCard";

export default function FilteredJournalList({
  journalEntries,
}: {
  journalEntries: Entry[];
}) {
  const sortBy = useJournalStore((state) => state.sortBy);

  const sortedEntries = [...journalEntries].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <ul>
      {sortedEntries.map((entry) => (
        <JournalEntryCard key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}

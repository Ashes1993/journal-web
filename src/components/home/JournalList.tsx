import { fetchJournalEntries } from "@/actions/journal-entries";
import { Entry } from "@/generated/prisma/client";
import FilteredJournalList from "./FilteredJournalList";
import { BookOpen } from "lucide-react";

export default async function JournalList() {
  const PAGE_SIZE = 12;

  const response = await fetchJournalEntries({ skip: 0, take: PAGE_SIZE + 1 });
  const initialEntries = (response?.entries || []) as Entry[];

  // --- TRUE DATABASE EMPTY STATE ---
  // Displayed only when the user has zero records written down
  if (initialEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in duration-500">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-5 rounded-2xl mb-5 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shadow-xs">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Your Journal is Empty
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
          There are no entries recorded yet. Tap the floating action button in
          the corner to write your first entry!
        </p>
      </div>
    );
  }

  const hasMore = initialEntries.length > PAGE_SIZE;
  const entriesToDisplay = hasMore
    ? initialEntries.slice(0, PAGE_SIZE)
    : initialEntries;

  return (
    <FilteredJournalList
      initialEntries={entriesToDisplay}
      initialHasMore={hasMore}
    />
  );
}

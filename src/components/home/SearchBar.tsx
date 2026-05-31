"use client";

import { useJournalStore } from "@/store/useJournalStore";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const searchQuery = useJournalStore((state) => state.searchQuery);
  const setSearchQuery = useJournalStore((state) => state.setSearchQuery);

  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search titles or content..."
        className="w-full pl-11 pr-10 py-2.5 bg-card text-app-text placeholder:text-slate-400 border border-muted-border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-xs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 right-3 flex items-center justify-center p-1 my-auto h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

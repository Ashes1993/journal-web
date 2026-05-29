"use client";

import { useJournalStore } from "@/store/useJournalStore";

export default function SearchBar() {
  const searchQuery = useJournalStore((state) => state.searchQuery);
  const setSearchQuery = useJournalStore((state) => state.setSearchQuery);

  return (
    <form className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 mt-2 bg-slate-200 text-slate-500 placeholder:text-slate-400 border border-slate-200 rounded-2xl active:outline-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute right-4 top-3 text-slate-400 text-2xl hover:text-slate-600 transition"
        >
          &times;
        </button>
      )}
    </form>
  );
}

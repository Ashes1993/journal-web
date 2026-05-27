"use client";

import { useJournalStore } from "@/store/useJournalStore";

export default function ListControl() {
  const sortBy = useJournalStore((state) => state.sortBy);
  const setSortBy = useJournalStore((state) => state.setSortBy);

  return (
    <div>
      {/* Search Component */}
      <div></div>

      {/* Filter Component */}
      <div></div>

      {/* Sort Component */}
      <div>
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          name="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
}

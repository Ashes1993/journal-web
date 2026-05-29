"use client";

import { useJournalStore } from "@/store/useJournalStore";

const MOOD_OPTIONS = [
  { label: "happy", emoji: "😊" },
  { label: "sad", emoji: "😢" },
  { label: "excited", emoji: "🤩" },
  { label: "angry", emoji: "😡" },
  { label: "dream", emoji: "🌙" },
  { label: "poker face", emoji: "😐" },
];

export default function FilterBar({
  availableTags,
}: {
  availableTags: string[];
}) {
  const {
    filterMood,
    filterTags,
    setFilterMood,
    toggleFilterTag,
    clearFilters,
  } = useJournalStore();

  const hasActiveFilters = filterMood !== null || filterTags.length > 0;

  return (
    <div className="p-4 mx-4 mb-2 bg-slate-200/60 border border-slate-100 rounded-2xl space-y-3">
      {/* Mood Filtering Section */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
          Moods:
        </span>
        {MOOD_OPTIONS.map((mood) => {
          const isActive = filterMood === mood.label;
          return (
            <button
              type="button"
              key={mood.label}
              onClick={() => setFilterMood(mood.label)}
              className={`px-3 py-1 text-sm rounded-xl transition-all border ${
                isActive
                  ? "bg-blue-100 border-blue-300 text-blue-800 scale-105 font-medium"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className="mr-1">{mood.emoji}</span>
            </button>
          );
        })}
      </div>

      {/* Tag Filtering Section */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
            Tags:
          </span>
          {availableTags.map((tag) => {
            const isActive = filterTags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleFilterTag(tag)}
                className={`px-2.5 py-0.5 text-xs rounded-lg transition-all border ${
                  isActive
                    ? "bg-slate-800 border-slate-900 text-white font-medium"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                #{tag}
                {isActive && (
                  <span className="ml-1 text-slate-400 font-bold">&times;</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Conditional Reset Switch */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline transition-all"
          >
            Clear Active Filters
          </button>
        </div>
      )}
    </div>
  );
}

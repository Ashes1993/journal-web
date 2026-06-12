"use client";

import { useState, useRef, useEffect } from "react";
import { useJournalStore } from "@/store/useJournalStore";
import { ChevronDown, Smile, Tag, Check } from "lucide-react";

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
  const { filterMood, filterTags, setFilterMood, toggleFilterTag } =
    useJournalStore();

  // Dropdown visibility states
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);

  const moodRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  // Click outside listener for handling both dropdown frames
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moodRef.current && !moodRef.current.contains(event.target as Node)) {
        setIsMoodOpen(false);
      }
      if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
        setIsTagOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeMoodObj = MOOD_OPTIONS.find((m) => m.label === filterMood);

  return (
    <div className="flex items-center gap-2">
      {/* Mood Button */}
      <div className="relative" ref={moodRef}>
        <button
          type="button"
          onClick={() => {
            setIsMoodOpen(!isMoodOpen);
            setIsTagOpen(false);
          }}
          className={`px-3 py-2 text-xs bg-card border border-muted-border rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer whitespace-nowrap ${
            isMoodOpen
              ? "border-slate-400 dark:border-slate-600 ring-2 ring-slate-500/5"
              : ""
          } ${filterMood ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60" : ""}`}
        >
          {activeMoodObj ? (
            <span className="text-sm -my-1">{activeMoodObj.emoji}</span>
          ) : (
            <Smile className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{activeMoodObj ? `Mood: ${activeMoodObj.label}` : "Mood"}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {isMoodOpen && (
          <div className="absolute top-full left-0 mt-1 w-44 bg-card border border-muted-border rounded-xl shadow-lg z-40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 origin-top-left">
            <div className="p-1 space-y-0.5">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = filterMood === mood.label;
                return (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => {
                      setFilterMood(isSelected ? null : mood.label);
                      setIsMoodOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{mood.emoji}</span>
                      <span className="capitalize">{mood.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tags Button */}
      <div className="relative" ref={tagRef}>
        <button
          type="button"
          onClick={() => {
            setIsTagOpen(!isTagOpen);
            setIsMoodOpen(false);
          }}
          className={`px-3 py-2 text-xs bg-card border border-muted-border rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer whitespace-nowrap ${
            isTagOpen
              ? "border-slate-400 dark:border-slate-600 ring-2 ring-slate-500/5"
              : ""
          } ${filterTags.length > 0 ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700" : ""}`}
        >
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span>Tags {filterTags.length > 0 && `(${filterTags.length})`}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {isTagOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-muted-border rounded-xl shadow-lg z-40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 origin-top-left">
            {availableTags.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No tags created yet.
              </div>
            ) : (
              <div className="p-1 max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar">
                {availableTags.map((tag) => {
                  const isSelected = filterTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleFilterTag(tag)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <span className="truncate pr-2">#{tag}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

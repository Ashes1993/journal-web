"use client";

import { useState, useRef, useEffect } from "react";
import { useJournalStore } from "@/store/useJournalStore";

export default function SortBar() {
  const sortBy = useJournalStore((state) => state.sortBy);
  const setSortBy = useJournalStore((state) => state.setSortBy);

  // Local state to track open/closed menu status
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the menu automatically if the user clicks anywhere else on the screen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  const currentLabel =
    options.find((opt) => opt.value === sortBy)?.label || "Newest";

  return (
    <div className="ml-4 flex items-center" ref={dropdownRef}>
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 select-none">
        Sort by:
      </label>

      {/* Dropdown Container Context Wrapper */}
      <div className="relative w-28">
        {/* The Visible Select Trigger Box */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left py-1 px-3 text-xs text-slate-600 bg-white border transition-all duration-200 flex items-center justify-between ${
            isOpen
              ? "border-slate-300 border-b-transparent rounded-t-xl shadow-xs"
              : "border-slate-200 rounded-xl hover:border-slate-300 shadow-xs"
          }`}
        >
          <span className="font-medium text-slate-700">{currentLabel}</span>

          {/* Animated chevron arrow rotation indicator */}
          <svg
            className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-blue-500" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* The Continuous Options List Panel */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-slate-300 border-t-0 rounded-b-xl shadow-md z-30 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 origin-top">
            {options.map((option) => {
              const isSelected = sortBy === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSortBy(option.value as "newest" | "oldest");
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? "bg-blue-50/80 text-blue-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

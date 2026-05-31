"use client";

import { useState, useRef, useEffect } from "react";
import { useJournalStore } from "@/store/useJournalStore";
import { ArrowUpDown, ChevronDown } from "lucide-react";

export default function SortBar() {
  const sortBy = useJournalStore((state) => state.sortBy);
  const setSortBy = useJournalStore((state) => state.setSortBy);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
  ];

  const currentLabel =
    options.find((opt) => opt.value === sortBy)?.label || "Newest first";

  return (
    <div className="flex items-center gap-2 shrink-0" ref={dropdownRef}>
      <span className="hidden md:inline text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
        Sort:
      </span>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-2.5 text-xs bg-card border border-muted-border rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer ${
            isOpen
              ? "border-slate-400 dark:border-slate-600 ring-2 ring-slate-500/5"
              : ""
          }`}
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-500" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-36 bg-card border border-muted-border rounded-xl shadow-lg z-40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 origin-top-right">
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
                  className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
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

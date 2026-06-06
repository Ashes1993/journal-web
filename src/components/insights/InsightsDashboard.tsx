"use client";

import { useState, useEffect } from "react";
import { useJournalStore } from "@/store/useJournalStore";
import {
  calculateJournalInsights,
  filterEntriesByTime,
  FilterRange,
} from "@/lib/stats/calculations";
import StatsCard from "./StatsCard";
import { BarChart3, CalendarDays, Smile } from "lucide-react";
import { fetchJournalEntries } from "@/actions/journal-entries";
import { Entry } from "@/generated/prisma/client";

export default function InsightsDashboard() {
  const [range, setRange] = useState<FilterRange>("all");
  const { journalEntries, setInitialEntries } = useJournalStore();

  // Check whether we have entries in the store. If not, fetch them.
  useEffect(() => {
    if (journalEntries.length === 0) {
      fetchJournalEntries().then((res) => {
        // Safe check to verify data exists before passing to state
        if (res?.entries) {
          setInitialEntries(res.entries as Entry[], false);
        }
      });
    }
  }, [journalEntries.length, setInitialEntries]);

  const filteredEntries = filterEntriesByTime(journalEntries, range);
  const stats = calculateJournalInsights(filteredEntries);

  const filterOptions: { label: string; value: FilterRange }[] = [
    { label: "All Time", value: "all" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
  ];

  return (
    <div className="space-y-8">
      {/* Pill Filters */}
      <div className="flex justify-start">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setRange(option.value)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${range === option.value ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Grid Layout */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label="Total Entries"
          value={stats.totalEntries.toString()}
          icon={<CalendarDays className="h-8 w-8" />}
        />
        <StatsCard
          label="Most Frequent Mood"
          value={stats.mostFrequentMood || "None"}
          icon={<Smile className="h-8 w-8" />}
        />
        <StatsCard
          label="Unique Days Active"
          value={Object.keys(stats.activityMap).length.toString()}
          icon={<BarChart3 className="h-8 w-8" />}
        />
      </div>
    </div>
  );
}

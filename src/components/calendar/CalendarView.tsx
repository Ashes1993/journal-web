"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  fetchJournalEntriesForDate,
  fetchJournalEntriesForMonth,
} from "@/actions/journal-entries";
import { Entry } from "@/generated/prisma/client";

import JournalEntryCard from "../home/JournalEntryCard";
import JournalLoader from "../ui/JournalLoader";
import { CalendarDays, StickyNote } from "lucide-react";

export default function CalendarView() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [highlightedDays, setHighlightedDays] = useState<Date[]>([]);
  const [entriesForSelectedDay, setEntriesForSelectedDay] = useState<Entry[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch journal entries for the current month and update highlighted days
  useEffect(() => {
    async function loadActiveMonthData() {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      const response = await fetchJournalEntriesForMonth(year, month);

      if (response.success) {
        const dates = response.entries.map(
          (entry) => new Date(entry.createdAt),
        );
        setHighlightedDays(dates);
      }
    }
    loadActiveMonthData();
  }, [currentMonth]);

  // Sync Selected Day Feed (Daily View)
  useEffect(() => {
    if (!selectedDay) {
      // Use requestAnimationFrame to avoid synchronous cascading renders
      const frame = requestAnimationFrame(() => setEntriesForSelectedDay([]));
      return () => cancelAnimationFrame(frame);
    }

    async function getDailyEntries() {
      setLoading(true);
      try {
        const response = await fetchJournalEntriesForDate(selectedDay as Date);
        if (response.success) {
          setEntriesForSelectedDay(response.entries);
        }
      } finally {
        setLoading(false);
      }
    }

    getDailyEntries();
  }, [selectedDay]);

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl">
      <div>
        {/* Calendar Section */}
        <div className="md:col-span-5 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/50 shadow-sm h-fit">
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2030, 11)}
            modifiers={{
              hasNote: highlightedDays,
            }}
            modifiersClassNames={{
              hasNote:
                "bg-blue-50 text-blue-600 font-bold dark:bg-blue-950/40 dark:text-blue-400 rounded-full",
            }}
            className="w-full m-0 flex justify-center"
          />
        </div>

        {/* Daily Entries Section */}
        <div className="lg:col-span-7 space-y-6 mt-8">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <CalendarDays className="h-5 w-5 opacity-70" />
              <h2 className="text-lg font-bold">
                {selectedDay?.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
              {entriesForSelectedDay.length}{" "}
              {entriesForSelectedDay.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <JournalLoader />
              </div>
            ) : entriesForSelectedDay.length > 0 ? (
              entriesForSelectedDay.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  // Pass your existing state handlers here for Edit/Delete parity
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-100 dark:border-slate-800/50 rounded-[2.5rem] text-slate-400">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-full mb-4">
                  <StickyNote className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm font-medium">
                  Silence is golden, but a note is better.
                </p>
                <p className="text-xs opacity-60">
                  Nothing recorded for this date yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

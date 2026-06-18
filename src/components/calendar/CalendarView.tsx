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
import {
  CalendarDays,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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
      const frame = requestAnimationFrame(() => setEntriesForSelectedDay([]));
      return () => cancelAnimationFrame(frame);
    }

    // Calculate absolute local midnight start and end boundaries on the client
    const start = new Date(selectedDay);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDay);
    end.setHours(23, 59, 59, 999);

    async function getDailyEntries() {
      setLoading(true);
      try {
        const response = await fetchJournalEntriesForDate(
          start.toISOString(),
          end.toISOString(),
        );
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
    <div className="p-2 bg-white dark:bg-slate-900 rounded-2xl">
      <div className="flex flex-col xl:flex-row xl:gap-8 items-start w-full">
        {/* Calendar Section */}
        <div className="w-full xl:w-[380px] xl:sticky xl:top-6 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/50 shadow-sm h-fit shrink-0">
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
            classNames={{
              caption_label: "hidden",
              dropdowns: "flex ml-6 gap-2 items-center",
              dropdown_root: "relative",
              dropdown:
                "appearance-none bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white cursor-pointer",
              button_previous:
                "h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all",
              button_next:
                "h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all",
            }}
            components={{
              Chevron: ({ orientation }) => {
                return orientation === "left" ? (
                  <ChevronLeft className="w-5 h-5 opacity-70" />
                ) : orientation === "right" ? (
                  <ChevronRight className="w-5 h-5 opacity-70" />
                ) : orientation === "up" ? (
                  <ChevronUp className="w-5 h-5 opacity-70" />
                ) : (
                  <ChevronDown className="w-5 h-5 opacity-70" />
                );
              },
            }}
          />
        </div>

        {/* Daily Entries Section */}
        <div className="flex-1 w-full space-y-6 mt-8 xl:mt-0 max-w-3xl">
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
                  onDeleteSuccess={(deletedId) => {
                    setEntriesForSelectedDay((prev) =>
                      prev.filter((e) => e.id !== deletedId),
                    );
                  }}
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

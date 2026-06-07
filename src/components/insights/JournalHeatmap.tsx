"use client";

import { useMemo } from "react";
import { generateHeatmapDates } from "@/lib/stats/calculations";
import { ActivityMap } from "@/types/insights";

interface JournalHeatmapProps {
  activityMap: ActivityMap;
}

export default function JournalHeatmap({ activityMap }: JournalHeatmapProps) {
  // Memoize the heatmap data to avoid unnecessary recalculations
  const heatmapDates = useMemo(() => generateHeatmapDates(), []);

  // Map entry frequency directly to specific opacity styles
  const getColorClass = (count: number) => {
    if (!count || count === 0) return "bg-slate-100 dark:bg-slate-800";
    if (count === 1)
      return "bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800";
    if (count === 2)
      return "bg-emerald-400 dark:bg-emerald-700 text-emerald-100";
    if (count === 3) return "bg-emerald-600 dark:bg-emerald-500 text-white";
    return "bg-emerald-800 dark:bg-emerald-300 text-white";
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-50">
        Activity Landscape
      </h3>

      {/* Mobile overflow layer wrapper to ensure horizontal sliding responsiveness */}
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-[760px] gap-2 items-start">
          {/* The core matrix engine */}
          <div className="grid grid-rows-7 grid-flow-col gap-[3px] p-8">
            {heatmapDates.map((dateString) => {
              const entryCount = activityMap[dateString] || 0;
              const colorClass = getColorClass(entryCount);

              return (
                <div
                  key={dateString}
                  className={`h-[12px] w-[12px] rounded-[2px] transition-colors group relative ${colorClass}`}
                >
                  {/* Native hover tooltip element */}
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-50 dark:text-slate-900 z-40">
                    {entryCount} {entryCount === 1 ? "entry" : "entries"} on{" "}
                    {dateString}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Legend */}
      <div className="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <span>Less</span>
        <div className="h-[12px] w-[12px] rounded-[2px] bg-slate-100 dark:bg-slate-800" />
        <div className="h-[12px] w-[12px] rounded-[2px] bg-emerald-200 dark:bg-emerald-900/60" />
        <div className="h-[12px] w-[12px] rounded-[2px] bg-emerald-400 dark:bg-emerald-700" />
        <div className="h-[12px] w-[12px] rounded-[2px] bg-emerald-600 dark:bg-emerald-500" />
        <div className="h-[12px] w-[12px] rounded-[2px] bg-emerald-800 dark:bg-emerald-300" />
        <span>More</span>
      </div>
    </div>
  );
}

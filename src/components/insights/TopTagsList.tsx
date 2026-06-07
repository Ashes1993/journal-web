"use client";

import { TagFrequency } from "@/types/insights";

interface TopTagsListProps {
  tags: TagFrequency[];
}

export default function TopTagsList({ tags }: TopTagsListProps) {
  if (!tags || tags.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
          Top Topics
        </h3>
        <p className="mt-4 text-sm text-slate-500">
          No tags used during this timeframe
        </p>
      </div>
    );
  }

  // Find max value to determine percentage baseline safely
  const maxCount = Math.max(...tags.map((t) => t.count));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="mb-6 text-base font-semibold text-slate-900 dark:text-slate-50">
        Top Tags
      </h3>
      <div className="space-y-4">
        {tags.map((tag) => {
          const percentage = maxCount > 0 ? (tag.count / maxCount) * 100 : 0;

          return (
            <div key={tag.name} className="space-y-1.5">
              <div className="flex items-center gap-4 justify-between text-sm">
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    #{tag.name}
                  </span>
                  <span className="">({tag.count})</span>
                </div>

                {/* Outer Track */}
                <div className="h-2 min-w-3/5 rounded-full bg-slate-100 dark:bg-slate-800">
                  {/* Dynamic Inner Bar Filter */}
                  <div
                    className="h-2 rounded-full bg-indigo-500 transition-all duration-500 ease-out dark:bg-indigo-400"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

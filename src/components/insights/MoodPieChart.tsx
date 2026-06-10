"use client";

import { PieChart, Pie, Tooltip, Sector, PieSectorShapeProps } from "recharts";
import { MoodDistribution } from "@/types/insights";

interface MoodPieChartProps {
  moodDistribution: MoodDistribution;
}

// Map databse mood values to specific colors and emojis
const MOOD_CONFIG: Record<
  string,
  { color: string; emoji: string; label: string }
> = {
  happy: { color: "#10b981", emoji: "😊", label: "Happy" },
  sad: { color: "#3b82f6", emoji: "😢", label: "Sad" },
  excited: { color: "#ef4444", emoji: "🤩", label: "Excited" },
  angry: { color: "#8b5cf6", emoji: "😡", label: "Angry" },
  dream: { color: "#64748b", emoji: "🌙", label: "Dream" },
  "poker face": { color: "#bbbfbc", emoji: "😐", label: "Poker Face" },
};

// Fallback configuration for any custom user moods
const DEFAULT_CONFIG = { color: "#cbd5e1", emoji: "📝", label: "Other" };

export default function MoodPieChart({ moodDistribution }: MoodPieChartProps) {
  const rawEntries = Object.entries(moodDistribution);

  // if (!isMounted) {
  //   return (
  //     <div className="flex h-[250px] w-full flex-col items-center justify-center gap-3">
  //       <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-400" />
  //       <p className="text-xs font-medium text-slate-400 dark:text-slate-500 animate-pulse">
  //         Loading analytics...
  //       </p>
  //     </div>
  //   );
  // }

  if (rawEntries.length === 0) {
    return (
      <div className="flex h-[350px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
          Mood Distribution
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          No emotional data recorder for this timeframe.
        </p>
      </div>
    );
  }

  // Format dataset dynamically for Recharts injection
  const data = rawEntries.map(([mood, value]) => {
    const config = MOOD_CONFIG[mood.toLowerCase()] || DEFAULT_CONFIG;
    return {
      name: config.label,
      value,
      color: config.color,
      emoji: config.emoji,
    };
  });

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
        Mood Vibe Distribution
      </h3>

      <div className="flex flex-col items-center justify-between gap-0 mt-4">
        {/* The Graphic Canvas Block */}
        <div className="flex h-[208px] w-[220px] items-center justify-center">
          <PieChart width={220} height={208}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              shape={(props: PieSectorShapeProps) => {
                const targetPayload = props.payload as
                  | { color?: string }
                  | undefined;
                return (
                  <Sector {...props} fill={targetPayload?.color || "#cbd5e1"} />
                );
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-md dark:bg-slate-50 dark:text-slate-900">
                      <span className="mr-1">{item.emoji}</span>
                      <span className="font-semibold">{item.name}:</span>{" "}
                      {item.value} {item.value === 1 ? "entry" : "entries"}
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </div>

        {/* Legend Map Deck */}
        <div className="flex-1 grid grid-cols-2 gap-2 text-center w-full sm:w-auto">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-500 mr-1">{item.emoji}</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

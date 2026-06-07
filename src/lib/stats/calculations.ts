import {
  JournalInsights,
  MoodDistribution,
  ActivityMap,
  TagFrequency,
  MomentumPoint,
} from "@/types/insights";

// Smaller version of an entry just for these calculations
interface CalculationInput {
  mood: string;
  createdAt: Date | string;
  tags: string[];
}

// Helper type and function for the filtering by time span in the insights page
export type FilterRange = "all" | "month" | "year";

export function filterEntriesByTime(
  entries: CalculationInput[],
  range: FilterRange,
) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return entries.filter((entry) => {
    const entryDate = new Date(entry.createdAt);

    if (range === "year") {
      return entryDate.getFullYear() === currentYear;
    }

    if (range === "month") {
      return (
        entryDate.getFullYear() === currentYear &&
        entryDate.getMonth() === currentMonth
      );
    }

    return true;
  });
}

// Helper function to format a date into a clean YYYY-MM-DD
const formatDateKey = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

// Main calculation function that takes in the entries and produces the insights
export function calculateJournalInsights(
  entries: CalculationInput[],
  range: "all" | "month" | "year" = "all",
): JournalInsights {
  // Handling the empty state
  if (!entries || entries.length === 0) {
    return {
      totalEntries: 0,
      moodDistribution: {},
      mostFrequentMood: null,
      activityMap: {},
      topTags: [],
      momentum: [],
    };
  }

  // Initialize our accumulators
  const moodCounts: MoodDistribution = {};
  const activity: ActivityMap = {};
  const tagCounts: Record<string, number> = {};

  // Momentum initial buckets
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const momentumTracker: Record<string, number> = {};

  // The Single Pass Loop
  entries.forEach((entry) => {
    // --- Mood Logic ---
    const mood = entry.mood;
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;

    // --- Heatmap Logic ---
    const dateKey = formatDateKey(entry.createdAt);
    activity[dateKey] = (activity[dateKey] || 0) + 1;

    // Tag Accumulator
    if (Array.isArray(entry.tags)) {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }

    // Momentum Accumulator
    const date = new Date(entry.createdAt);
    const label =
      range === "month"
        ? daysOfWeek[date.getDay()]
        : monthsOfYear[date.getMonth()];
    momentumTracker[label] = (momentumTracker[label] || 0) + 1;
  });

  // Format top 10 tags
  const topTags: TagFrequency[] = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Format momentum chart data
  const baseArray = range === "month" ? daysOfWeek : monthsOfYear;
  const momentum: MomentumPoint[] = baseArray.map((label) => ({
    label,
    count: momentumTracker[label] || 0,
  }));

  // Determine most frequesnt mood
  const mostFrequent = Object.entries(moodCounts).reduce((a, b) =>
    b[1] > a[1] ? b : a,
  )[0];

  return {
    totalEntries: entries.length,
    moodDistribution: moodCounts,
    mostFrequentMood: mostFrequent,
    activityMap: activity,
    topTags,
    momentum,
  };
}

/**
 * Generates an array of date strings representing a rolling 1-year window (53 weeks)
 * aligned to start on the correct day of the week to maintain a perfect grid layout.
 */
export function generateHeatmapDates(): string[] {
  const dates: string[] = [];
  const today = new Date();

  // Calculate current year ending on today and going back 371 days (53 weaks * 7 days)
  const totalDays = 53 * 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (totalDays - 1));

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    dates.push(currentDate.toISOString().split("T")[0]);
  }

  return dates;
}

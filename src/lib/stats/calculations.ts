import {
  JournalInsights,
  MoodDistribution,
  ActivityMap,
} from "@/types/insights";

// Smaller version of an entry just for these calculations
interface CalculationInput {
  mood: string;
  createdAt: Date | string;
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

export function calculateJournalInsights(
  entries: CalculationInput[],
): JournalInsights {
  // Handling the empty state
  if (!entries || entries.length === 0) {
    return {
      totalEntries: 0,
      moodDistribution: {},
      mostFrequentMood: null,
      activityMap: {},
    };
  }

  // Initialize our accumulators
  const moodCounts: MoodDistribution = {};
  const activity: ActivityMap = {};

  // The Single Pass Loop
  entries.forEach((entry) => {
    // --- Mood Logic ---
    const mood = entry.mood;
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;

    // --- Heatmap Logic ---
    const dateKey = formatDateKey(entry.createdAt);
    activity[dateKey] = (activity[dateKey] || 0) + 1;
  });

  // Determine most frequesnt mood
  const mostFrequent = Object.entries(moodCounts).reduce((a, b) =>
    b[1] > a[1] ? b : a,
  )[0];

  return {
    totalEntries: entries.length,
    moodDistribution: moodCounts,
    mostFrequentMood: mostFrequent,
    activityMap: activity,
  };
}

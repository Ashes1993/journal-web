export type MoodDistribution = Record<string, number>;

export type ActivityMap = Record<string, number>;

export interface JournalInsights {
  totalEntries: number;
  moodDistribution: MoodDistribution;
  mostFrequentMood: string | null;
  activityMap: ActivityMap;
}

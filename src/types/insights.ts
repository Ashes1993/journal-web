export type MoodDistribution = Record<string, number>;
export type ActivityMap = Record<string, number>;

export interface JournalInsights {
  totalEntries: number;
  moodDistribution: MoodDistribution;
  mostFrequentMood: string | null;
  activityMap: ActivityMap;
  topTags: TagFrequency[];
  momentum: MomentumPoint[];
}

export interface TagFrequency {
  name: string;
  count: number;
}

export interface MomentumPoint {
  label: string;
  count: number;
}

import { describe, it, expect } from "vitest";
import { calculateJournalInsights } from "./calculations";

describe("Journal Insights Logic", () => {
  it("should correctly calculate totals and mood distribution", () => {
    // 1. ARRANGE
    const mockEntries = [
      {
        mood: "happy",
        createdAt: "2026-06-01T10:00:00Z",
        tags: ["random", "test1"],
      },
      {
        mood: "happy",
        createdAt: "2026-06-02T10:00:00Z",
        tags: ["random2", "test1"],
      },
      {
        mood: "sad",
        createdAt: "2026-06-03T10:00:00Z",
        tags: ["random", "test2"],
      },
      {
        mood: "poker face",
        createdAt: "2026-06-03T10:00:00Z",
        tags: ["windows", "test2"],
      },
    ];

    // 2. ACT
    const result = calculateJournalInsights(mockEntries);

    // 3. ASSERT
    expect(result.totalEntries).toBe(3);
    expect(result.moodDistribution["happy"]).toBe(2);
    expect(result.moodDistribution["sad"]).toBe(1);
    expect(result.mostFrequentMood).toBe("happy");
  });

  it("should return empty stats when given an empty array", () => {
    const result = calculateJournalInsights([]);
    expect(result.totalEntries).toBe(0);
    expect(result.mostFrequentMood).toBe(null);
  });
});

import { describe, it, expect } from "vitest";
import { calculateJournalInsights } from "./calculations";

describe("Journal Insights Logic", () => {
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

  it("should correctly calculate totals and mood distribution", () => {
    const result = calculateJournalInsights(mockEntries);

    expect(result.totalEntries).toBe(4);
    expect(result.moodDistribution["happy"]).toBe(2);
    expect(result.moodDistribution["sad"]).toBe(1);
    expect(result.mostFrequentMood).toBe("happy");
  });

  it("should accurately track multi-word moods like poker face", () => {
    const result = calculateJournalInsights(mockEntries);

    // Verifies the key preservation matches the database value perfectly
    expect(result.moodDistribution["poker face"]).toBe(1);
    expect(Object.keys(result.moodDistribution)).toContain("poker face");
  });

  it("should correctly compile, sort, and count the top topics and tags", () => {
    const result = calculateJournalInsights(mockEntries);

    // 1. Check structural constraints
    expect(Array.isArray(result.topTags)).toBe(true);

    // 2. Validate frequency calculations
    // 'test1' appears in entry 1 & 2 (count: 2)
    const test1Tag = result.topTags.find((t) => t.name === "test1");
    expect(test1Tag).toBeDefined();
    expect(test1Tag?.count).toBe(2);

    // 'windows' appears only in entry 4 (count: 1)
    const windowsTag = result.topTags.find((t) => t.name === "windows");
    expect(windowsTag).toBeDefined();
    expect(windowsTag?.count).toBe(1);

    // 3. Validate sorting array order (descending order by count)
    // The first element should have a higher or equal count to the next elements
    expect(result.topTags[0].count).toBeGreaterThanOrEqual(
      result.topTags[result.topTags.length - 1].count,
    );
  });

  it("should return empty stats when given an empty array", () => {
    const result = calculateJournalInsights([]);
    expect(result.totalEntries).toBe(0);
    expect(result.mostFrequentMood).toBe(null);
    expect(result.topTags).toEqual([]);
    expect(result.momentum).toEqual([]);
  });
});

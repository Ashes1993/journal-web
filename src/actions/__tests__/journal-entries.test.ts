import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import {
  fetchJournalEntries,
  createJournalEntry,
  deleteJournalEntry,
  fetchUserTags,
  updateJournalEntry,
  fetchJournalEntriesForMonth,
  fetchJournalEntriesForDate,
} from "../journal-entries";
import type { Entry } from "@/generated/prisma/client";

// Module-Level Isolation Mocks
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    entry: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/crypto", () => ({
  encrypt: vi.fn((text: string) => `encrypted_${text}`),
  decrypt: vi.fn((text: string) => text.replace("encrypted_", "")),
}));

// Type-Safe Mock Binding via double-casting
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const mockAuth = auth as unknown as Mock;
const mockPrismaEntry = prisma.entry as unknown as {
  findMany: Mock;
  create: Mock;
  delete: Mock;
  update: Mock;
};
const mockRevalidatePath = revalidatePath as unknown as Mock;

describe("Journal Entries Server Actions Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchJournalEntries", () => {
    it("should return success false and empty entries list if user session does not exist", async () => {
      mockAuth.mockResolvedValue(null);

      const result = await fetchJournalEntries();

      expect(result).toEqual({ success: false, entries: [] });
      expect(mockPrismaEntry.findMany).not.toHaveBeenCalled();
    });

    it("should successfully return decrypted entry lists for verified accounts", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user_123" } });

      const mockDatabaseRows = [
        {
          id: "1",
          title: "Day 1",
          content: "encrypted_hello world",
          mood: "happy",
          tags: [],
          userId: "user_123",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as unknown as Entry[];

      mockPrismaEntry.findMany.mockResolvedValue(mockDatabaseRows);

      const result = await fetchJournalEntries({ skip: 0, take: 10 });

      expect(result.success).toBe(true);
      expect(result.entries[0].content).toBe("hello world");
      expect(mockPrismaEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user_123" },
          skip: 0,
          take: 10,
        }),
      );
    });
  });

  describe("createJournalEntry", () => {
    const mockInput = {
      title: "New Log",
      content: "Secret thoughts",
      mood: "calm",
      tags: ["tech"],
    };

    it("should block registration changes if authentication signature is missing", async () => {
      mockAuth.mockResolvedValue(null);

      const result = await createJournalEntry(mockInput);

      expect(result).toEqual({
        success: false,
        error: "You must be logged in",
      });
      expect(mockPrismaEntry.create).not.toHaveBeenCalled();
    });

    it("should encrypt text content blocks and revalidate layout path dependencies upon creation", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user_123" } });
      mockPrismaEntry.create.mockResolvedValue({} as unknown as Entry);

      const result = await createJournalEntry(mockInput);

      expect(result).toEqual({ success: true });
      expect(mockPrismaEntry.create).toHaveBeenCalledWith({
        data: {
          title: "New Log",
          content: "encrypted_Secret thoughts",
          mood: "calm",
          tags: ["tech"],
          userId: "user_123",
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/");
    });

    it("should gracefully catch database runtime failures", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user_123" } });
      mockPrismaEntry.create.mockRejectedValue(
        new Error("Neon DB Timeout Network Failure"),
      );

      // Spy on console.error and mock its implementation to do nothing (silencing the output)
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await createJournalEntry(mockInput);

      expect(result).toEqual({
        success: false,
        error: "Failed to create entry",
      });

      // Verify that console.error was actually called with the expected error message
      expect(consoleSpy).toHaveBeenCalled();

      // Restore console.error to its original behavior for other tests
      consoleSpy.mockRestore();
    });
  });

  describe("deleteJournalEntry", () => {
    it("should enforce authentication rules prior to executing deletions", async () => {
      mockAuth.mockResolvedValue(null);

      const result = await deleteJournalEntry("entry_abc");

      expect(result).toEqual({
        success: false,
        error: "You must be logged in",
      });
    });

    it("should accurately query target structural IDs coupled directly to active user parameters", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user_123" } });
      mockPrismaEntry.delete.mockResolvedValue({} as unknown as Entry);

      const result = await deleteJournalEntry("entry_abc");

      expect(result).toEqual({ success: true });
      expect(mockPrismaEntry.delete).toHaveBeenCalledWith({
        where: { id: "entry_abc", userId: "user_123" },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/");
    });
  });

  describe("fetchUserTags", () => {
    it("should aggregate flat unique tag lists completely filtered across multi-row responses", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user_123" } });

      const mockDatabaseTagsResponse = [
        { tags: ["ideas", "journal"] },
        { tags: ["journal", "health"] },
      ] as unknown as Array<{ tags: string[] }>;

      mockPrismaEntry.findMany.mockResolvedValue(mockDatabaseTagsResponse);

      const result = await fetchUserTags();

      expect(result).toEqual({
        success: true,
        tags: ["ideas", "journal", "health"],
      });
    });
  });

  describe("updateJournalEntry", () => {
    it("should apply precise cryptographic modification values while mapping updates", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user_123" } });
      mockPrismaEntry.update.mockResolvedValue({} as unknown as Entry);

      const updatedPayload = {
        title: "Updated",
        content: "New text info",
        mood: "neutral",
        tags: [],
      };
      const result = await updateJournalEntry("entry_xyz", updatedPayload);

      expect(result).toEqual({ success: true });
      expect(mockPrismaEntry.update).toHaveBeenCalledWith({
        where: { id: "entry_xyz", userId: "user_123" },
        data: {
          title: "Updated",
          content: "encrypted_New text info",
          mood: "neutral",
          tags: [],
        },
      });
    });
  });

  describe("fetchJournalEntriesForMonth", () => {
    it("should generate proper isolation boundary dates for structural calculations", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user_123" } });

      const mockDatesResponse = [
        { createdAt: new Date(2026, 5, 15) },
      ] as unknown as Array<{ createdAt: Date }>;
      mockPrismaEntry.findMany.mockResolvedValue(mockDatesResponse);

      const result = await fetchJournalEntriesForMonth(2026, 5);

      expect(result.success).toBe(true);
      expect(mockPrismaEntry.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user_123",
          createdAt: {
            gte: new Date(2026, 5, 1),
            lte: new Date(2026, 6, 0, 23, 59, 59, 999),
          },
        },
        select: { createdAt: true },
      });
    });
  });

  describe("fetchJournalEntriesForDate", () => {
    it("should accurately span target arrays strictly beginning from midnight up to full day termination", async () => {
      mockAuth.mockResolvedValue({ user: { id: "user_123" } });
      mockPrismaEntry.findMany.mockResolvedValue([] as unknown as Entry[]);

      const targetDate = new Date(2026, 5, 14);
      await fetchJournalEntriesForDate(targetDate.toISOString());

      const expectedStart = new Date(targetDate);
      expectedStart.setHours(0, 0, 0, 0);

      const expectedEnd = new Date(targetDate);
      expectedEnd.setHours(23, 59, 59, 999);

      expect(mockPrismaEntry.findMany).toHaveBeenCalledWith({
        where: {
          userId: "user_123",
          createdAt: {
            gte: expectedStart,
            lte: expectedEnd,
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });
  });
});

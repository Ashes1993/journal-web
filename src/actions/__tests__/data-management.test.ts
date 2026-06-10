import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  exportJournalData,
  deleteAllEntries,
  deleteAccount,
} from "../user-actions";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Structural mocks for database, authentication, and caching headers
vi.mock("@/lib/db", () => ({
  prisma: {
    entry: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    user: {
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockAuthEngine = auth as unknown as Mock;

describe("data-management server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ========================================================================
     exportJournalData Tests
     ======================================================================== */
  describe("exportJournalData", () => {
    it("should reject unauthenticated data export requests", async () => {
      mockAuthEngine.mockResolvedValue(null);

      const result = await exportJournalData();

      expect(result).toEqual({ success: false, error: "Unauthorized." });
      expect(prisma.entry.findMany).not.toHaveBeenCalled();
    });

    it("should return all user entries for an authenticated request", async () => {
      mockAuthEngine.mockResolvedValue({ user: { id: "user-123" } });

      const mockEntries = [
        { id: "entry-1", title: "Day 1", content: "Hello", userId: "user-123" },
        { id: "entry-2", title: "Day 2", content: "World", userId: "user-123" },
      ];

      vi.mocked(prisma.entry.findMany).mockResolvedValue(
        mockEntries as unknown as Awaited<
          ReturnType<typeof prisma.entry.findMany>
        >,
      );

      const result = await exportJournalData();

      expect(result).toEqual({ success: true, data: mockEntries });
      expect(prisma.entry.findMany).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  /* ========================================================================
     deleteAllEntries Tests
     ======================================================================== */
  describe("deleteAllEntries", () => {
    it("should reject unauthenticated mass erasure requests", async () => {
      mockAuthEngine.mockResolvedValue(null);

      const result = await deleteAllEntries();

      expect(result).toEqual({ success: false, error: "Unauthorized." });
      expect(prisma.entry.deleteMany).not.toHaveBeenCalled();
    });

    it("should clear entries and revalidate the layout cache on success", async () => {
      mockAuthEngine.mockResolvedValue({ user: { id: "user-123" } });
      vi.mocked(prisma.entry.deleteMany).mockResolvedValue({ count: 5 });

      const result = await deleteAllEntries();

      expect(result).toEqual({ success: true });
      expect(prisma.entry.deleteMany).toHaveBeenCalledWith({
        where: { userId: "user-123" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/profile");
    });
  });

  /* ========================================================================
     deleteAccount Tests
     ======================================================================== */
  describe("deleteAccount", () => {
    it("should reject unauthenticated termination requests", async () => {
      mockAuthEngine.mockResolvedValue(null);

      const result = await deleteAccount();

      expect(result).toEqual({ success: false, error: "Unauthorized." });
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it("should delete the root user record from the database database", async () => {
      mockAuthEngine.mockResolvedValue({ user: { id: "user-123" } });

      vi.mocked(prisma.user.delete).mockResolvedValue({
        id: "user-123",
      } as unknown as Awaited<ReturnType<typeof prisma.user.delete>>);

      const result = await deleteAccount();

      expect(result).toEqual({ success: true });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
    });
  });
});

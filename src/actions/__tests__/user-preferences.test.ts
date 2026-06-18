import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { updateDefaultMood } from "../user-actions";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

// Establish structural mocks for external boundaries
vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Cast complex module exports to explicit mock functions to resolve NextMiddleware type conflicts
const mockAuthEngine = auth as unknown as Mock;

describe("user-preferences server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail gracefully if the network request lacks an active auth session", async () => {
    // Safely sets the return value without type alignment errors
    mockAuthEngine.mockResolvedValue(null);

    const result = await updateDefaultMood("happy");

    expect(result).toEqual({ success: false, error: "Unauthorized access." });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should block and reject a mood update if the value is not in the allowed pool", async () => {
    mockAuthEngine.mockResolvedValue({
      user: { id: "test-user-uuid" },
      expires: "2026-06-09T20:58:35.000Z",
    });

    const result = await updateDefaultMood("malicious_mood_payload");

    expect(result).toEqual({
      success: false,
      error: "Invalid mood selection value.",
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should successfully update the database when given valid data and session", async () => {
    mockAuthEngine.mockResolvedValue({
      user: { id: "test-user-uuid" },
      expires: "2026-06-09T20:58:35.000Z",
    });

    // Uses Awaited and ReturnType inference to satisfy Prisma's deep types
    vi.mocked(prisma.user.update).mockResolvedValue({
      id: "test-user-uuid",
      defaultMood: "excited",
    } as unknown as Awaited<ReturnType<typeof prisma.user.update>>);

    const result = await updateDefaultMood("EXCITED");

    expect(result).toEqual({ success: true });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "test-user-uuid" },
      data: { defaultMood: "excited" },
    });
  });
});

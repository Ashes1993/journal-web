"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { Entry } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { encrypt, decrypt } from "@/lib/crypto";

// Type Omit to exclude id and createdAt from the Entry type
export type CreateEntryInput = Omit<
  Entry,
  "id" | "createdAt" | "userId" | "updatedAt"
>;

// Server action to fetch journal entries for the authenticated user
export async function fetchJournalEntries({
  skip = 0,
  take,
}: { skip?: number; take?: number } = {}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, entries: [] };

  const journalEntries = (await prisma.entry.findMany({
    where: {
      userId: userId || undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: skip,
    ...(take !== undefined ? { take } : {}),
  })) as Entry[];

  // Decrypt data streams safely before exposing to client layouts
  const decryptedEntries = journalEntries.map((entry) => ({
    ...entry,
    content: decrypt(entry.content),
  }));
  return { success: true, entries: decryptedEntries };
}

// Server action to create a new journal entry for the authenticated user
export async function createJournalEntry(data: CreateEntryInput) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "You must be logged in" };
    }

    await prisma.entry.create({
      data: {
        title: data.title,
        content: encrypt(data.content),
        mood: data.mood,
        tags: data.tags,
        userId: userId,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to create entry" };
  }
}

// Server action to delete a journal entry by its ID for the authenticated user
export async function deleteJournalEntry(entryId: string) {
  // Check for authentication for security purposes before allowing deletion
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  try {
    await prisma.entry.delete({
      where: {
        id: entryId,
        userId: session.user.id,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to delete entry" };
  }
}

// Server action to fetch user tags for the authenticated user
export async function fetchUserTags() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, error: "You must be logged in" };

  try {
    const tags = await prisma.entry.findMany({
      where: { userId: userId || undefined },
      select: {
        tags: true,
      },
    });
    const uniqueTags = Array.from(new Set(tags.flatMap((entry) => entry.tags)));
    return { success: true, tags: uniqueTags };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to fetch tags" };
  }
}

// Server action to update a journal entry by its ID for the authenticated user
export async function updateJournalEntry(
  entryId: string,
  data: CreateEntryInput,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in" };
  }

  try {
    await prisma.entry.update({
      where: {
        id: entryId,
        userId: session.user.id,
      },
      data: {
        title: data.title,
        content: encrypt(data.content),
        mood: data.mood,
        tags: data.tags,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to update entry" };
  }
}

// Server action to fetch journal entries for currently visible month in calendar view for the authenticated user
export async function fetchJournalEntriesForMonth(year: number, month: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, entries: [] };

  try {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const entries = await prisma.entry.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });
    return { success: true, entries: entries };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, entries: [] };
  }
}

// Server action to fetch journal entries for a specific date for the authenticated user
export async function fetchJournalEntriesForDate(date: Date) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, entries: [] };

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const entries = await prisma.entry.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const decryptedEntries = entries.map((entry) => ({
      ...entry,
      content: decrypt(entry.content),
    }));

    return { success: true, entries: decryptedEntries };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, entries: [] };
  }
}

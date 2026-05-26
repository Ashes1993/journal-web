"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { Entry } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

// Type Omit to exclude id and createdAt from the Entry type
export type CreateEntryInput = Omit<
  Entry,
  "id" | "createdAt" | "userId" | "updatedAt"
>;

// Server action to fetch journal entries for the authenticated user
export async function fetchJournalEntries() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return [];

  const journalEntries: object[] = await prisma.entry.findMany({
    where: {
      userId: userId || undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return journalEntries;
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
        content: data.content,
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

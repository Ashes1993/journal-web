"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const ALLOWED_MOODS = [
  "happy",
  "sad",
  "excited",
  "angry",
  "dream",
  "poker face",
];

// Server action to update the default mood
export async function updateDefaultMood(mood: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized access." };
    }

    // Validate the target input string defensive against malicious payloads
    const normalizedMood = mood.toLowerCase();
    if (!ALLOWED_MOODS.includes(normalizedMood)) {
      return { success: false, error: "Invalid mood selection value." };
    }

    // Update the value in database
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: { defaultMood: normalizedMood },
    });

    // Revalidate the profile page to avoid caching
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Failed to update user default mood preference:", error);
    return { success: false, error: "Internal server error occurred." };
  }
}

// Exports all of the users' entries.
export async function exportJournalData() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized." };

    const entries = await prisma.entry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: entries };
  } catch (error) {
    console.error("Export Failure:", error);
    return { success: false, error: "Failed to compile journal data." };
  }
}

// Server action to delete all journal entries
export async function deleteAllEntries() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized." };

    await prisma.entry.deleteMany({
      where: { userId: session.user.id },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Mass erasure failure:", error);
    return { success: false, error: "Failed to clear journal entries." };
  }
}

// Server action to delete the user and all relational data
export async function deleteAccount() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized." };

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Account termination failure:", error);
    return { success: false, error: "Failed to terminate user account." };
  }
}

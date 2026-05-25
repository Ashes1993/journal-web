"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function fetchJournalEntries() {
  const session = await auth();
  const userId = session?.user?.id;

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

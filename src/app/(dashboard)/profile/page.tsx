import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileContainer from "@/components/profile/ProfileContainer";

export const metadata = {
  title: "Profile | Reflect",
  description:
    "Manage your profile identity, user preferences, and personal data.",
};

export default async function ProfilePage() {
  // 1. Intercept context to check for active security tokens
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Query Postgres directly for metadata fields missing from base OAuth session tokens
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      createdAt: true,
      defaultMood: true,
    },
  });

  if (!userData) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-900/20">
      <ProfileContainer user={userData} />
    </main>
  );
}

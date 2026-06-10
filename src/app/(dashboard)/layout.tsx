import SideBar from "@/components/SideBar";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ModalProvider from "@/components/modals/ModalProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  // Route guard: Redirect unauthenticated users safely
  if (!userId) {
    redirect("/login");
  }

  // Get the default mood to pass onto the Modal Provider
  const dbUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      defaultMood: true,
      name: true,
    },
  });

  const defaultMoodString = dbUser?.defaultMood || "happy";

  const liveUserPayload = session?.user
    ? {
        ...session.user,
        name: dbUser?.name || session.user.name,
      }
    : undefined;

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Structural Sidebar Layer */}
      <SideBar user={liveUserPayload} />

      {/* Main Content Area Viewport */}
      <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-4 md:p-6 lg:p-8">
        <section className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/60 rounded-2xl shadow-sm p-4 md:p-6 overflow-x-hidden">
          {children}
        </section>
      </main>
      <ModalProvider defaultMood={defaultMoodString} />
    </div>
  );
}

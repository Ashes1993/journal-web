import SideBar from "@/components/SideBar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Route guard: Redirect unauthenticated users safely
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Structural Sidebar Layer */}
      <SideBar user={session?.user ?? undefined} />

      {/* Main Content Area Viewport */}
      <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-4 md:p-6 lg:p-8">
        <section className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/60 rounded-2xl shadow-sm p-4 md:p-6 overflow-x-hidden">
          {children}
        </section>
      </main>
    </div>
  );
}

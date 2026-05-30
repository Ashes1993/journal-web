import SideBar from "@/components/SideBar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if the user is authenticated, if not redirect to the login page
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen p-4 bg-gray-100">
      <SideBar user={session?.user ?? undefined} />
      <section className="flex-1 p-4 border border-gray-200 rounded-2xl shadow-2xl shadow-gray-400">
        {children}
      </section>
    </main>
  );
}

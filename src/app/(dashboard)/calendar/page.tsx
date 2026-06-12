import CalendarView from "@/components/calendar/CalendarView";

export const metadata = {
  title: "Calendar | Reflect",
  description:
    "Browse and navigate your personal journal entries by date with an interactive calendar view. Revisit your emotional history, daily logs, and past reflections effortlessly.",
};

export default function Calendar() {
  return (
    <main className="flex-1 min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-app-text">
          Calendar
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-3xl">
          Take a step back to view your journey. Click on any date to revisit
          your past reflections, track emotional trends, and browse historic
          daily logs.
        </p>
      </header>
      <section className="mt-6">
        <CalendarView />
      </section>
    </main>
  );
}

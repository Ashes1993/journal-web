import CalendarView from "@/components/calendar/CalendarView";

export default function Calendar() {
  return (
    <main className="flex-1 min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-app-text">
          Calendar
        </h1>
      </header>
      <section>
        <CalendarView />
      </section>
    </main>
  );
}

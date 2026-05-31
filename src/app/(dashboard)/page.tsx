import AddEntryContainer from "@/components/home/AddEntryContainer";
import JournalList from "@/components/home/JournalList";

export default function Home() {
  return (
    <main className="flex-1 min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-app-text">
            My Journal
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Capture your thoughts, noods, and milestones.
          </p>
        </header>

        <section>
          <JournalList />
        </section>
      </div>

      <AddEntryContainer />
    </main>
  );
}

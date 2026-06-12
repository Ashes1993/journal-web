import InsightsDashboard from "@/components/insights/InsightsDashboard";

export const metadata = {
  title: "Insights | Reflect",
  description:
    "Gain a deeper understanding of your habits and emotions with interactive journal analytics. Track mood distributions, view writing activity heatmaps, and discover your most frequent tags over time.",
};

export default function InsightsPage() {
  return (
    <main className="flex-1 min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      <header className="space-y-2 mb-5">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-app-text">
          Insights
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-3xl">
          Understand your mind over time. Visualize your emotional
          distributions, track your writing consistency, and uncover meaningful
          patterns across your daily reflections.
        </p>
      </header>
      <section className="mt-4">
        <InsightsDashboard />
      </section>
    </main>
  );
}

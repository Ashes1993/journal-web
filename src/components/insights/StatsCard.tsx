export default function StatsCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-lg bg-white p-6 shadow-sm border border-muted-border dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-2">
        <h3 className="text-sm text-center font-medium tracking-tight text-slate-500 dark:text-slate-400">
          {label}
        </h3>
        <p className="text-3xl text-center font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {value.toUpperCase()}
        </p>
      </div>

      <div className="text-slate-400 dark:text-slate-500">{icon}</div>
    </div>
  );
}

interface LoadingStateProps {
  /** Custom loading description string. Defaults to journal analysis text. */
  message?: string;
  /** Custom height classification utility. Defaults to 'h-[60vh]'. */
  heightClassName?: string;
}

export default function LoadingState({
  message = "Analyzing your journal entries...",
  heightClassName = "h-[60vh]",
}: LoadingStateProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-3 ${heightClassName}`}
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-400"
        role="status"
        aria-label="loading"
      />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
        {message}
      </p>
    </div>
  );
}

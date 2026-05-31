"use client";

interface JournalLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "w-5 h-5 text-current",
  md: "w-10 h-10 text-blue-500",
  lg: "w-16 h-16 text-blue-600",
};

export default function JournalLoader({
  size = "md",
  className = "",
}: JournalLoaderProps) {
  const sizeClass = SIZE_MAP[size];

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={`${sizeClass} animate-spin-slow`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fountain Pen Nib Silhouette */}
        <path
          d="M12 2L16 8V11L14 13V17H10V13L8 11V8L12 2Z"
          className="fill-current opacity-90 animate-pulse"
        />
        {/* Ink Feed Split line */}
        <line
          x1="12"
          y1="2"
          x2="12"
          y2="9"
          className="stroke-white dark:stroke-slate-900"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Circular Ink Breather Hole */}
        <circle
          cx="12"
          cy="9"
          r="1"
          className="fill-white dark:fill-slate-900"
        />
        {/* Dynamic Looping Ink Loop Outer Path */}
        <path
          d="M4 12C4 7.58172 7.58172 4 12 4"
          className="stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="10 20"
        />
      </svg>
    </div>
  );
}

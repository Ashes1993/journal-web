"use client";

import { Plus } from "lucide-react";

export default function AddEntryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Add new journal entry"
      className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 
                 flex items-center justify-center h-14 w-14 
                 bg-blue-600 text-white rounded-full shadow-lg 
                 hover:bg-blue-700 hover:scale-110 active:scale-95 
                 transition-all duration-200 group ring-4 ring-white dark:ring-slate-950 cursor-pointer"
    >
      <Plus className="w-8 h-8 transition-transform group-hover:rotate-90" />
    </button>
  );
}

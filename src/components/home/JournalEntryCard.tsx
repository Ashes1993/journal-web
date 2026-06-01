"use client";

import { deleteJournalEntry } from "@/actions/journal-entries";
import { useJournalStore } from "@/store/useJournalStore";
import { Entry } from "@/generated/prisma/client";
import { Trash2 } from "lucide-react";

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  excited: "🤩",
  angry: "😡",
  dream: "🌙",
  "poker face": "😐",
};

export default function JournalEntryCard({ entry }: { entry: Entry }) {
  const { openModal, removeEntry, setIsDeleting, isDeleting } =
    useJournalStore();

  const isThisDeleting = isDeleting === entry.id;

  // Format the creation date nicely
  const formatDate = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Delete handler with confirmation and loading state
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to permanently purge this entry?"))
      return;

    try {
      setIsDeleting(entry.id);
      const response = await deleteJournalEntry(entry.id);
      if (response.success) {
        removeEntry(entry.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div
      onClick={() => openModal(entry)}
      className="p-5 border border-muted-border rounded-2xl bg-card shadow-xs flex flex-col h-full justify-between gap-4 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 group active:scale-[0.98] active:shadow-inner"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              {formatDate(entry.createdAt)}
            </span>
            <h2 className="text-lg font-bold text-app-text leading-snug group-hover:text-blue-600 transition-colors">
              {entry.title}
            </h2>
          </div>
          <span
            className="text-2xl p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-muted-border shrink-0"
            title={entry.mood}
          >
            {MOOD_EMOJIS[entry.mood] || "📝"}
          </span>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap line-clamp-3">
          {entry.content}
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium px-2.5 py-0.5 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-1 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isThisDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isThisDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

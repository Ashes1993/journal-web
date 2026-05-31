"use client";

import { useState } from "react";
import { deleteJournalEntry } from "@/actions/journal-entries";
import { useJournalStore } from "@/store/useJournalStore";
import { Entry } from "@/generated/prisma/client";
import { Edit2, Trash2 } from "lucide-react";

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  excited: "🤩",
  angry: "😡",
  dream: "🌙",
  "poker face": "😐",
};

export default function JournalEntryCard({ entry }: { entry: Entry }) {
  const openModal = useJournalStore((state) => state.openModal);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Format the creation date nicely
  const formatDate = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently purge this entry?"))
      return;

    setIsDeleting(true);
    try {
      const response = await deleteJournalEntry(entry.id);
      if (!response.success) {
        alert(response.error || "Failed to complete deletion routine.");
      }
    } catch (err) {
      console.error(err);
      alert("Network transport error during data purge execution.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    /* Changed root node from <li> to <div> to prevent invalid nested lists */
    /* Added h-full and removed m-4 to let the parent CSS Grid manage spacing */
    <div className="p-5 border border-muted-border rounded-2xl bg-card shadow-xs flex flex-col h-full justify-between gap-4 transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 group">
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

        {/* line-clamp-3 caps text overflow cleanly in responsive multi-column environments */}
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
            onClick={() => openModal(entry)}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

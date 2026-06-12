"use client";

import { deleteJournalEntry } from "@/actions/journal-entries";
import { useJournalStore } from "@/store/useJournalStore";
import { Entry } from "@/generated/prisma/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  excited: "🤩",
  angry: "😡",
  dream: "🌙",
  "poker face": "😐",
};

export default function JournalEntryCard({
  entry,
  onDeleteSuccess,
}: {
  entry: Entry;
  onDeleteSuccess?: (id: string) => void;
}) {
  const { openModal, removeEntry, setIsDeleting, isDeleting } =
    useJournalStore();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

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

  // Trigger Delete Confirmation
  const triggerDeletePrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const executePurge = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDeleting(entry.id);
      const response = await deleteJournalEntry(entry.id);
      if (response.success) {
        removeEntry(entry.id);
        if (onDeleteSuccess) onDeleteSuccess(entry.id);
      }
    } catch (error) {
      console.error("Failed to delete entry:", error);
    } finally {
      setIsDeleting(null);
      setShowConfirm(false);
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
            onClick={triggerDeletePrompt}
            disabled={isThisDeleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isThisDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {showConfirm &&
        createPortal(
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-100"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-muted-border p-6 rounded-2xl max-w-sm w-full shadow-xl space-y-4 scale-in duration-150"
            >
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Purge Entry?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you completely sure? This removes your written reflections
                  and mood tracking data for this entry permanently.
                </p>
              </div>
              <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirm(false);
                  }}
                  className="px-4 py-2 border border-muted-border hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executePurge}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

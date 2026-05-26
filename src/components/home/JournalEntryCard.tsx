"use client";

import { useState } from "react";
import { deleteJournalEntry } from "@/actions/journal-entries";
import { useJournalStore } from "@/store/useJournalStore";
import { Entry } from "@/generated/prisma/client"; // Force alignment with store expectations

const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  excited: "🤩",
  angry: "😡",
  dream: "🌙",
  "poker face": "😐",
};

export default function JournalEntryCard({ entry }: { entry: Entry }) {
  // 1. [ZUSTAND]: Bind trigger to push this card instance data payload into store context
  const openModal = useJournalStore((state) => state.openModal);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
    // Redundant key={entry.id} removed from root node container element
    <li className="m-4 p-5 border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col justify-between space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">{entry.title}</h2>
          {/* Displaying corresponding mood emojis */}
          <span className="text-2xl" title={entry.mood}>
            {MOOD_EMOJIS[entry.mood]}
          </span>
        </div>
        <p className="text-slate-600 text-sm whitespace-pre-wrap mt-2">
          {entry.content}
        </p>
      </div>

      <div className="space-y-3">
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Improved UX Interactive Control Interface Footer Zone */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => openModal(entry)}
            disabled={isDeleting}
            className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-40"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </li>
  );
}

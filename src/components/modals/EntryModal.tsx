"use client";

import {
  createJournalEntry,
  updateJournalEntry,
  fetchUserTags,
} from "@/actions/journal-entries";
import { useState, useEffect } from "react";
import { useJournalStore } from "@/store/useJournalStore";
import { X } from "lucide-react";
import { Entry } from "@/generated/prisma/client";

interface JournalActionResponse {
  success: boolean;
  entry: Entry;
  error?: string;
}

const MOOD_OPTIONS = [
  { label: "happy", emoji: "😊" },
  { label: "sad", emoji: "😢" },
  { label: "excited", emoji: "🤩" },
  { label: "angry", emoji: "😡" },
  { label: "dream", emoji: "🌙" },
  { label: "poker face", emoji: "😐" },
];

export default function EntryModal() {
  const { editingEntry, closeModal, updateEntry } = useJournalStore();

  const [selectedMood, setSelectedMood] = useState(
    editingEntry?.mood || "happy",
  );
  const [title, setTitle] = useState(editingEntry?.title || "");
  const [content, setContent] = useState(editingEntry?.content || "");
  const [activeTags, setActiveTags] = useState<string[]>(
    editingEntry?.tags || [],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allHistoricalTags, setAllHistoricalTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  useEffect(() => {
    fetchUserTags().then((tags) => {
      setAllHistoricalTags(tags.tags as string[]);
    });
  }, []);

  const filteredTagSuggestions = allHistoricalTags.filter(
    (tag) =>
      tag.toLowerCase().includes(newTagInput.toLowerCase()) &&
      !activeTags.includes(tag),
  );

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !activeTags.includes(trimmed)) {
      setActiveTags([...activeTags, trimmed]);
      setNewTagInput("");
    }
  };

  // Removed unused 'formData' to fix ESLint error
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const entryData = {
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
      tags: activeTags,
    };

    if (!entryData.title) {
      alert("Please provide a title.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingEntry) {
        // Cast response or handle the union type specifically
        const response = (await updateJournalEntry(
          editingEntry.id,
          entryData,
        )) as JournalActionResponse;
        if (response.success) {
          updateEntry(response.entry);
          closeModal();
        } else {
          alert(response.error || "Failed to update.");
        }
      } else {
        const response = await createJournalEntry(entryData);
        if (response.success) {
          closeModal();
        }
      }
    } catch (error) {
      console.error("Save Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-end md:items-center justify-center bg-slate-950/60 backdrop-blur-sm z-[100] p-0 md:p-4"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <form
        className="relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl w-full max-h-[95vh] md:max-h-[85vh] h-auto gap-6 md:max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          onClick={closeModal}
        >
          <X className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder="Give it a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-black bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-800"
          disabled={isSubmitting}
        />

        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full flex-1 min-h-[150px] bg-transparent text-lg resize-none focus:outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 leading-relaxed"
          disabled={isSubmitting}
        />

        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Current Mood
          </p>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                type="button"
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
                  selectedMood === mood.label
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-500"
                }`}
              >
                <span>{mood.emoji}</span>
                <span className="text-xs font-bold capitalize">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Tags
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {activeTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() =>
                    setActiveTags(activeTags.filter((t) => t !== tag))
                  }
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Add tag..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag(newTagInput);
                }
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
            {newTagInput && filteredTagSuggestions.length > 0 && (
              <div className="absolute bottom-full mb-2 left-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-10">
                {filteredTagSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddTag(s)}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-400"
                  >
                    #{s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting
            ? "PROCESSING..."
            : editingEntry
              ? "UPDATE MEMORY"
              : "SAVE MEMORY"}
        </button>
      </form>
    </div>
  );
}

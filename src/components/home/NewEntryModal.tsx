"use client";
import { createJournalEntry } from "@/actions/journal-entries";
import { updateJournalEntry } from "@/actions/journal-entries";
import { fetchUserTags } from "@/actions/journal-entries";
import { useState, useEffect } from "react";
import { useJournalStore } from "@/store/useJournalStore";

const MOOD_OPTIONS = [
  { label: "happy", emoji: "😊" },
  { label: "sad", emoji: "😢" },
  { label: "excited", emoji: "🤩" },
  { label: "angry", emoji: "😡" },
  { label: "dream", emoji: "🌙" },
  { label: "poker face", emoji: "😐" },
];

export default function NewEntryModal() {
  const { editingEntry, closeModal } = useJournalStore();

  // States to track the user input for the journal entry form
  const [selectedMood, setSelectedMood] = useState(
    editingEntry?.mood || "happy",
  );
  const [title, setTitle] = useState<string>(editingEntry?.title || "");
  const [content, setContent] = useState<string>(editingEntry?.content || "");

  // UI state to disable controls during active database execution pipelines
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Tags state to manage the list of tags input by the user for the journal entry
  const [allHistoricalTags, setAllHistoricalTags] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>("");

  // Fetch user tags when the component mounts to populate the tag suggestions for the journal entry form
  useEffect(() => {
    fetchUserTags().then((tags) => {
      setAllHistoricalTags(tags.tags as string[]);
    });
  }, []);

  // Live filtering of historical tags based on the user's input in the new tag field to provide tag suggestions
  const filteredTagSuggestions = allHistoricalTags.filter(
    (tag) =>
      tag.toLowerCase().includes(newTagInput.toLowerCase()) &&
      !activeTags.includes(tag),
  );

  // Function to handle adding a new tag to the active tags list when the user submits a new tag
  const handleAddTag = (tag: string) => {
    if (!activeTags.includes(tag)) {
      setActiveTags([...activeTags, tag]);
      setNewTagInput("");
    }
  };

  // Handle form submission to create a new journal entry
  async function handleFormAction(formData: FormData) {
    setIsSubmitting(true);

    let response: { success: boolean; error?: string } = { success: false };

    try {
      // Extracting data
      const rawTitle = formData.get("title") as string;
      const rawContent = formData.get("content") as string;
      const mood = formData.get("mood") as string;
      const rawTags = formData.get("tags") as string;

      // Formatting the data for the server action
      const entryData = {
        title: rawTitle.trim(),
        content: rawContent.trim(),
        mood,
        tags: rawTags ? JSON.parse(rawTags) : [],
      };

      if (!entryData.title) {
        alert("A descriptive title is required.");
        return;
      }

      if (editingEntry) {
        response = await updateJournalEntry(editingEntry.id, entryData);
      } else {
        response = await createJournalEntry(entryData);
      }

      if (response.success) {
        closeModal();
      } else {
        alert(
          response.error || "A processing exception occurred on the cluster.",
        );
      }
    } catch (error) {
      console.error("System Crash Intercepted:", error);
      alert(
        "Network transport layer failure. Please verify connection credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div
      className="fixed inset-0 w-full h-full flex items-end md:items-center justify-center bg-slate-950/40 backdrop-blur-xs z-50 p-0 md:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <form
        className="relative flex flex-col bg-card border border-muted-border p-6 rounded-t-3xl md:rounded-2xl shadow-xl w-full max-h-[92vh] md:max-h-[85vh] h-auto gap-5 md:max-w-xl transition-all animate-fade-slide-up"
        action={handleFormAction}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          onClick={closeModal}
          aria-label="Close dialog"
        >
          &times;
        </button>

        {/* Title Field */}
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[calc(100%-2rem)] text-2xl font-bold bg-transparent py-1 border-b border-transparent focus:border-blue-500 focus:outline-none transition-colors text-app-text placeholder:text-slate-300 dark:placeholder:text-slate-700"
            disabled={isSubmitting}
          />
        </div>

        {/* Content Textarea */}
        <div className="flex flex-col flex-1 min-h-[120px]">
          <textarea
            placeholder="Write down your thoughts..."
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-input-base flex-1 resize-none h-32 md:h-44"
            disabled={isSubmitting}
          ></textarea>
        </div>

        {/* Mood Selector */}
        <input type="hidden" name="mood" value={selectedMood} />
        <div className="border-y border-muted-border py-3 flex flex-col gap-2">
          <label
            htmlFor="mood-options"
            className="text-xs font-bold uppercase tracking-wider text-slate-400"
          >
            Current Mood
          </label>
          <div id="mood-options" className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = selectedMood === mood.label;
              return (
                <button
                  type="button"
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`text-xl px-3 py-1.5 rounded-xl transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-600 dark:text-blue-400 font-medium scale-105 shadow-2xs"
                      : "bg-white dark:bg-slate-900 border-muted-border text-slate-600 dark:text-slate-400 hover:border-slate-400 opacity-70 hover:opacity-100"
                  }`}
                  title={mood.label}
                >
                  <span>{mood.emoji}</span>
                  <span className="text-xs font-medium capitalize">
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags Control Component */}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tags
          </label>

          {/* Active Pills Display Wrap */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {activeTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTags(activeTags.filter((t) => t !== tag))
                    }
                    className="text-slate-400 hover:text-red-500 font-bold transition-colors ml-0.5 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggestive Tag Input Container */}
          <div className="relative">
            <input
              type="text"
              placeholder="Type a tag and press Enter..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTagInput.trim() !== "") {
                  e.preventDefault();
                  handleAddTag(newTagInput.trim());
                }
              }}
              className="form-input-base"
            />

            {/* Dropdown Suggestions Menu */}
            {newTagInput && filteredTagSuggestions.length > 0 && (
              <ul className="absolute top-full mt-1 left-0 right-0 border border-muted-border rounded-xl shadow-lg max-h-32 overflow-y-auto bg-white dark:bg-slate-900 z-50 divide-y divide-muted-border">
                {filteredTagSuggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    onClick={() => handleAddTag(suggestion)}
                    className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    #{suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Hidden tag state stringification payload block */}
        <input type="hidden" name="tags" value={JSON.stringify(activeTags)} />

        {/* Execution Actions Button */}
        <div className="flex justify-end pt-2 mt-auto">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md-w-auto font-medium px-5 py-2.5 text-sm text-white rounded-xl shadow-sm transition-all cursor-pointer ${
              isSubmitting
                ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98"
            }`}
          >
            {isSubmitting
              ? "Saving entry..."
              : editingEntry
                ? "Update Entry"
                : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}

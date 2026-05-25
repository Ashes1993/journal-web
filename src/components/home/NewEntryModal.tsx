"use client";
import { createJournalEntry } from "@/actions/journal-entries";
import { fetchUserTags } from "@/actions/journal-entries";
import { useState, useEffect } from "react";

interface NewEntryModalProps {
  onClose: () => void;
}

const MOOD_OPTIONS = [
  { label: "happy", emoji: "😊" },
  { label: "sad", emoji: "😢" },
  { label: "excited", emoji: "🤩" },
  { label: "angry", emoji: "😡" },
  { label: "dream", emoji: "🌙" },
  { label: "poker face", emoji: "😐" },
];

export default function NewEntryModal({ onClose }: NewEntryModalProps) {
  // Selected mood state to track the user's mood selection in the form
  const [selectedMood, setSelectedMood] = useState<string>("happy");

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

    // Trigger the action
    const result = await createJournalEntry(entryData);

    // Reactivate UI logic
    if (result.success) {
      onClose();
    } else {
      alert(result.error || "Failed to create entry");
    }
  }
  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-slate-900/20 backdrop-blur-xs z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        className="flex flex-col bg-white p-6 rounded-2xl shadow-md w-2/3 h-2/3"
        action={handleFormAction}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <input type="text" placeholder="Title" name="title" />

        <textarea placeholder="Content" name="content"></textarea>

        <input type="hidden" name="mood" value={selectedMood} />

        <div>
          <label htmlFor="mood">Mood:</label>
          {MOOD_OPTIONS.map((mood) => {
            return (
              <button
                type="button"
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`text-2xl p-1 m-2 rounded-xl transition-all ${
                  selectedMood === mood.label
                    ? "bg-blue-100 scale-125 border border-blue-400"
                    : "hover:scale-110 opacity-60 hover:opacity-100"
                }`}
                title={mood.label}
              >
                {mood.emoji}
              </button>
            );
          })}
        </div>

        <div>
          <div>
            {activeTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-full m-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    setActiveTags(activeTags.filter((t) => t !== tag))
                  }
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder="Add tag"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTagInput.trim() !== "") {
                e.preventDefault();
                handleAddTag(newTagInput.trim());
              }
            }}
            className="w-full border p-2 rounded"
          />
          {/* The Suggestion Dropdown */}
          {newTagInput && filteredTagSuggestions.length > 0 && (
            <ul className="border rounded shadow-sm max-h-32 overflow-y-auto bg-white">
              {filteredTagSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleAddTag(suggestion)}
                  className="p-2 hover:bg-slate-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* The Hidden Payload for the Server Action */}
        <input type="hidden" name="tags" value={JSON.stringify(activeTags)} />

        <button
          type="submit"
          className="mt-auto ml-auto bg-blue-500 p-4 text-white rounded-2xl hover:bg-blue-600"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
}

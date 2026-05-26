"use client";

import { JournalEntryProps } from "./JournalList";
import { deleteJournalEntry } from "@/actions/journal-entries";

export default function JournalEntryCard({
  entry,
}: {
  entry: JournalEntryProps;
}) {
  return (
    <li key={entry.id} className="m-4 p-4 border border-gray-500 rounded-2xl">
      <h2 className="text-xl font-bold mb-2">{entry.title}</h2>
      <p className="text-gray-600 py-2">{entry.content}</p>
      <p className="text-sm text-gray-500">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </p>
      <button
        onClick={async () => {
          await deleteJournalEntry(entry.id);
        }}
      >
        Delete
      </button>
    </li>
  );
}

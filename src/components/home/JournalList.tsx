import { fetchJournalEntries } from "@/actions/journal-entries";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: Date;
}

export default async function JournalList() {
  // Fetch journal entries from the server action
  const journalEntries: JournalEntry[] =
    (await fetchJournalEntries()) as JournalEntry[];

  if (journalEntries.length === 0) {
    return <p>No journal entries found.</p>;
  }

  return (
    <ul>
      {journalEntries.map((entry) => {
        return (
          <li
            key={entry.id}
            className="m-4 p-4 border border-gray-500 rounded-2xl"
          >
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
          </li>
        );
      })}
    </ul>
  );
}

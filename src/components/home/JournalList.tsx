import { fetchJournalEntries } from "@/actions/journal-entries";
import JournalEntryCard from "./JournalEntryCard";

// JournalEntryProps defines the structure of a journal entry object, including its ID, title, content, mood, tags, and creation date.
export interface JournalEntryProps {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: Date;
}

export default async function JournalList() {
  // Fetch journal entries from the server action
  const journalEntries: JournalEntryProps[] =
    (await fetchJournalEntries()) as JournalEntryProps[];

  if (journalEntries.length === 0) {
    return <p>No journal entries found.</p>;
  }

  return (
    <ul>
      {journalEntries.map((entry) => {
        return <JournalEntryCard key={entry.id} entry={entry} />;
      })}
    </ul>
  );
}

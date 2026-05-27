import { fetchJournalEntries } from "@/actions/journal-entries";
import { Entry } from "@/generated/prisma/client";
import ListControl from "./ListControl";
import FilteredJournalList from "./FilteredJournalList";

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
  const journalEntries = (await fetchJournalEntries()) as Entry[];

  if (journalEntries.length === 0) {
    return <p>No journal entries found.</p>;
  }

  return (
    <div>
      <ListControl />
      <FilteredJournalList journalEntries={journalEntries} />
    </div>
  );
}

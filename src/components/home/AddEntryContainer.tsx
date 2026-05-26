"use client";

import AddEntryButton from "./AddEntryButton";
import NewEntryModal from "./NewEntryModal";
import { useJournalStore } from "@/store/useJournalStore"; // Import your store

export default function AddEntryContainer() {
  // Connect to the global state and the open action
  const isOpen = useJournalStore((state) => state.isOpen);
  const openModal = useJournalStore((state) => state.openModal);

  return (
    <div>
      {/* Call openModal with no arguments for a fresh, blank entry */}
      <AddEntryButton onClick={() => openModal()} />

      {/* Let the global store control the visibility */}
      {isOpen && <NewEntryModal />}
    </div>
  );
}

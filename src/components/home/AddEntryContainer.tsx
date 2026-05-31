"use client";

import AddEntryButton from "./AddEntryButton";
import NewEntryModal from "./NewEntryModal";
import { useJournalStore } from "@/store/useJournalStore";

export default function AddEntryContainer() {
  const isOpen = useJournalStore((state) => state.isOpen);
  const openModal = useJournalStore((state) => state.openModal);

  return (
    <>
      {/* Passing the open action to the FAB */}
      <AddEntryButton onClick={() => openModal()} />

      {/* The Modal should handle its own internal AnimatePresence/Portals 
         but we gate the mounting here for performance.
      */}
      {isOpen && <NewEntryModal />}
    </>
  );
}

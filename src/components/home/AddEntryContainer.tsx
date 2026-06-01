"use client";

import AddEntryButton from "./AddEntryButton";
import { useJournalStore } from "@/store/useJournalStore";

export default function AddEntryContainer() {
  const openModal = useJournalStore((state) => state.openModal);

  return <AddEntryButton onClick={() => openModal()} />;
}

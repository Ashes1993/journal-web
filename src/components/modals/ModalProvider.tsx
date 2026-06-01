"use client";

import { useJournalStore } from "@/store/useJournalStore";
import EntryModal from "./EntryModal";
import { useEffect, useState } from "react";

export default function ModalProvider() {
  const [mounted, setMounted] = useState(false);
  const edittingEntryId = useJournalStore((state) => state.editingEntry?.id);
  const isOpen = useJournalStore((state) => state.isOpen);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted || !isOpen) return null;

  return <EntryModal key={edittingEntryId || "new-entry"} />;
}

"use client";

import { useJournalStore } from "@/store/useJournalStore";
import EntryModal from "./EntryModal";
import { useEffect, useState } from "react";

interface EntryModalProps {
  defaultMood: string;
}

export default function ModalProvider({ defaultMood }: EntryModalProps) {
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

  return (
    <EntryModal
      defaultMood={defaultMood}
      key={edittingEntryId || "new-entry"}
    />
  );
}

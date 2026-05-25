"use client";

import AddEntryButton from "./AddEntryButton";
import NewEntryModal from "./NewEntryModal";
import { useState } from "react";

export default function AddEntryContainer() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <div>
      <AddEntryButton onClick={() => setIsModalOpen(true)} />
      {isModalOpen && <NewEntryModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

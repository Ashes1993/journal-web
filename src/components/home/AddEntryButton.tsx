"use client";

export default function AddEntryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="bg-blue-500 text-white absolute bottom-8 right-8 px-4 py-2 rounded hover:bg-blue-600"
      onClick={onClick}
    >
      Add Entry
    </button>
  );
}

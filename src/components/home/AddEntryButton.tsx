"use client";

export default function AddEntryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="bg-blue-500 text-white text-3xl absolute bottom-8 right-8 px-4 py-2 rounded-full hover:bg-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
      onClick={onClick}
    >
      +
    </button>
  );
}

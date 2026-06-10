"use client";

import React, { useState } from "react";
import { updateDefaultMood } from "@/actions/user-actions";

interface PreferencesFormProps {
  initialDefaultMood: string;
}

export default function PreferencesForm({
  initialDefaultMood,
}: PreferencesFormProps) {
  const [defaultMood, setDefaultMood] = useState<string>(initialDefaultMood);
  const [isMoodsOpen, setIsMoodsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const moods = [
    { value: "happy", label: "😊 Happy" },
    { value: "sad", label: "😢 Sad" },
    { value: "excited", label: "🤩 Excited" },
    { value: "angry", label: "😡 Angry" },
    { value: "dream", label: "🌙 Dream" },
    { value: "poker face", label: "😐 Poker Face" },
  ];

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const result = await updateDefaultMood(defaultMood);

    setIsSaving(false);
    if (result.success) {
      setFeedback({
        type: "success",
        message: "Preferences updated successfully.",
      });
    } else {
      setFeedback({
        type: "error",
        message: result.error || "Failed to update preferences.",
      });
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {/* Section Header */}
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Workspace Preferences
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure default behaviors for your writing ecosystem.
        </p>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSavePreferences} className="mt-6 space-y-6">
        <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Default Entry Mood
            </label>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Pre-selects this mood value every time you open a new journal
              entry template.
            </p>
          </div>

          <div className="sm:col-span-2 relative max-w-xs w-full">
            {/* Dropdown Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMoodsOpen(!isMoodsOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-indigo-400"
            >
              <span className="capitalize">
                {moods.find((m) => m.value === defaultMood)?.label ||
                  defaultMood}
              </span>

              {/* Chevron Arrow Icon Indicator */}
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isMoodsOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Custom Dropdown Option Panel Overlay */}
            {isMoodsOpen && (
              <>
                {/* Invisible backing layer to automatically close the panel when clicking anywhere outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMoodsOpen(false)}
                />

                <div className="absolute left-0 top-full z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-950 animate-in fade-in slide-in-from-top-1 duration-150">
                  {moods.map((m) => {
                    const isSelected = m.value === defaultMood;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => {
                          setDefaultMood(m.value);
                          setIsMoodsOpen(false);
                        }}
                        className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors text-left ${
                          isSelected
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Status Feedback Toast Hook */}
        {feedback && (
          <div
            className={`rounded-lg p-3 text-sm font-medium ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                : "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Action Row */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
          >
            {isSaving ? "Saving Config..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}

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

          <div className="sm:col-span-2">
            <select
              value={defaultMood}
              onChange={(e) => setDefaultMood(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-indigo-400"
            >
              {moods.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
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

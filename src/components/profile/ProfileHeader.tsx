"use client";

import Image from "next/image";
import { useState } from "react";
import { updateUserName } from "@/actions/user-actions";
import { Check, Edit2, X } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    createdAt?: string | Date;
  };
}

// Helper function to extract initials
const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return parts[0][0] + parts[parts.length - 1][0].toUpperCase();
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentName, setCurrentName] = useState<string>(
    user.name || "Journal User",
  );
  const [editInput, setEditInput] = useState<string>(currentName);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Handle save function
  const handleSave = async () => {
    if (!editInput.trim() || editInput === currentName) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const response = await updateUserName(editInput);

    if (response.success) {
      setCurrentName(editInput.trim());
      setIsEditing(false);
    } else {
      alert(response.error || "Failed to save changes.");
      setEditInput(currentName);
    }
    setIsSaving(false);
  };

  // Format the membership date mileston
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Recent Member";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Google OAuth Avatar Frame */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
          {user.image ? (
            <Image
              src={user.image}
              alt={currentName}
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          ) : (
            // Fallback avatar graphic using standard initials layout
            <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-2xl font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              {getInitials(currentName)}
            </div>
          )}
        </div>

        {/* Identity Information Column */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex min-h-[40px] flex-col items-center gap-3 sm:flex-row sm:items-center">
            {isEditing ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") {
                      setIsEditing(false);
                      setEditInput(currentName);
                    }
                  }}
                  disabled={isSaving}
                  className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-indigo-400/20"
                  maxLength={50}
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditInput(currentName);
                  }}
                  disabled={isSaving}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {currentName}
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition dark:hover:bg-slate-900 dark:hover:text-indigo-400"
                  title="Edit profile name"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Status connection indicator */}
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/20 sm:ml-1">
              Google Account Connected
            </span>
          </div>

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {user.email}
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Member since {memberSince}
          </p>
        </div>
      </div>
    </div>
  );
}

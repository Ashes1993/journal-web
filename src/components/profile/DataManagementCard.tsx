"use client";

import { useState } from "react";
import {
  exportJournalData,
  deleteAllEntries,
  deleteAccount,
} from "@/actions/user-actions";

export default function DataManagementCard() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmationTarget, setConfirmationTarget] = useState<
    "clearEntries" | "deleteAccount" | null
  >(null);

  // Trigger data generation and browser file download
  const handleExport = async () => {
    setIsProcessing(true);
    const result = await exportJournalData();
    setIsProcessing(false);

    if (result.success && result.data) {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(result.data, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `journal-export-${new Date().toISOString().split("T")[0]}.json`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      alert(result.error || "Could not export data.");
    }
  };

  const handleClearAllEntries = async () => {
    setIsProcessing(true);
    const result = await deleteAllEntries();
    setIsProcessing(false);
    setConfirmationTarget(null);

    if (result.success) {
      alert("All journal entries have been cleared successfully.");
    } else {
      alert(result.error);
    }
  };

  const handleTerminateAccount = async () => {
    setIsProcessing(true);
    const result = await deleteAccount();
    setIsProcessing(false);
    setConfirmationTarget(null);

    if (result.success) {
      // Direct hard window reset to dump active memory sessions completely
      window.location.href = "/";
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portability Container */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Data Portability
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Export your data to a standard format for archiving.
        </p>
        <div className="mt-4">
          <button
            onClick={handleExport}
            disabled={isProcessing}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
          >
            {isProcessing
              ? "Processing Request..."
              : "Export Journal Data (.json)"}
          </button>
        </div>
      </div>

      {/* Danger Zone Container */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/10 p-6 shadow-sm dark:border-rose-950/40 dark:bg-rose-950/5">
        <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-400">
          Danger Zone
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Irreversible operational actions regarding your records.
        </p>

        <div className="mt-6 space-y-4">
          {/* Row 1: Clear Logs */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-900">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Clear All Journal Entries
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Deletes every entry log. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setConfirmationTarget("clearEntries")}
              disabled={isProcessing}
              className="rounded-lg bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-200 disabled:opacity-50 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-950 transition-colors self-start sm:self-auto"
            >
              Clear Entries
            </button>
          </div>

          {/* Row 2: Delete Account */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Delete Profile Account
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Permanently erases user records, sync links, and data archives.
              </p>
            </div>
            <button
              onClick={() => setConfirmationTarget("deleteAccount")}
              disabled={isProcessing}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 dark:bg-rose-700 dark:hover:bg-rose-600 transition-colors self-start sm:self-auto"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Interceptor Modal */}
      {confirmationTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">
              Are you absolutely sure?
            </h4>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This action is destructive and permanent. Recovering your logs or
              associations from the server will not be possible.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmationTarget(null)}
                disabled={isProcessing}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={
                  confirmationTarget === "clearEntries"
                    ? handleClearAllEntries
                    : handleTerminateAccount
                }
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isProcessing ? "Executing..." : "Confirm Destruction"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

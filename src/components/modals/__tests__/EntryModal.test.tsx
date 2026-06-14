import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EntryModal from "../EntryModal";

// 1. Define Controlled Mock Variables
const mockCloseModal = vi.fn();
const mockUpdateEntry = vi.fn();
let currentMockEditingEntry: unknown = null;

// 2. Module-Level Interception Mocks
vi.mock("@/store/useJournalStore", () => ({
  useJournalStore: () => ({
    editingEntry: currentMockEditingEntry,
    closeModal: mockCloseModal,
    updateEntry: mockUpdateEntry,
  }),
}));

vi.mock("@/actions/journal-entries", () => ({
  createJournalEntry: vi.fn(),
  updateJournalEntry: vi.fn(),
  fetchUserTags: vi.fn(() => Promise.resolve({ tags: ["coding", "fitness"] })),
}));

import {
  createJournalEntry,
  updateJournalEntry,
} from "@/actions/journal-entries";
const mockCreateAction = createJournalEntry as unknown as Mock;
const mockUpdateAction = updateJournalEntry as unknown as Mock;

describe("EntryModal Component Integration Suite", () => {
  const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    currentMockEditingEntry = null;
  });

  describe("Initial Rendering and UI Primitives", () => {
    it("should display blank inputs and the default mood when creating a new entry", async () => {
      render(<EntryModal defaultMood="happy" />);

      const titleInput = screen.getByPlaceholderText(
        "Give it a title...",
      ) as HTMLInputElement;
      const contentTextarea = screen.getByPlaceholderText(
        "What's on your mind?",
      ) as HTMLTextAreaElement;

      // Allow background tag fetching macro-tasks to resolve cleanly
      await waitFor(() => {
        expect(screen.getByText("SAVE MEMORY")).toBeDefined();
      });

      expect(titleInput.value).toBe("");
      expect(contentTextarea.value).toBe("");
    });

    it("should pre-populate the layout fields if an existing entry is active in editing state", async () => {
      currentMockEditingEntry = {
        id: "entry_999",
        title: "Retrospective Notes",
        content: "Refactoring the entire pipeline architecture today.",
        mood: "excited",
        tags: ["tech", "nextjs"],
      };

      render(<EntryModal defaultMood="happy" />);

      const titleInput = screen.getByPlaceholderText(
        "Give it a title...",
      ) as HTMLInputElement;
      const contentTextarea = screen.getByPlaceholderText(
        "What's on your mind?",
      ) as HTMLTextAreaElement;

      await waitFor(() => {
        expect(screen.getByText("UPDATE MEMORY")).toBeDefined();
      });

      expect(titleInput.value).toBe("Retrospective Notes");
      expect(contentTextarea.value).toBe(
        "Refactoring the entire pipeline architecture today.",
      );
    });
  });

  describe("Form Validation and User Workflows", () => {
    it("should trigger a native window alert dialog and block submission if the title is empty", async () => {
      render(<EntryModal defaultMood="happy" />);

      const submitButton = screen.getByText("SAVE MEMORY");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith("Please provide a title.");
      });
      expect(mockCreateAction).not.toHaveBeenCalled();
    });

    it("should process structural parameter payloads correctly for new creations", async () => {
      mockCreateAction.mockResolvedValue({ success: true });
      render(<EntryModal defaultMood="happy" />);

      fireEvent.change(screen.getByPlaceholderText("Give it a title..."), {
        target: { value: "Morning Runs" },
      });
      fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
        target: { value: "Cardio conditioning routines completed early." },
      });

      const energyMoodButton = screen.getByText("🤩");
      fireEvent.click(energyMoodButton);

      const submitButton = screen.getByText("SAVE MEMORY");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateAction).toHaveBeenCalledWith({
          title: "Morning Runs",
          content: "Cardio conditioning routines completed early.",
          mood: "excited",
          tags: [],
        });
        expect(mockCloseModal).toHaveBeenCalled();
      });
    });

    it("should dispatch deep modifications to update actions when editing an existing memory", async () => {
      currentMockEditingEntry = {
        id: "entry_777",
        title: "Old Title",
        content: "Old Content",
        mood: "sad",
        tags: [],
      };

      mockUpdateAction.mockResolvedValue({
        success: true,
        entry: {
          id: "entry_777",
          title: "New Fixed Title",
          content: "Updated Content",
          mood: "happy",
          tags: [],
        },
      });

      render(<EntryModal defaultMood="sad" />);

      fireEvent.change(screen.getByPlaceholderText("Give it a title..."), {
        target: { value: "New Fixed Title" },
      });

      const submitButton = screen.getByText("UPDATE MEMORY");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateAction).toHaveBeenCalledWith("entry_777", {
          title: "New Fixed Title",
          content: "Old Content",
          mood: "sad",
          tags: [],
        });
        expect(mockUpdateEntry).toHaveBeenCalled();
        expect(mockCloseModal).toHaveBeenCalled();
      });
    });
  });

  describe("Tag Token Interaction Management", () => {
    it("should append tags dynamically when typing values and pressing Enter key configurations", async () => {
      render(<EntryModal defaultMood="poker face" />);

      const tagInput = screen.getByPlaceholderText("Add tag...");

      fireEvent.change(tagInput, { target: { value: "personal-dev" } });
      fireEvent.keyDown(tagInput, { key: "Enter", code: "Enter" });

      await waitFor(() => {
        expect(screen.getByText("#personal-dev")).toBeDefined();
      });
    });

    it("should extract tokens out of the active list array structural layouts when delete triggers are clicked", async () => {
      currentMockEditingEntry = {
        id: "entry_111",
        title: "Workout Data",
        content: "Gym day completed.",
        mood: "happy",
        tags: ["fitness"],
      };

      render(<EntryModal defaultMood="happy" />);

      // Find tag node container contextually
      const activeTagToken = screen.getByText("#fitness");
      expect(activeTagToken).toBeDefined();

      // Isolate button relative to this DOM node block
      const deleteButton = activeTagToken.querySelector(
        "button",
      ) as HTMLButtonElement;
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("#fitness")).toBeNull();
      });
    });
  });
});

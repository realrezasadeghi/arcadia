import { create } from "zustand";

type SaveStatus = "saved" | "saving" | "dirty" | "error";

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Save status
  saveStatus: SaveStatus;
  pendingChanges: number;
  setSaveStatus: (status: SaveStatus) => void;
  incrementPending: () => void;
  resetPending: () => void;

  // Selected elements
  selectedElementIds: string[];
  setSelectedElements: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  saveStatus: "saved",
  pendingChanges: 0,
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  incrementPending: () =>
    set((s) => ({ pendingChanges: s.pendingChanges + 1, saveStatus: "dirty" })),
  resetPending: () => set({ pendingChanges: 0, saveStatus: "saved" }),

  selectedElementIds: [],
  setSelectedElements: (selectedElementIds) => set({ selectedElementIds }),
  clearSelection: () => set({ selectedElementIds: [] }),
}));

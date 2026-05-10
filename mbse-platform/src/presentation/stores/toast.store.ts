import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  add: (toast: Omit<Toast, "id">) => string;
  remove: (id: string) => void;
  clear: () => void;
}

let _counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  add: (toast) => {
    const id = `toast-${++_counter}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    // Auto-dismiss after 4 seconds
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4000);
    return id;
  },

  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

/** Convenience helper — قابل استفاده خارج از React components */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().add({ title, description, variant: "success" }),
  error: (title: string, description?: string) =>
    useToastStore.getState().add({ title, description, variant: "error" }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().add({ title, description, variant: "warning" }),
  default: (title: string, description?: string) =>
    useToastStore.getState().add({ title, description, variant: "default" }),
};

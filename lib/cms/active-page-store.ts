/* Tracks which PageBlocks instance is currently on screen in edit mode.
 * Written by PageBlocks via setActivePage / clearActivePage; read by
 * ComponentPicker via useSyncExternalStore so the picker always knows what
 * locator to use regardless of whether the page is a custom page (site.pages)
 * or a built-in extras slot (site.extras). */

import type { Locator } from "./mutate";

export type ActivePage = {
  loc: Locator;
  getBlockIds: () => string[];
  label: string;
};

let current: ActivePage | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function setActivePage(page: ActivePage): void {
  current = page;
  notify();
}

export function clearActivePage(): void {
  if (current === null) return;
  current = null;
  notify();
}

/** Stable subscribe function for useSyncExternalStore. */
export function subscribeActivePage(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Stable snapshot function for useSyncExternalStore. */
export function snapshotActivePage(): ActivePage | null {
  return current;
}

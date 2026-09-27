"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

/**
 * full   – desktop, fine pointer, capable device: every effect
 * lite   – touch / low-end / data-saver: transform-only scroll parallax, native scroll
 * static – prefers-reduced-motion or the user pressed "Pause motion": no motion at all
 */
export type MotionTier = "full" | "lite" | "static";

type NavigatorHints = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

const subscribers = new Map<string, (cb: () => void) => () => void>();
function subscribeMedia(query: string) {
  let fn = subscribers.get(query);
  if (!fn) {
    fn = (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    };
    subscribers.set(query, fn);
  }
  return fn;
}

function useMedia(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

// ── "Pause motion" preference (WCAG 2.2.2), persisted per viewer ──────────
const PAUSE_KEY = "north:motion-paused";
const pauseListeners = new Set<() => void>();

function readPaused(): boolean {
  try {
    return window.localStorage.getItem(PAUSE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMotionPaused(paused: boolean) {
  try {
    window.localStorage.setItem(PAUSE_KEY, paused ? "1" : "0");
  } catch {
    // storage blocked (private mode): the toggle still works for this page view
  }
  memoryPaused = paused;
  pauseListeners.forEach((l) => l());
}

let memoryPaused: boolean | null = null;

export function useMotionPaused(): boolean {
  return useSyncExternalStore(
    (cb) => {
      pauseListeners.add(cb);
      return () => pauseListeners.delete(cb);
    },
    () => memoryPaused ?? readPaused(),
    () => false
  );
}

export function computeTier(input: {
  reduce: boolean;
  paused: boolean;
  finePointer: boolean;
  saveData?: boolean;
  deviceMemory?: number;
  cores?: number;
  isServer?: boolean;
}): MotionTier {
  if (input.reduce || input.paused) return "static";
  if (input.isServer) return "lite";
  const lowEnd =
    input.saveData === true ||
    (input.deviceMemory ?? 8) < 4 ||
    (input.cores ?? 8) < 4;
  return input.finePointer && !lowEnd ? "full" : "lite";
}

export function useComputedTier(): MotionTier {
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const finePointer = useMedia("(hover: hover) and (pointer: fine)");
  const paused = useMotionPaused();
  const isServer = typeof navigator === "undefined";
  const nav = (isServer ? undefined : navigator) as NavigatorHints | undefined;
  return computeTier({
    reduce,
    paused,
    finePointer,
    isServer,
    saveData: nav?.connection?.saveData,
    deviceMemory: nav?.deviceMemory,
    cores: nav?.hardwareConcurrency,
  });
}

export const MotionTierContext = createContext<MotionTier>("lite");

const noopSubscribe = () => () => {};

/**
 * Tier for rendering decisions. While a component is still hydrating (e.g. a
 * Suspense boundary that streams in after the provider already switched to
 * "full") it returns the server tier ("lite"), so the markup matches the
 * server HTML; React re-renders with the real tier right after hydration.
 */
export function useMotionTier(): MotionTier {
  const tier = useContext(MotionTierContext);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return hydrated ? tier : "lite";
}

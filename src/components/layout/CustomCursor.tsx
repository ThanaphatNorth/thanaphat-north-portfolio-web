"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionTier } from "@/motion/tier";

const INTERACTIVE = 'a, button, [role="button"], select, [data-cursor]';
const TEXT_INPUT = 'input, textarea, [contenteditable="true"]';

/** Label shown in the cursor pill for data-cursor="…" values. */
const LABELS: Record<string, string> = {
  view: "View",
  open: "Open",
  drag: "Drag",
  visit: "Visit",
  talk: "Let's talk",
  close: "Close",
  top: "Top",
  read: "Read",
};

/**
 * Desktop-only cursor: a dot that follows exactly, plus a trailing ring that
 * grows into a label pill over elements with data-cursor. Hidden on touch,
 * in the lite/static tiers, and the native cursor is kept for text fields.
 */
export function CustomCursor() {
  const tier = useMotionTier();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.25 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.25 });
  const [state, setState] = useState<{ hover: boolean; label: string | null; text: boolean; visible: boolean }>({
    hover: false,
    label: null,
    text: false,
    visible: false,
  });

  const enabled = tier === "full";

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const text = !!target?.closest(TEXT_INPUT);
      const hit = target?.closest(INTERACTIVE) as HTMLElement | null;
      const key = hit?.dataset.cursor;
      const label = key ? LABELS[key] ?? null : null;
      setState((s) =>
        s.hover === !!hit && s.label === label && s.text === text && s.visible
          ? s
          : { hover: !!hit, label, text, visible: true }
      );
    };
    const onLeave = () => setState((s) => ({ ...s, visible: false }));

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const hideAll = !state.visible || state.text;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]" data-testid="custom-cursor">
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-accent"
        style={{ x, y }}
        animate={{ opacity: hideAll ? 0 : 1, scale: state.hover ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div className="fixed top-0 left-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border overflow-hidden whitespace-nowrap"
          animate={{
            width: state.label ? 84 : state.hover ? 52 : 34,
            height: state.label ? 84 : state.hover ? 52 : 34,
            opacity: hideAll ? 0 : 1,
            backgroundColor: state.label ? "rgba(255,90,31,0.95)" : "rgba(255,90,31,0)",
            borderColor: state.hover ? "rgba(255,90,31,0.9)" : "rgba(237,230,217,0.35)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <AnimatePresence>
            {state.label && (
              <motion.span
                key={state.label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="font-mono text-[11px] uppercase tracking-wider text-ink font-medium"
              >
                {state.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <style>{`
        html.has-custom-cursor, html.has-custom-cursor a, html.has-custom-cursor button,
        html.has-custom-cursor [role="button"], html.has-custom-cursor [data-cursor] { cursor: none; }
        html.has-custom-cursor input, html.has-custom-cursor textarea, html.has-custom-cursor select { cursor: auto; }
      `}</style>
    </div>
  );
}

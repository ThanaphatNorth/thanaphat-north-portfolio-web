"use client";

import { Pause, Play } from "lucide-react";
import { setMotionPaused, useMotionPaused } from "@/motion/tier";

/** WCAG 2.2.2 — lets anyone stop looping video, parallax and smooth scroll. */
export function MotionToggle({ withLabel = false }: { withLabel?: boolean }) {
  const paused = useMotionPaused();
  const label = paused ? "Play motion" : "Pause motion";
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-pressed={paused}
      aria-label={label}
      title={label}
      data-testid="motion-toggle"
      className="inline-flex items-center gap-2 h-9 px-2.5 rounded-full border border-border text-muted hover:text-foreground hover:border-accent transition-colors"
    >
      {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      {withLabel && <span className="text-sm">{label}</span>}
    </button>
  );
}

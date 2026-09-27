"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { scrollToTarget } from "@/motion/scrollTo";

/** Fixed compass: the needle turns with page progress (0° at top → 360° at the end). */
export function CompassProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const rotate = useTransform(smooth, [0, 1], [0, 360]);
  const pct = useTransform(smooth, (v) => `${Math.round(v * 100)}`.padStart(2, "0"));
  const lenis = useLenis();

  return (
    <button
      type="button"
      onClick={() => scrollToTarget("#top", lenis)}
      className="fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-3 group"
      aria-label="Back to top"
      data-cursor="top"
    >
      <span className="relative grid place-items-center w-12 h-12 rounded-full glass border border-border group-hover:border-accent transition-colors">
        <svg viewBox="0 0 48 48" className="absolute inset-0" aria-hidden="true">
          {[0, 90, 180, 270].map((a) => (
            <line key={a} x1="24" y1="3" x2="24" y2="7" stroke="currentColor" className="text-muted" strokeWidth="1" transform={`rotate(${a} 24 24)`} />
          ))}
          <text x="24" y="14" textAnchor="middle" className="fill-accent font-mono" fontSize="6">N</text>
        </svg>
        <motion.svg viewBox="0 0 48 48" className="absolute inset-0" style={{ rotate }} aria-hidden="true">
          <path d="M24 12 L27 24 L24 36 L21 24 Z" className="fill-foreground/20" />
          <path d="M24 12 L27 24 L21 24 Z" className="fill-accent" />
        </motion.svg>
      </span>
      <motion.span className="label-mono tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">{pct}</motion.span>
    </button>
  );
}

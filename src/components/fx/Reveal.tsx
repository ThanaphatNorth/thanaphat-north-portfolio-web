"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ease } from "@/motion/tokens";

/** One-shot rise-in for secondary content. Never use on the LCP element. */
export function Reveal({ children, delay = 0, className, y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}

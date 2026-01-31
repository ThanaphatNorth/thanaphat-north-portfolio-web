"use client";

import { useEffect } from "react";
import { MotionValue, useMotionValue } from "framer-motion";

interface MousePosition {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export function useMousePosition(): MousePosition {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Update motion values directly - no React re-render
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [x, y]);

  return { x, y };
}

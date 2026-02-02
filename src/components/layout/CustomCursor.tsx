"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";

export function CustomCursor() {
  const { x, y } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Use refs to avoid re-renders for hover state changes
  const isHoveringRef = useRef(false);

  // Fast spring for cursor dot - follows mouse almost instantly
  const cursorX = useSpring(x, { stiffness: 1000, damping: 50, mass: 0.1 });
  const cursorY = useSpring(y, { stiffness: 1000, damping: 50, mass: 0.1 });

  // Slightly slower spring for ring - creates trailing effect
  const ringX = useSpring(x, { stiffness: 400, damping: 35, mass: 0.2 });
  const ringY = useSpring(y, { stiffness: 400, damping: 35, mass: 0.2 });

  useEffect(() => {
    // Check if it's a touch device
    setIsTouchDevice(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Use passive listeners for better scroll performance
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Memoized handlers to prevent recreating on each render
  const handleHoverStart = useCallback(() => {
    if (!isHoveringRef.current) {
      isHoveringRef.current = true;
      setIsHovering(true);
    }
  }, []);

  const handleHoverEnd = useCallback(() => {
    if (isHoveringRef.current) {
      isHoveringRef.current = false;
      setIsHovering(false);
    }
  }, []);

  useEffect(() => {
    // Use event delegation for better performance
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')) {
        handleHoverStart();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      const relatedTarget = e.relatedTarget as Element | null;
      
      if (target.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')) {
        // Check if we're not moving to another interactive element
        if (!relatedTarget?.closest('a, button, [role="button"], input, textarea, select, [data-cursor-hover]')) {
          handleHoverEnd();
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [handleHoverStart, handleHoverEnd]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      {/* Add class to hide default cursor */}
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Cursor Dot - follows mouse instantly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
      >
        <div className="w-3 h-3 bg-white rounded-full" />
      </motion.div>

      {/* Cursor Ring - trails behind slightly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <div
          className={`w-10 h-10 rounded-full border-2 transition-colors duration-150 ${
            isHovering ? "border-accent" : "border-white/30"
          }`}
        />
      </motion.div>
    </>
  );
}

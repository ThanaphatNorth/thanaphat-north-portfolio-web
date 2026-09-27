"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { MotionTierContext, useComputedTier } from "./tier";

export function MotionProvider({ children }: { children: ReactNode }) {
  const tier = useComputedTier();

  // Expose the tier to CSS (html[data-motion="static"] kills CSS animations).
  useEffect(() => {
    document.documentElement.dataset.motion = tier;
  }, [tier]);

  return (
    <MotionTierContext value={tier}>
      <MotionConfig reducedMotion={tier === "static" ? "always" : "user"}>
        {/* Lenis is a sibling, not a wrapper, so a tier change never remounts the page. */}
        {tier === "full" && (
          <ReactLenis root options={{ lerp: 0.1, anchors: true }} />
        )}
        {children}
      </MotionConfig>
    </MotionTierContext>
  );
}

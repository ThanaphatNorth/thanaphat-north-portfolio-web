"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/** Single owner of body scroll-locking (native + Lenis), ref-counted across dialogs. */
let locks = 0;

export function useScrollLock(active: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!active) return;
    locks += 1;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      locks -= 1;
      if (locks === 0) {
        document.body.style.overflow = "";
        lenis?.start();
      }
    };
  }, [active, lenis]);
}

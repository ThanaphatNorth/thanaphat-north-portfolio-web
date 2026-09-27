"use client";

type LenisLike = { scrollTo: (target: string | HTMLElement, opts?: { offset?: number }) => void };

/**
 * Smooth-scroll to a section, via Lenis when active, native otherwise.
 * Both honour the target's CSS scroll-margin-top (sections use scroll-mt-16
 * for the fixed nav), so no extra offset is added here.
 */
export function scrollToTarget(href: string, lenis?: LenisLike | null) {
  const el = document.querySelector<HTMLElement>(href);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el);
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

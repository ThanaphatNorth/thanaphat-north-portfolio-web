"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/motion/useScrollLock";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** "center" = modal card, "right" = full-height drawer */
  variant?: "center" | "right";
  className?: string;
  /** Block closing (e.g. while a form submits). */
  dismissible?: boolean;
  testId?: string;
}

/**
 * Accessible dialog: role="dialog" + aria-modal, focus trap, Esc to close,
 * focus returns to the trigger, background scroll locked (native + Lenis).
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  variant = "center",
  className,
  dismissible = true,
  testId,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    // Focus the first form field, else the first control, else the panel itself.
    const first =
      panel?.querySelector<HTMLElement>("input:not([tabindex='-1']), textarea, select") ??
      panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      trigger?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, dismissible]);

  const isDrawer = variant === "right";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" data-testid={testId}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={dismissible ? onClose : undefined}
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            data-lenis-prevent
            initial={isDrawer ? { x: "100%" } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={isDrawer ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isDrawer ? { x: "100%" } : { opacity: 0, y: 24, scale: 0.97 }}
            transition={
              isDrawer
                ? { type: "spring", damping: 32, stiffness: 300 }
                : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
            }
            className={cn(
              "absolute bg-card border-border flex flex-col outline-none",
              isDrawer
                ? "top-0 right-0 h-full w-full sm:w-[90%] md:w-[70%] lg:w-[55%] xl:w-[45%] border-l"
                : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[90vh] rounded-2xl border shadow-2xl",
              className
            )}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
              <h2 id={titleId} className="font-display text-lg md:text-xl font-semibold text-foreground truncate">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                disabled={!dismissible}
                aria-label="Close dialog"
                data-cursor="close"
                className="grid place-items-center w-10 h-10 shrink-0 rounded-full border border-border text-foreground hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

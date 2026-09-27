"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface FrameSequenceProps {
  count: number;
  /** 1-based index → URL */
  frame: (i: number) => string;
  progress: MotionValue<number>;
  className?: string;
}

/**
 * Scroll-scrubbed image sequence drawn to a canvas ("object-fit: cover").
 * Loads every 4th frame first, then fills the gaps when the browser is idle,
 * and always paints the nearest frame that has loaded. Starts loading only
 * after window `load` so it never competes with the LCP image.
 */
export function FrameSequence({ count, frame, progress, className }: FrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const current = useRef(0);

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // nearest loaded frame
    let img: HTMLImageElement | null = null;
    for (let d = 0; d < count && !img; d++) {
      const a = images.current[index - d];
      const b = images.current[index + d];
      if (a?.complete && a.naturalWidth) img = a;
      else if (b?.complete && b.naturalWidth) img = b;
    }
    if (!img) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    // anchor right-of-centre so the spire stays in frame on narrow screens
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, w, h);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw(current.current);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let cancelled = false;
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (images.current[i]) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled && Math.abs(i - current.current) < 3) draw(current.current);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frame(i + 1);
        images.current[i] = img;
      });

    const start = async () => {
      const coarse = [];
      for (let i = 0; i < count; i += 4) coarse.push(load(i));
      coarse.push(load(count - 1));
      await Promise.all(coarse);
      for (let i = 0; i < count && !cancelled; i++) {
        if (images.current[i]) continue;
        await new Promise<void>((r) =>
          "requestIdleCallback" in window
            ? window.requestIdleCallback(() => r(), { timeout: 200 })
            : setTimeout(r, 16)
        );
        await load(i);
      }
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("load", start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- frame/count are static per mount
  }, []);

  useMotionValueEvent(progress, "change", (p) => {
    const i = Math.min(count - 1, Math.max(0, Math.round(p * (count - 1))));
    if (i === current.current) return;
    current.current = i;
    requestAnimationFrame(() => draw(i));
  });

  return <canvas ref={canvasRef} className={cn("absolute inset-0 h-full w-full", className)} aria-hidden="true" />;
}

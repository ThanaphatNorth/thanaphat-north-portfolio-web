"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMotionTier } from "@/motion/tier";

interface AmbientVideoProps {
  /** Path without extension; expects `${src}.webm` and `${src}.mp4`. */
  src: string;
  poster: string;
  className?: string;
  /** Only mount the <video> once this is true (e.g. after a scrub finishes). */
  enabled?: boolean;
}

/**
 * Decorative looping video. Never autoplays in the "static" tier or on
 * data-saver; loads nothing until near the viewport; pauses off-screen.
 * The poster <img> is always rendered underneath, so there is no layout shift.
 */
export function AmbientVideo({ src, poster, className, enabled = true }: AmbientVideoProps) {
  const tier = useMotionTier();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  const saveData =
    typeof navigator !== "undefined" &&
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const allowed = enabled && tier !== "static" && !saveData;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !allowed) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [allowed]);

  return (
    <div ref={wrapRef} className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- local, pre-optimized poster */}
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" decoding="async" />
      {allowed && near && (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0"
          )}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={poster}
          onCanPlay={() => setReady(true)}
        >
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

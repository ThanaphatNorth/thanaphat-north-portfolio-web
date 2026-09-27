"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/** Real-looking source the city is "rewritten" into: delivery pipeline + an AI agent. */
const SOURCE = `import { agent } from "@north/ai"; import { pipeline, deploy } from "@north/platform";
const spec = await readBlueprint("patient-app.md"); const plan = await agent.plan(spec, { reviewers: 3 });
for (const task of plan.tasks) { const pr = await agent.implement(task); await ci.run(pr, ["lint", "test", "e2e"]); }
export const release = pipeline({ services: ["api-gateway", "auth-service", "hospital-core"], iso27001: true });
await deploy(release, { env: "production", canary: 0.1, rollback: "auto" }); metrics.track("deploy_frequency", 3);
type Team = { engineers: 30; flow: "kanban"; ai: "assisted" }; function ship<T>(system: T): Live<T> { return live(system); }
`.replace(/\s+/g, " ");

interface Cell {
  x: number;
  y: number;
  lum: number;
  warm: boolean;
  t: number; // reveal threshold 0..1
  ch: string;
}

interface CodeMosaicProps {
  /** Image to sample (same framing as the scene). */
  src: string;
  /** 0 → nothing, 1 → the whole city is code. */
  progress: MotionValue<number>;
  className?: string;
  /** Glyph cell width in CSS pixels (smaller = finer, more legible city). */
  cell?: number;
}

/**
 * Re-draws the skyline as a grid of source-code glyphs. Bright, warm pixels
 * (lit windows) become signal-orange characters; the sky becomes faint
 * blueprint-blue code. A sweeping "write head" reveals cells from left to
 * right like an agent typing, driven entirely by scroll progress.
 */
export function CodeMosaic({ src, progress, className, cell = 8 }: CodeMosaicProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cells = useRef<Cell[]>([]);
  const grid = useRef({ cw: 0, ch: 0, font: "monospace" });
  const last = useRef(-1);

  const draw = (p: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || cells.current.length === 0) return;
    last.current = p;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (p <= 0.001) return;
    const { ch, font } = grid.current;
    ctx.font = `500 ${Math.round(ch * 0.82)}px ${font}`;
    ctx.textBaseline = "top";
    const front = 0.06;
    for (const c of cells.current) {
      if (c.t > p) continue;
      const near = p - c.t < front; // the "write head"
      if (near) {
        ctx.fillStyle = "rgba(255,90,31,0.95)";
      } else if (c.warm) {
        ctx.fillStyle = `rgba(255,${120 + Math.round(c.lum * 100)},60,${0.55 + c.lum * 0.45})`;
      } else {
        const a = Math.min(1, 0.55 + c.lum);
        ctx.fillStyle = c.lum > 0.62 ? `rgba(237,230,217,${a})` : `rgba(140,185,255,${a})`;
      }
      ctx.fillText(c.ch, c.x, c.y);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    img.src = src;

    const build = () => {
      if (cancelled || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.round(canvas.clientWidth * dpr);
      const H = Math.round(canvas.clientHeight * dpr);
      if (!W || !H) return;
      canvas.width = W;
      canvas.height = H;
      const cols = Math.max(40, Math.floor(canvas.clientWidth / cell));
      const cw = W / cols;
      const chH = cw / 0.6; // monospace glyph aspect
      const rows = Math.ceil(H / chH);
      grid.current = {
        cw,
        ch: chH,
        font: getComputedStyle(document.body).getPropertyValue("--font-mono-face").trim() || "monospace",
      };
      // sample the image with "cover" framing into cols × rows
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      // "cover" rect in canvas pixels, then mapped onto the cols × rows grid
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      const gx = cols / W;
      const gy = rows / (rows * chH);
      octx.drawImage(img, ((W - dw) / 2) * gx, ((H - dh) / 2) * gy, dw * gx, dh * gy);
      const data = octx.getImageData(0, 0, cols, rows).data;
      const out: Cell[] = [];
      let k = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4;
          const R = data[i], G = data[i + 1], B = data[i + 2];
          const lum = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
          const ch = SOURCE[k++ % SOURCE.length];
          // Only the linework becomes code; the dark paper stays empty, so the city reads as code.
          if (lum < 0.26 || ch === " ") continue;
          // sweep left→right with a little noise so it reads as "being written"
          const t = Math.min(0.999, (c / cols) * 0.8 + ((r * 7919 + c * 104729) % 1000) / 1000 * 0.2);
          // ~7 % of glyphs glow warm, like lit windows in the real city.
          const warm = ((r * 31 + c * 17) % 100) < 7;
          out.push({ x: c * cw, y: r * chH, lum, warm, t, ch });
        }
      }
      cells.current = out;
      draw(progress.get());
    };

    img.onload = build;
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- src/cell are static per mount (parent remounts via key)
  }, []);

  useMotionValueEvent(progress, "change", (p) => {
    if (Math.abs(p - last.current) < 0.004) return;
    requestAnimationFrame(() => draw(p));
  });

  return <canvas ref={canvasRef} className={cn("absolute inset-0 h-full w-full", className)} aria-hidden="true" />;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn, parseCategories } from "@/lib/utils";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioDetail } from "./PortfolioDetail";
import { Dialog } from "@/components/ui/Dialog";
import { useMotionTier } from "@/motion/tier";
import type { PortfolioItem } from "@/lib/supabase-server";

interface PortfolioShowcaseProps {
  portfolios: PortfolioItem[];
}

/** Pinned horizontal gallery ("full" tier, ≥ lg); a responsive grid otherwise. */
export function PortfolioShowcase({ portfolios }: PortfolioShowcaseProps) {
  const tier = useMotionTier();
  // Keep the last opened item while the drawer animates out (title must not blank).
  const [drawer, setDrawer] = useState<{ id: string | null; open: boolean }>({ id: null, open: false });
  const setSelectedId = (id: string | null) => setDrawer((d) => (id ? { id, open: true } : { ...d, open: false }));
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const types = useMemo(
    () => [...new Set(portfolios.flatMap((p) => parseCategories(p.category)))].sort(),
    [portfolios]
  );
  const filtered = useMemo(
    () =>
      selectedTypes.length === 0
        ? portfolios
        : portfolios.filter((p) => parseCategories(p.category).some((t) => selectedTypes.includes(t))),
    [portfolios, selectedTypes]
  );
  const selected = portfolios.find((p) => p.id === drawer.id) ?? null;

  const toggleType = (type: string) =>
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));

  if (portfolios.length === 0) return null;

  return (
    <>
      {types.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-wrap items-center gap-2 mb-8" role="group" aria-label="Filter projects by type">
          <FilterChip active={selectedTypes.length === 0} onClick={() => setSelectedTypes([])}>All</FilterChip>
          {types.map((t) => (
            <FilterChip key={t} active={selectedTypes.includes(t)} onClick={() => toggleType(t)}>{t}</FilterChip>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-muted py-12">No projects match the selected types.</p>
      ) : tier === "full" && filtered.length > 2 ? (
        <HorizontalGallery items={filtered} onOpen={setSelectedId} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <PortfolioCard key={p.id} portfolio={p} index={i} total={filtered.length} onClick={() => setSelectedId(p.id)} />
          ))}
        </div>
      )}

      <Dialog
        open={drawer.open && !!selected}
        onClose={() => setSelectedId(null)}
        variant="right"
        title={selected?.title ?? ""}
        testId="portfolio-drawer"
      >
        {selected && <PortfolioDetail portfolio={selected} />}
      </Dialog>
    </>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
        active ? "bg-accent text-ink border-accent" : "bg-transparent border-border text-muted hover:text-foreground hover:border-accent/60"
      )}
    >
      {children}
    </button>
  );
}

function HorizontalGallery({ items, onOpen }: { items: PortfolioItem[]; onOpen: (id: string) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // Pin length = how far the track must travel horizontally.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={wrapRef} style={{ height: `calc(100svh + ${distance}px)` }} className="relative" data-testid="portfolio-gallery">
      <div className="sticky top-0 h-svh flex flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex gap-6 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-[10vw] will-change-transform">
          {items.map((p, i) => (
            <div
              key={p.id}
              className="shrink-0 w-[min(560px,42vw)]"
              onFocus={(e) => {
                // Keyboard users only: bring the focused card into the pinned viewport.
                // (Mouse focus must not scroll, or the click lands on another element.)
                if (!(e.target as HTMLElement).matches(":focus-visible")) return;
                const wrap = wrapRef.current;
                if (!wrap || distance === 0) return;
                const ratio = i / Math.max(1, items.length - 1);
                const top = wrap.getBoundingClientRect().top + window.scrollY + ratio * distance;
                if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top });
                e.stopPropagation();
              }}
            >
              <PortfolioCard portfolio={p} index={i} total={items.length} progress={scrollYProgress} onClick={() => onOpen(p.id)} />
            </div>
          ))}
        </motion.div>
        <div className="max-w-7xl w-full mx-auto px-4 md:px-6 mt-10 flex items-center gap-4">
          <span className="label-mono">Drag the page</span>
          <div className="relative h-px flex-1 bg-border overflow-hidden">
            <motion.div className="absolute inset-y-0 left-0 bg-accent" style={{ width: bar }} />
          </div>
          <span className="label-mono">{items.length} projects</span>
        </div>
      </div>
    </div>
  );
}

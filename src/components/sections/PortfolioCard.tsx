"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn, parseCategories, stripMarkdown } from "@/lib/utils";
import type { PortfolioItem } from "@/lib/supabase-server";

interface PortfolioCardProps {
  portfolio: PortfolioItem;
  onClick: () => void;
  index: number;
  total: number;
  /** Horizontal-gallery progress; drives the inner-image parallax. */
  progress?: MotionValue<number>;
  className?: string;
}

/** "Film frame" project card: image drifts inside its frame while the gallery moves. */
export function PortfolioCard({ portfolio, onClick, index, total, progress, className }: PortfolioCardProps) {
  const fallback = useTransform(() => 0);
  const innerX = useTransform(progress ?? fallback, [0, 1], ["6%", "-6%"]);
  const types = parseCategories(portfolio.category);

  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="view"
      data-testid="portfolio-card"
      className={cn("group relative block w-full text-left rounded-2xl focus-visible:outline-none", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-ink-900 group-hover:border-accent/70 group-focus-visible:border-accent transition-colors">
        <motion.div className="absolute inset-[-8%]" style={{ x: progress ? innerX : 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS image of arbitrary host/size */}
          <img
            src={portfolio.cover_image || "/images/portfolio-placeholder.svg"}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            style={{
              objectPosition: `${portfolio.cover_image_focal_x ?? 50}% ${portfolio.cover_image_focal_y ?? 50}%`,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/portfolio-placeholder.svg";
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" aria-hidden="true" />
        <span className="absolute top-4 left-4 label-mono !text-paper/80">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span className="absolute top-3 right-3 grid place-items-center w-10 h-10 rounded-full bg-ink/60 border border-border text-foreground opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {types.map((t) => (
              <span key={t} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-accent/15 text-accent border border-accent/30">
                {t}
              </span>
            ))}
          </div>
          <h3 className="font-display text-xl md:text-2xl font-semibold text-paper leading-tight">{portfolio.title}</h3>
          <p className="mt-1 text-sm text-paper/70 line-clamp-2">{stripMarkdown(portfolio.description)}</p>
        </div>
      </div>
    </button>
  );
}

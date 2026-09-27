"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Rocket, Sparkles, BookOpen, Zap, Globe, Star, type LucideIcon } from "lucide-react";
import { useMotionTier } from "@/motion/tier";

const iconMap: Record<string, LucideIcon> = { Rocket, Sparkles, BookOpen, Zap, Globe, Star };

const statusColors: Record<string, string> = {
  Live: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Beta: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  "Coming Soon": "bg-sky-500/10 text-sky-300 border-sky-500/30",
};

interface VentureWithMeta {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  status: string;
  iconName: string;
}

function StackCard({ venture, index, total, progress, stacked }: {
  venture: VentureWithMeta; index: number; total: number; progress: MotionValue<number>; stacked: boolean;
}) {
  const Icon = iconMap[venture.iconName] ?? Rocket;
  // Earlier cards shrink and dim as later ones slide over them.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index - 1) * 0.05]);
  const dim = useTransform(progress, [start, 1], [0, (total - index - 1) * 0.18]);

  return (
    <div
      className={stacked ? "sticky" : "relative"}
      style={stacked ? { top: `calc(6.5rem + ${index * 1.75}rem)` } : undefined}
    >
      <motion.a
        href={venture.url}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="visit"
        data-testid="venture-card"
        style={stacked ? { scale, transformOrigin: "top center" } : undefined}
        className="group relative block rounded-3xl border border-border bg-ink-900 p-7 md:p-12 overflow-hidden hover:border-accent/60 transition-colors min-h-[320px] md:min-h-[380px]"
      >
        <div className="absolute inset-0 blueprint-grid opacity-60" aria-hidden="true" />
        <div className="relative grid md:grid-cols-12 gap-8 items-end h-full">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-11 h-11 rounded-xl bg-accent/10 grid place-items-center">
                <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[venture.status] ?? statusColors["Coming Soon"]}`}>
                {venture.status}
              </span>
              <span className="label-mono ml-auto md:ml-0">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            </div>
            <h3 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
              {venture.name}
            </h3>
            <p className="mt-3 text-accent font-medium">{venture.tagline}</p>
          </div>
          <div className="md:col-span-4">
            <p className="text-muted leading-relaxed">{venture.description}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm text-foreground">
              Visit site <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
            </span>
          </div>
        </div>
        {stacked && <motion.div className="absolute inset-0 bg-ink pointer-events-none" style={{ opacity: dim }} aria-hidden="true" />}
      </motion.a>
    </div>
  );
}

export function VenturesGrid({ ventures }: { ventures: VentureWithMeta[] }) {
  const tier = useMotionTier();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end end"] });
  const stacked = tier !== "static";

  return (
    <div ref={ref} className={stacked ? "flex flex-col gap-[30vh] pb-[10vh]" : "flex flex-col gap-6"}>
      {ventures.map((v, i) => (
        <StackCard key={v.id || v.name} venture={v} index={i} total={ventures.length} progress={scrollYProgress} stacked={stacked} />
      ))}
    </div>
  );
}

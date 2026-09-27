"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Users, Rocket, TrendingUp, ShieldCheck, type LucideIcon } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { impactStats, credentials } from "@/lib/constants";
import { useMotionTier } from "@/motion/tier";

const ICONS: Record<(typeof impactStats)[number]["icon"], LucideIcon> = {
  users: Users,
  rocket: Rocket,
  trending: TrendingUp,
  shield: ShieldCheck,
};

/** Arc gauge + number. In "full"/"lite" the value is scrubbed by scroll; "static" shows the final value. */
function Gauge({ value, suffix, progress, max }: { value: number; suffix: string; progress: MotionValue<number>; max: number }) {
  const tier = useMotionTier();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const scrubbed = useSpring(progress, { stiffness: 90, damping: 22 });
  const live = tier === "static" ? null : scrubbed;
  const text = useTransform(scrubbed, (v) => `${Math.round(Math.min(1, v) * value)}`);
  const dash = useTransform(scrubbed, (v) => Math.min(1, v) * (value / max));

  return (
    <div ref={ref} className="relative w-full aspect-[2/1]">
      <svg viewBox="0 0 200 110" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="var(--line)" strokeWidth="2" />
        {Array.from({ length: 11 }).map((_, i) => {
          const a = Math.PI - (i / 10) * Math.PI;
          const x1 = 100 + Math.cos(a) * 85;
          const y1 = 100 - Math.sin(a) * 85;
          const x2 = 100 + Math.cos(a) * (i % 5 === 0 ? 75 : 80);
          const y2 = 100 - Math.sin(a) * (i % 5 === 0 ? 75 : 80);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--paper-muted)" strokeWidth="1" opacity="0.5" />;
        })}
        <motion.path
          d="M 15 100 A 85 85 0 0 1 185 100"
          fill="none"
          stroke="var(--signal)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength: live ? dash : value / max }}
          initial={false}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <span className="font-display font-bold text-5xl md:text-6xl tabular-nums text-foreground">
          {live && inView ? <motion.span>{text}</motion.span> : value}
          <span className="text-accent">{suffix}</span>
        </span>
      </div>
    </div>
  );
}

export function ImpactDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 25%"] });

  return (
    <SectionWrapper id="impact" className="blueprint-grid">
      <SectionHeader
        index="01"
        eyebrow="Impact"
        title={<>Numbers from the <span className="font-serif-accent text-accent">engine room.</span></>}
        subtitle="Measured outcomes from leading healthcare-tech engineering at Invitrace — not vanity metrics."
      />
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="impact-grid">
        {impactStats.map((stat, i) => {
          const Icon = ICONS[stat.icon];
          return (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl border border-border bg-ink-900/80 backdrop-blur p-6 hover:border-accent/60 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="label-mono">0{i + 1}</span>
                <Icon className="w-5 h-5 text-muted group-hover:text-accent transition-colors" aria-hidden="true" />
              </div>
              <Gauge value={stat.value} suffix={stat.suffix} progress={scrollYProgress} max={stat.value <= 5 ? 4 : 60} />
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{stat.label}</h3>
              <p className="mt-1 text-sm text-muted">{stat.description}</p>
            </motion.article>
          );
        })}
      </div>
      <ul className="mt-10 flex flex-wrap gap-2" aria-label="Credentials">
        {credentials.map((c) => (
          <li key={c} className="px-3 py-1.5 rounded-full border border-border text-sm text-foreground/80 bg-ink/60">
            {c}
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

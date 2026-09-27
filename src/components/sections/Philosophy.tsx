"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, BarChart3, Cpu } from "lucide-react";
import { philosophyPillars } from "@/lib/constants";
import { AmbientVideo } from "@/components/fx/AmbientVideo";
import { ScrollWordReveal } from "@/components/fx/ScrollWordReveal";
import { Reveal } from "@/components/fx/Reveal";
import { useMotionTier } from "@/motion/tier";

const icons = [Heart, BarChart3, Cpu];

const QUOTE =
  "Great engineering teams are built on trust, clarity and continuous improvement. Technology is the enabler — people are the multiplier.";

export function Philosophy() {
  const tier = useMotionTier();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} id="philosophy" className="relative py-28 md:py-40 overflow-hidden" data-testid="philosophy">
      <motion.div className="absolute inset-[-12%_0]" style={{ y: tier === "static" ? 0 : bgY }} aria-hidden="true">
        <AmbientVideo src="/media/loops/first-light" poster="/media/scenes/first-light.webp" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <Reveal>
          <p className="label-mono mb-8 flex items-center gap-3">
            <span className="text-accent">§06</span>
            <span className="h-px w-8 bg-border" aria-hidden="true" />
            How I lead
          </p>
        </Reveal>
        <ScrollWordReveal
          text={QUOTE}
          className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.12] tracking-tight text-paper"
        />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {philosophyPillars.map((pillar, i) => {
            const Icon = icons[i] ?? Heart;
            return (
              <Reveal key={pillar.title} delay={i * 0.1} className="border-t border-border pt-6">
                <Icon className="w-6 h-6 text-accent mb-5" aria-hidden="true" />
                <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">{pillar.title}</h3>
                <p className="text-muted leading-relaxed">{pillar.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { AmbientVideo } from "@/components/fx/AmbientVideo";
import { Magnetic } from "@/components/fx/Magnetic";
import { Button } from "@/components/ui/Button";
import { useContact } from "@/components/contact/ContactProvider";
import { siteConfig } from "@/lib/constants";
import { useMotionTier } from "@/motion/tier";

/** Final scene: sunrise behind the same spire from the hero — the system is live. */
export function Summit() {
  const tier = useMotionTier();
  const { openContact } = useContact();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const titleY = useTransform(scrollYProgress, [0.2, 1], ["30%", "0%"]);
  const isStatic = tier === "static";

  return (
    <section ref={ref} id="contact" className="relative min-h-svh flex items-center overflow-hidden" data-testid="summit">
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={isStatic ? undefined : { scale, borderRadius: radius }}
        aria-hidden="true"
      >
        <AmbientVideo src="/media/loops/summit" poster="/media/scenes/summit.webp" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
      </motion.div>

      <motion.div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 py-28" style={isStatic ? undefined : { y: titleY }}>
        <p className="label-mono mb-6 flex items-center gap-3">
          <span className="text-accent">§09</span>
          <span className="h-px w-8 bg-border" aria-hidden="true" />
          Summit
        </p>
        <h2 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-paper max-w-5xl leading-[0.95]">
          Let&apos;s build what&apos;s <span className="font-serif-accent text-accent">next.</span>
        </h2>
        <p className="mt-6 text-lg md:text-xl text-paper/80 max-w-xl">
          Scaling a team, untangling delivery, or planning an architecture? The first 30-minute call is on me.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.4}>
            <Button size="lg" rightIcon={<ArrowRight size={18} />} onClick={() => openContact()} data-cursor="talk" data-testid="summit-cta">
              Start the conversation
            </Button>
          </Magnetic>
          <a href={`mailto:${siteConfig.links.email}`} className="inline-flex items-center gap-2 text-paper/80 hover:text-accent transition-colors">
            <Mail size={18} aria-hidden="true" /> {siteConfig.links.email}
          </a>
        </div>
      </motion.div>
    </section>
  );
}

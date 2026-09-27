"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Download } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { ButtonLink } from "@/components/ui/Button";
import { experiences, siteConfig } from "@/lib/constants";

// A gently meandering trail; stretched to the list height (non-scaling stroke keeps it crisp).
const ROUTE = "M20 0 C 36 80, 4 160, 20 250 S 36 420, 20 500 S 4 670, 20 750 S 36 920, 20 1000";

export function ExperienceTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const drawn = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // The role nearest the viewport centre drives the sticky "altitude" panel.
  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-waypoint]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.waypoint));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = experiences[active];

  return (
    <SectionWrapper id="journey" aliasId="experience">
      <SectionHeader
        index="03"
        eyebrow="Journey"
        title={<>From first commit to <span className="font-serif-accent text-accent">leading the org.</span></>}
        subtitle="Nine years on one route: developer → consultant → tech lead → senior engineering manager."
      />

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Sticky altitude panel */}
        <aside className="hidden lg:block lg:col-span-5" aria-hidden="true">
          <div className="sticky top-28">
            <p className="label-mono mb-3">Waypoint {String(active + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}</p>
            <div className="relative h-[9.5rem] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={current.year}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-[8.5rem] leading-none font-bold tracking-tighter text-foreground"
                >
                  {current.year}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-4 font-display text-2xl text-accent">{current.role}</p>
            <p className="text-muted">{current.company}</p>
            <div className="mt-8">
              <ButtonLink href={siteConfig.resumeUrl} download="Thanaphat-Chirutpadathorn-Resume.pdf" variant="outline" leftIcon={<Download size={18} />}>
                Download full resume
              </ButtonLink>
            </div>
          </div>
        </aside>

        {/* Route + waypoints */}
        <div className="lg:col-span-7 relative">
          <svg className="absolute left-0 top-0 h-full w-10" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true">
            <path d={ROUTE} fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
            <motion.path d={ROUTE} fill="none" stroke="var(--signal)" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ pathLength: drawn }} />
          </svg>

          <ol ref={listRef} className="space-y-6 pl-14" data-testid="journey-list">
            {experiences.map((exp, i) => (
              <li key={`${exp.company}-${exp.role}`} data-waypoint={i} className="relative">
                <span
                  className={`absolute -left-[2.9rem] top-7 w-4 h-4 rounded-full border-2 transition-colors duration-500 ${
                    i <= active ? "bg-accent border-accent" : "bg-ink border-border"
                  }`}
                  aria-hidden="true"
                />
                <motion.article
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-2xl border p-6 md:p-7 transition-colors duration-500 ${
                    i === active ? "border-accent/60 bg-ink-900" : "border-border bg-ink-900/50"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">{exp.role}</h3>
                    <span className="label-mono">{exp.period}</span>
                  </div>
                  <p className="text-accent text-sm font-medium mb-3">{exp.company}</p>
                  <p className="text-foreground/75 leading-relaxed mb-4">{exp.description}</p>
                  <ul className="space-y-2">
                    {exp.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-sm text-foreground/80">
                        <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </li>
            ))}
          </ol>

          <div className="lg:hidden mt-10 pl-14">
            <ButtonLink href={siteConfig.resumeUrl} download="Thanaphat-Chirutpadathorn-Resume.pdf" variant="outline" leftIcon={<Download size={18} />}>
              Download full resume
            </ButtonLink>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

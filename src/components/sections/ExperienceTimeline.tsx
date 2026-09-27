"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Download } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { ButtonLink } from "@/components/ui/Button";
import { experienceGroups, siteConfig } from "@/lib/constants";

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

  const current = experienceGroups[active];
  const promotions = current.roles.length - 1;

  return (
    <SectionWrapper id="journey" aliasId="experience">
      <SectionHeader
        index="03"
        eyebrow="Journey"
        title={<>From first commit to <span className="font-serif-accent text-accent">leading the org.</span></>}
        subtitle="Three companies, nine years, one direction: developer → consultant → tech lead → senior engineering manager."
      />

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Sticky altitude panel */}
        <aside className="hidden lg:block lg:col-span-5" aria-hidden="true">
          <div className="sticky top-28">
            <p className="label-mono mb-3">Waypoint {String(active + 1).padStart(2, "0")} / {String(experienceGroups.length).padStart(2, "0")}</p>
            <div className="relative h-[9.5rem] overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={current.company}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-[8.5rem] leading-none font-bold tracking-tighter text-foreground"
                >
                  {current.from}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-foreground">{current.company}</p>
            <p className="text-accent">
              {current.roles[0].title}
              {promotions > 0 && <span className="text-muted"> · {promotions} promotion{promotions > 1 ? "s" : ""}</span>}
            </p>
            <p className="label-mono mt-2">{current.period}</p>
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
            {experienceGroups.map((group, i) => (
              <li key={group.company} data-waypoint={i} className="relative">
                <span
                  className={`absolute -left-[2.9rem] top-8 w-4 h-4 rounded-full border-2 transition-colors duration-500 ${
                    i <= active ? "bg-accent border-accent" : "bg-ink border-border"
                  }`}
                  aria-hidden="true"
                />
                <motion.article
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-2xl border transition-colors duration-500 overflow-hidden ${
                    i === active ? "border-accent/60 bg-ink-900" : "border-border bg-ink-900/50"
                  }`}
                  data-testid="journey-company"
                >
                  {/* Company header */}
                  <header className="flex flex-wrap items-end justify-between gap-3 px-6 md:px-7 pt-6 pb-5 border-b border-border">
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">{group.company}</h3>
                      <p className="text-sm text-muted">{group.tagline}</p>
                    </div>
                    <div className="text-right">
                      <p className="label-mono">{group.period}</p>
                      {group.roles.length > 1 && (
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-accent">
                          <span aria-hidden="true">↑</span> {group.roles.length} roles · promoted {group.roles.length - 1}×
                        </p>
                      )}
                    </div>
                  </header>

                  {/* Role ladder (newest first) */}
                  <ol className="relative px-6 md:px-7 py-6 space-y-7">
                    {group.roles.length > 1 && (
                      <span className="absolute left-[calc(1.5rem+5.5px)] md:left-[calc(1.75rem+5.5px)] top-9 bottom-9 w-px bg-gradient-to-b from-accent via-accent/50 to-accent/10" aria-hidden="true" />
                    )}
                    {group.roles.map((role, r) => (
                      <li key={role.title} className="relative pl-8">
                        <span
                          className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 ${
                            r === 0 ? "bg-accent border-accent" : "bg-ink border-accent/60"
                          }`}
                          aria-hidden="true"
                        />
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                          <h4 className="font-display text-lg md:text-xl font-semibold text-foreground">{role.title}</h4>
                          <span className="label-mono">{role.period}</span>
                        </div>
                        <p className="text-foreground/75 leading-relaxed mb-3">{role.description}</p>
                        <ul className="space-y-1.5">
                          {role.highlights.map((h) => (
                            <li key={h} className="flex gap-3 text-sm text-foreground/80">
                              <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-accent/80" aria-hidden="true" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
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

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Target, Code, Users, ArrowRight, MessageSquare, type LucideIcon } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/fx/TiltCard";
import { Magnetic } from "@/components/fx/Magnetic";
import { useContact } from "@/components/contact/ContactProvider";
import { services } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = { Lightbulb, Target, Code, Users };

export function FreelanceServices() {
  const { openContact } = useContact();
  const gridRef = useRef<HTMLDivElement>(null);

  // Spotlight follows the pointer across the whole grid (CSS vars, no re-render).
  const onPointerMove = (e: React.PointerEvent) => {
    const el = gridRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <SectionWrapper id="services" className="bg-ink-900/60">
      <SectionHeader
        index="04"
        eyebrow="Consulting"
        title={<>Choose your <span className="font-serif-accent text-accent">path.</span></>}
        subtitle="Four ways I work with founders and engineering teams. The first 30-minute call is free."
      />

      <div ref={gridRef} onPointerMove={onPointerMove} className="relative grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="services-grid">
        <div className="spotlight pointer-events-none absolute -inset-10 rounded-3xl" aria-hidden="true" />
        {services.map((service, index) => {
          const Icon = iconMap[service.icon] ?? Lightbulb;
          return (
            // The observed wrapper is unclipped: a zero-area clip-path target never
            // intersects, so whileInView would never fire.
            <motion.div
              key={service.id}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, margin: "-60px" }}
            >
              <motion.div
                className="h-full"
                variants={{
                  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0 round 1rem)" },
                  shown: { opacity: 1, clipPath: "inset(0 0 0% 0 round 1rem)" },
                }}
                transition={{ duration: 0.9, delay: index * 0.1, ease: [0.76, 0, 0.24, 1] }}
              >
              <TiltCard className="h-full rounded-2xl">
                <article className="group relative h-full rounded-2xl border border-border bg-card/80 backdrop-blur p-7 md:p-8 overflow-hidden hover:border-accent/60 transition-colors">
                  <span className="absolute top-5 right-6 font-display text-7xl font-bold text-foreground/[0.06] select-none" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 grid place-items-center mb-6">
                    <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                        <span className="w-4 h-px bg-accent" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    onClick={() => openContact(service.title)}
                    data-testid={`service-cta-${service.id}`}
                  >
                    Discuss this
                  </Button>
                </article>
              </TiltCard>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-14 flex flex-col items-center text-center gap-5">
        <p className="text-muted">Not sure which fits? Let&apos;s figure it out together.</p>
        <Magnetic>
          <Button size="lg" leftIcon={<MessageSquare size={20} />} onClick={() => openContact()} data-cursor="talk">
            Schedule a free consultation
          </Button>
        </Magnetic>
      </div>
    </SectionWrapper>
  );
}

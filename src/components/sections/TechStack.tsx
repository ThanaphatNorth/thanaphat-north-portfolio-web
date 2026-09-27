"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { techStack } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Category = keyof typeof techStack;

const LABELS: Record<Category, string> = {
  frontend: "Frontend & mobile",
  backend: "Backend",
  cloud: "Cloud & delivery",
  database: "Data",
};

// Each constellation sits in its own quadrant around the North star (viewBox 0 0 100 60).
const CENTRES: Record<Category, { x: number; y: number; a0: number }> = {
  frontend: { x: 24, y: 17, a0: 200 },
  backend: { x: 76, y: 17, a0: -20 },
  cloud: { x: 76, y: 45, a0: 20 },
  database: { x: 24, y: 45, a0: 160 },
};
const NORTH = { x: 50, y: 31 };

const nodes = (Object.keys(techStack) as Category[]).flatMap((cat) => {
  const c = CENTRES[cat];
  const items = techStack[cat];
  return items.map((t, i) => {
    const a = ((c.a0 + (i - (items.length - 1) / 2) * 38) * Math.PI) / 180;
    return { cat, name: t.name, x: c.x + Math.cos(a) * 11, y: c.y + Math.sin(a) * 7.5 };
  });
});

export function TechStack() {
  const [hover, setHover] = useState<Category | null>(null);

  return (
    <SectionWrapper id="stack" aliasId="tech-stack" className="bg-ink-900/60">
      <SectionHeader
        index="08"
        eyebrow="Stack"
        title={<>The stars I <span className="font-serif-accent text-accent">navigate by.</span></>}
        subtitle="Tools I have shipped production systems with. Hover a constellation to trace it."
      />

      {/* Screen-reader / no-SVG equivalent */}
      <ul className="sr-only">
        {(Object.keys(techStack) as Category[]).map((cat) => (
          <li key={cat}>
            {LABELS[cat]}: {techStack[cat].map((t) => t.name).join(", ")}
          </li>
        ))}
      </ul>

      <div className="relative" aria-hidden="true" data-testid="constellation">
        <svg viewBox="0 0 100 60" className="w-full h-auto overflow-visible">
          {/* category hubs → North */}
          {(Object.keys(CENTRES) as Category[]).map((cat, i) => (
            <motion.line
              key={cat}
              x1={NORTH.x} y1={NORTH.y} x2={CENTRES[cat].x} y2={CENTRES[cat].y}
              stroke={hover === cat ? "var(--signal)" : "var(--line)"}
              strokeWidth={0.15}
              strokeDasharray="0.6 0.8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.15 }}
            />
          ))}
          {/* star → its hub */}
          {nodes.map((n) => (
            <motion.line
              key={`l-${n.name}`}
              x1={CENTRES[n.cat].x} y1={CENTRES[n.cat].y} x2={n.x} y2={n.y}
              stroke={hover === n.cat ? "var(--signal)" : "var(--blueprint)"}
              strokeOpacity={hover === n.cat ? 0.9 : 0.25}
              strokeWidth={0.15}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.6 }}
            />
          ))}
          {/* North star */}
          <g>
            <circle cx={NORTH.x} cy={NORTH.y} r={3.2} fill="var(--signal)" opacity={0.12} />
            <path d={`M${NORTH.x} ${NORTH.y - 2.6} L${NORTH.x + 0.6} ${NORTH.y - 0.6} L${NORTH.x + 2.6} ${NORTH.y} L${NORTH.x + 0.6} ${NORTH.y + 0.6} L${NORTH.x} ${NORTH.y + 2.6} L${NORTH.x - 0.6} ${NORTH.y + 0.6} L${NORTH.x - 2.6} ${NORTH.y} L${NORTH.x - 0.6} ${NORTH.y - 0.6} Z`} fill="var(--signal)" />
            <text x={NORTH.x} y={NORTH.y + 5.2} textAnchor="middle" fontSize="1.6" className="fill-paper font-mono" letterSpacing="0.3">NORTH</text>
          </g>
          {/* hubs */}
          {(Object.keys(CENTRES) as Category[]).map((cat) => (
            <text
              key={`t-${cat}`}
              x={CENTRES[cat].x} y={CENTRES[cat].y + 0.6}
              textAnchor="middle" fontSize="1.5"
              className={cn("font-mono uppercase transition-colors", hover === cat ? "fill-accent" : "fill-muted")}
              letterSpacing="0.2"
            >
              {LABELS[cat]}
            </text>
          ))}
          {/* stars */}
          {nodes.map((n, i) => (
            <g
              key={n.name}
              onPointerEnter={() => setHover(n.cat)}
              onPointerLeave={() => setHover(null)}
              className="cursor-pointer"
            >
              <circle cx={n.x} cy={n.y} r={3} fill="transparent" />
              <motion.circle
                cx={n.x} cy={n.y}
                r={hover === n.cat ? 0.9 : 0.6}
                fill={hover === n.cat ? "var(--signal)" : "var(--paper)"}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.05, type: "spring", stiffness: 260, damping: 14 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
              <text
                x={n.x} y={n.y - 1.6}
                textAnchor="middle" fontSize="1.9"
                className={cn("font-display transition-colors", hover === n.cat ? "fill-paper" : "fill-paper/60")}
              >
                {n.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Compact list for small screens, where the SVG text gets tiny */}
      <div className="md:hidden mt-10 grid grid-cols-2 gap-6">
        {(Object.keys(techStack) as Category[]).map((cat) => (
          <div key={cat}>
            <p className="label-mono !text-accent mb-2">{LABELS[cat]}</p>
            <p className="text-foreground/80 text-sm leading-relaxed">{techStack[cat].map((t) => t.name).join(" · ")}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

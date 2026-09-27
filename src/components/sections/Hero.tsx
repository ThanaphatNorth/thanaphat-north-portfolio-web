"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDownRight, Sparkles } from "lucide-react";
import { useLenis } from "lenis/react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { TiltCard } from "@/components/fx/TiltCard";
import { useTerminal } from "@/components/terminal/TerminalProvider";
import { FrameSequence } from "@/components/fx/FrameSequence";
import { AmbientVideo } from "@/components/fx/AmbientVideo";
import { CodeMosaic } from "@/components/fx/CodeMosaic";
import { useContact } from "@/components/contact/ContactProvider";
import { useMotionTier } from "@/motion/tier";
import { scrollToTarget } from "@/motion/scrollTo";
import { depth, pointerSpring } from "@/motion/tokens";
import { coordinates, siteConfig } from "@/lib/constants";
import type { ExperienceYears } from "@/lib/experience";

const FRAME_COUNT = 71;
const frameUrl = (i: number) => `/media/frames/hero/f_${String(i).padStart(3, "0")}.webp`;

/**
 * Service labels pinned onto blueprint buildings (percent of the 21:9 scene).
 * They make the metaphor explicit: the "city" is a software system.
 */
const SERVICES = [
  { id: "api-gateway", x: 55.5, y: 47, anchorY: 50 },
  { id: "patient-app", x: 75.5, y: 59, anchorY: 67 },
  { id: "auth-service", x: 69, y: 52, anchorY: 63 },
  { id: "employee-health", x: 82, y: 47, anchorY: 58 },
  { id: "hospital-core", x: 93.5, y: 62, anchorY: 71 },
] as const;
const HUB = { x: 62.7, y: 74 };

/** Pointer offset (-0.5…0.5) → pixel shift scaled by a layer's depth. */
function useDepthLayer(sx: MotionValue<number>, sy: MotionValue<number>, d: number) {
  return {
    x: useTransform(sx, (v) => v * d * 40),
    y: useTransform(sy, (v) => v * d * 24),
  };
}

interface HeroProps {
  experience: ExperienceYears;
}

export function Hero({ experience }: HeroProps) {
  const tier = useMotionTier();
  const lenis = useLenis();
  const { openContact } = useContact();
  const { openTerminal } = useTerminal();
  const sectionRef = useRef<HTMLElement>(null);
  const [built, setBuilt] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const p = tier === "static" ? undefined : scrollYProgress;

  // Story: blueprint → city (0–.42) → city holds (.42–.52) → city is rewritten as code (.52–.88) → hand-off.
  const buildProgress = useTransform(scrollYProgress, [0, 0.42], [0, 1]);
  const blueprintOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]); // lite crossfade
  const annotationsOpacity = useTransform(scrollYProgress, [0.05, 0.32], [1, 0]);
  const towerIn = useTransform(scrollYProgress, [0.34, 0.46], [0, 1]);
  const codeProgress = useTransform(scrollYProgress, [0.52, 0.88], [0, 1]);
  const cityOpacity = useTransform(scrollYProgress, [0.55, 0.9], [1, 0.1]);
  const towerOpacity = useTransform(() => towerIn.get() * cityOpacity.get());
  const sceneScale = useTransform(scrollYProgress, [0.42, 1], [1, 1.08]);
  const wordY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-40%"]);
  const wordOpacity = useTransform(scrollYProgress, [0.5, 0.68], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0.5, 0.8], ["0%", "-18%"]);
  const copyOpacity = useTransform(scrollYProgress, [0.52, 0.66], [1, 0]);
  const portraitY = useTransform(scrollYProgress, [0, 0.66], ["0%", "8%"]);
  const gradientOpacity = useTransform(scrollYProgress, [0.52, 0.7], [1, 0.25]);
  const fadeToInk = useTransform(scrollYProgress, [0.92, 1], [0, 1]);
  const codeStatementOpacity = useTransform(scrollYProgress, [0.74, 0.82, 0.93], [0, 1, 1]);
  const codeStatementY = useTransform(scrollYProgress, [0.74, 0.93], ["24px", "-12px"]);
  const [phase, setPhase] = useState<"blueprint" | "built" | "code">("blueprint");

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v > 0.62 ? "code" : v > 0.44 ? "built" : "blueprint";
    if (next !== phase) setPhase(next);
    const isBuilt = v > 0.44;
    if (isBuilt !== built) setBuilt(isBuilt);
  });

  // Mouse parallax ("full" tier): each layer shifts by its depth factor.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, pointerSpring);
  const sy = useSpring(my, pointerSpring);
  const farL = useDepthLayer(sx, sy, depth.far);
  const wordL = useDepthLayer(sx, sy, depth.word);
  const nearL = useDepthLayer(sx, sy, depth.near);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const glowX = useTransform(sx, (v) => `${50 + v * 20}%`);
  const glowY = useTransform(sy, (v) => `${40 + v * 20}%`);
  const glow = useMotionTemplate`radial-gradient(600px circle at ${glowX} ${glowY}, rgba(255,90,31,0.10), transparent 60%)`;

  const onPointerMove = (e: React.PointerEvent) => {
    if (tier !== "full" || e.pointerType !== "mouse") return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  const isStatic = tier === "static";

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      onPointerMove={onPointerMove}
      className={isStatic ? "relative h-svh min-h-[640px]" : "relative h-[280svh]"}
      data-testid="hero"
    >
      <div className="sticky top-0 h-svh min-h-[640px] overflow-hidden bg-ink">
        {/* ── Scene: every image layer shares one 21:9 box so they stay aligned ── */}
        <motion.div className="hero-scene" style={{ scale: p ? sceneScale : 1, x: farL.x, y: farL.y, opacity: p ? cityOpacity : 1 }}>
          {/* Base: blueprint (start) and real skyline (end) */}
          <picture>
            <source type="image/avif" srcSet="/media/hero/skyline-1440.avif 1440w, /media/hero/skyline.avif 2560w" sizes="(max-width: 1440px) 1440px, 2560px" />
            <img src="/media/hero/skyline.webp" alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority={isStatic ? "high" : "auto"} />
          </picture>

          {!isStatic && (
            <motion.picture style={{ opacity: tier === "full" ? 1 : blueprintOpacity }} className="absolute inset-0">
              <source type="image/avif" srcSet="/media/hero/blueprint.avif" />
              {/* eslint-disable-next-line @next/next/no-img-element -- art-directed, pre-encoded layer */}
              <img src="/media/hero/blueprint.webp" alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" data-testid="hero-blueprint" />
            </motion.picture>
          )}

          {tier === "full" && <FrameSequence count={FRAME_COUNT} frame={frameUrl} progress={buildProgress} />}

          {/* Ambient life once the city is built */}
          {!isStatic && (
            <motion.div className="absolute inset-0" style={{ opacity: towerOpacity }}>
              <AmbientVideo src="/media/loops/hero-loop" poster="/media/hero/skyline.webp" enabled={built || tier === "lite"} />
            </motion.div>
          )}

          {/* System-diagram annotations (blueprint phase) */}
          {!isStatic && (
            <motion.svg
              viewBox="0 0 100 42.857"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              style={{ opacity: annotationsOpacity }}
              aria-hidden="true"
            >
              {SERVICES.map((s) => (
                <path
                  key={s.id}
                  d={`M ${s.x} ${(s.anchorY * 42.857) / 100} L ${HUB.x} ${(HUB.y * 42.857) / 100}`}
                  className="hero-dataline"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </motion.svg>
          )}
          {!isStatic && (
            <motion.div className="absolute inset-0" style={{ opacity: annotationsOpacity }} aria-hidden="true">
              {SERVICES.map((s) => (
                <span key={s.id} className="hero-tag" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                  <span className="hero-tag-dot" />
                  {s.id}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Mouse glow */}
        {tier === "full" && <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glow }} aria-hidden="true" />}

        {/* Wordmark — sits BEHIND the tower cutout (text-behind-object) */}
        <motion.div
          className="absolute inset-x-0 top-[12svh] flex justify-center pointer-events-none select-none"
          style={{ y: p ? wordY : 0, opacity: p ? wordOpacity : 1, x: wordL.x }}
          aria-hidden="true"
        >
          <span className="font-display font-bold leading-none tracking-[-0.04em] text-paper/90 text-[min(22vw,27svh)]">
            NORTH
          </span>
        </motion.div>

        {/* Foreground tower cutout, same scene box */}
        <motion.div className="hero-scene pointer-events-none" style={{ scale: p ? sceneScale : 1, x: nearL.x, y: nearL.y, opacity: isStatic ? 1 : towerOpacity }} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- alpha cutout layer */}
          <img src="/media/hero/tower.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        </motion.div>

        {/* North himself — foreground layer beside the tower (desktop) */}
        <motion.div
          className="absolute bottom-0 right-[3vw] h-[64svh] aspect-[992/1200] hidden xl:block pointer-events-none"
          style={{ x: nearL.x, y: p ? portraitY : 0, opacity: p ? copyOpacity : 1 }}
          data-testid="hero-portrait"
          aria-hidden="true"
        >
          <picture>
            <source media="(max-height: 820px)" srcSet="/media/north-700.webp" />
            <img
              src="/media/north.webp"
              alt=""
              className="h-full w-full object-contain object-bottom [filter:drop-shadow(-10px_0_22px_rgba(255,90,31,0.28))_drop-shadow(0_0_1px_rgba(237,230,217,0.35))_saturate(0.92)_contrast(1.04)]"
              fetchPriority="low"
            />
          </picture>
        </motion.div>

        {/* Legibility gradient for the copy; fades out with it so the code phase stays bright */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: p ? gradientOpacity : 1 }} aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
        </motion.div>

        {/* The city, rewritten as the code that runs it */}
        {!isStatic && (
          <motion.div className="hero-scene pointer-events-none" style={{ scale: sceneScale, x: farL.x, y: farL.y }} aria-hidden="true">
            <CodeMosaic key={tier} src="/media/hero/blueprint.webp" progress={codeProgress} cell={tier === "full" ? 8 : 10} />
          </motion.div>
        )}


        {/* Corner annotations */}
        <div className="absolute top-20 md:top-24 inset-x-0 max-w-7xl mx-auto px-4 md:px-6 flex justify-between pointer-events-none">
          <span className="label-mono">Sheet 00 / 09 · System architecture</span>
          <span className="label-mono hidden sm:inline">{coordinates}</span>
        </div>

        {/* Access badge — the person behind the systems (desktop) */}
        <motion.div
          className="absolute right-6 2xl:right-[3vw] top-[13svh] hidden xl:block [@media(max-height:820px)]:!hidden"
          style={{ x: nearL.x, y: nearL.y, opacity: p ? copyOpacity : 1 }}
          data-testid="hero-badge"
        >
          <TiltCard className="rounded-2xl" max={10}>
            <div className="w-60 rounded-2xl glass border border-border/70 p-4 shadow-2xl shadow-ink/60">
              <div className="flex items-center justify-between mb-3">
                <span className="label-mono !text-accent">Access · production</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny local asset, alpha-cut */}
                <img src="/media/portrait.webp" alt="Thanaphat (North)" width={64} height={64} className="w-16 h-16 rounded-full ring-2 ring-accent/70 object-cover" />
                <div>
                  <p className="font-display text-lg font-semibold leading-tight text-paper">Thanaphat C.</p>
                  <p className="text-xs text-muted">Senior Engineering Manager</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[11px]">
                <dt className="text-muted">ID</dt>
                <dd className="text-paper/85">NORTH-2017</dd>
                <dt className="text-muted">Team</dt>
                <dd className="text-paper/85">30+ engineers</dd>
              </dl>
              <div className="mt-4 h-6 rounded bg-[repeating-linear-gradient(90deg,var(--paper)_0_2px,transparent_2px_4px,var(--paper)_4px_5px,transparent_5px_8px)] opacity-25" aria-hidden="true" />
            </div>
          </TiltCard>
        </motion.div>

        {/* Copy — visible at first paint (no opacity:0 on the LCP text) */}
        <motion.div
          className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 md:px-6 pb-14 md:pb-20"
          style={{ y: p ? copyY : 0, opacity: p ? copyOpacity : 1 }}
        >
          <div className="max-w-2xl">
            <p className="[@media(max-height:820px)]:hidden inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full glass border border-border text-xs md:text-sm text-foreground/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" aria-hidden="true" />
              Available for consulting · free 30-min call
            </p>
            <p className="label-mono !text-accent mb-3">{siteConfig.role}</p>
            <h1 className="font-display text-[2.4rem] leading-[1.02] sm:text-5xl md:text-6xl lg:text-[min(4.75rem,7svh)] font-bold tracking-tight text-paper">
              I turn software blueprints into systems that{" "}
              <span className="font-serif-accent text-accent">ship.</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-paper/75 max-w-xl leading-relaxed">
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny local asset */}
              <img src="/media/portrait.webp" alt="" width={28} height={28} className="xl:hidden inline-block w-7 h-7 rounded-full ring-1 ring-accent/60 align-[-0.45em] mr-2" />
              Thanaphat (North) — {experience.totalYearsDisplay} years in software,{" "}
              {experience.leadershipYearsDisplay} leading teams. I head a 30+ engineer healthcare-tech organization and
              help companies scale delivery, architecture and people.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button size="lg" leftIcon={<Sparkles size={18} />} onClick={() => openContact()} data-cursor="talk" data-testid="hero-cta">
                  Book a free consult
                </Button>
              </Magnetic>
              <Button
                size="lg"
                variant="outline"
                rightIcon={<ArrowDownRight size={18} />}
                onClick={() => scrollToTarget("#work", lenis)}
                data-testid="hero-work"
              >
                See my work
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Code phase statement */}
        {!isStatic && (
          <motion.div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 max-w-7xl mx-auto px-4 md:px-6 pointer-events-none"
            style={{ opacity: codeStatementOpacity, y: codeStatementY }}
          >
            <div className="max-w-3xl rounded-2xl glass border border-border/60 p-6 md:p-8">
              <p className="label-mono !text-accent mb-3">{"// what's underneath"}</p>
              <p className="font-display text-3xl md:text-5xl font-bold leading-tight text-paper">
                Every city runs on code. I build the teams, pipelines and{" "}
                <span className="font-serif-accent text-accent">AI-assisted</span> workflows that write it.
              </p>
            </div>
          </motion.div>
        )}

        {/* Caption + terminal line (bottom-right) — opens the real terminal */}
        <div className="absolute bottom-6 right-4 md:right-6 hidden lg:block text-right">
          <p className="label-mono mb-2" aria-hidden="true">
            {phase === "code" ? "…and runs on code that ships." : "Every system starts as a blueprint."}
          </p>
          <button
            type="button"
            onClick={openTerminal}
            className="font-mono text-xs text-paper/80 hover:text-paper transition-colors"
            aria-label="Open the terminal"
            data-testid="hero-terminal"
          >
            <span className="text-accent">$</span>{" "}
            {phase === "code" ? (
              <>
                ai-agent implement --spec=blueprint.md <span className="caret">▍</span>
              </>
            ) : (
              <>
                deploy --env=production{" "}
                {built || isStatic ? <span className="text-emerald-400">✓ live</span> : <span className="caret">▍</span>}
              </>
            )}
            <span className="ml-3 text-muted">[press /]</span>
          </button>
        </div>

        {/* Scroll hint */}
        {!isStatic && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 label-mono hidden md:flex flex-col items-center gap-2 pointer-events-none"
            style={{ opacity: hintOpacity }}
            aria-hidden="true"
          >
            Scroll to build
            <span className="block w-px h-8 bg-gradient-to-b from-accent to-transparent" />
          </motion.div>
        )}

        {/* Hand-off to the next section */}
        {!isStatic && <motion.div className="absolute inset-0 bg-ink pointer-events-none" style={{ opacity: fadeToInk }} aria-hidden="true" />}
      </div>
    </section>
  );
}

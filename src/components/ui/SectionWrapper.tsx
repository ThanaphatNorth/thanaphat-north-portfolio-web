import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/fx/Reveal";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children?: ReactNode;
  /** Legacy anchor kept so old shared links (#portfolio, #experience) still land here. */
  aliasId?: string;
}

/** Plain section shell. No whole-section fade: content is visible without JS. */
export function SectionWrapper({ id, className, children, aliasId }: SectionWrapperProps) {
  return (
    <section id={id} className={cn("relative py-20 md:py-28 lg:py-36 px-4 md:px-6 scroll-mt-16", className)}>
      {aliasId && <span id={aliasId} className="absolute -top-16" aria-hidden="true" />}
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  /** e.g. "02" */
  index?: string;
  /** e.g. "Impact" */
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({ index, eyebrow, title, subtitle, align = "left", className }: SectionHeaderProps) {
  return (
    <Reveal className={cn("mb-12 md:mb-16", align === "center" && "text-center", className)}>
      {(index || eyebrow) && (
        <p className={cn("label-mono mb-4 flex items-center gap-3", align === "center" && "justify-center")}>
          {index && <span className="text-accent">§{index}</span>}
          <span className="h-px w-8 bg-border" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-5 text-muted text-lg md:text-xl max-w-2xl leading-relaxed", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

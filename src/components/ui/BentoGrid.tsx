"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  columns?: 2 | 3 | 4;
  className?: string;
  children?: ReactNode;
}

const columnClasses = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export function BentoGrid({ className, columns = 4, children }: BentoGridProps) {
  return (
    <div className={cn("grid gap-4", columnClasses[columns], className)}>
      {children}
    </div>
  );
}

interface BentoCardProps {
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  index?: number;
  className?: string;
  children?: ReactNode;
}

export function BentoCard({
  className,
  colSpan = 1,
  rowSpan = 1,
  index = 0,
  children,
}: BentoCardProps) {
  const spanClasses = cn(
    colSpan === 2 && "md:col-span-2",
    rowSpan === 2 && "md:row-span-2"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "relative rounded-2xl bg-card border border-border p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5",
        spanClasses,
        className
      )}
    >
      {children}
    </motion.div>
  );
}

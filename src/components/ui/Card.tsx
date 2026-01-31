"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  hover?: boolean;
  glow?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Card({
  className,
  hover = true,
  glow = false,
  children,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        "relative rounded-2xl bg-card border border-border p-6 transition-all duration-300",
        hover && "hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5",
        glow && "animate-pulse-glow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  className?: string;
  children?: ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  className?: string;
  children?: ReactNode;
}

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <h3 className={cn("text-xl font-semibold text-foreground", className)}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  className?: string;
  children?: ReactNode;
}

export function CardDescription({ className, children }: CardDescriptionProps) {
  return <p className={cn("text-muted text-sm", className)}>{children}</p>;
}

interface CardContentProps {
  className?: string;
  children?: ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn("pt-0", className)}>{children}</div>;
}

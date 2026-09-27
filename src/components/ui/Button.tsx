"use client";

import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent hover:bg-accent-hover text-ink font-semibold shadow-lg shadow-accent/20",
  secondary: "bg-card hover:bg-card-hover text-foreground border border-border",
  outline: "bg-transparent hover:bg-card text-foreground border border-border hover:border-accent",
  ghost: "bg-transparent hover:bg-card text-foreground",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-7 py-4 text-base md:text-lg",
};

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps &
  Omit<HTMLMotionProps<"button">, "children" | "className"> & { isLoading?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, children, disabled, type = "button", ...props },
    ref
  ) => (
    <motion.button
      ref={ref}
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(base, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  )
);
Button.displayName = "Button";

type ButtonLinkProps = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className">;

/** A link styled as a button — use instead of wrapping <Button> in <a> (invalid nested interactive). */
export function ButtonLink({
  className, variant = "primary", size = "md", leftIcon, rightIcon, children, ...props
}: ButtonLinkProps) {
  return (
    <a className={cn(base, variantStyles[variant], sizeStyles[size], className)} {...props}>
      {leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
    </a>
  );
}

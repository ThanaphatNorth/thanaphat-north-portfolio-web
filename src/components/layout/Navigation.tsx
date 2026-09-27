"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Download, Menu } from "lucide-react";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useContact } from "@/components/contact/ContactProvider";
import { useTerminal } from "@/components/terminal/TerminalProvider";
import { MotionToggle } from "@/components/fx/MotionToggle";
import { scrollToTarget } from "@/motion/scrollTo";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const { openContact } = useContact();
  const { openTerminal } = useTerminal();

  // MotionValue subscription: re-renders only when the boolean flips.
  useMotionValueEvent(scrollY, "change", (y) => setIsScrolled(y > 40));

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToTarget(href, lenis);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:px-4 focus:py-2 focus:rounded-full focus:bg-accent focus:text-ink"
      >
        Skip to content
      </a>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-300 border-b",
          isScrolled ? "glass border-border/60" : "bg-transparent border-transparent"
        )}
      >
        <nav aria-label="Primary" className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-18 flex items-center justify-between gap-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("#top");
            }}
            className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground"
            data-testid="nav-logo"
          >
            North<span className="text-accent">.</span>
          </a>

          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.isExternal ? (
                  <Link href={link.href} className="nav-link text-sm text-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.href);
                    }}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                    data-testid={`nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={openTerminal}
              aria-label="Open terminal (press /)"
              title="Terminal — press /"
              data-testid="terminal-toggle"
              className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-full border border-border font-mono text-xs text-muted hover:text-accent hover:border-accent transition-colors"
            >
              &gt;_<kbd className="hidden lg:inline text-[10px] opacity-70">/</kbd>
            </button>
            <MotionToggle />
            <a
              href={siteConfig.resumeUrl}
              download="Thanaphat-Chirutpadathorn-Resume.pdf"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors px-2"
            >
              <Download size={15} aria-hidden="true" /> Resume
            </a>
            <Button size="sm" onClick={() => openContact()} data-testid="nav-cta" data-cursor="talk">
              Let&apos;s talk
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-foreground"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </nav>
      </motion.header>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} variant="right" title="Menu" className="sm:max-w-sm sm:w-full">
        <div className="flex flex-col h-full p-6 gap-2">
          {navLinks.map((link) =>
            link.isExternal ? (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="font-display text-2xl py-2 text-foreground">
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.href);
                }}
                className="font-display text-2xl py-2 text-foreground"
              >
                {link.label}
              </a>
            )
          )}
          <div className="mt-8 flex flex-col gap-3">
            <Button size="lg" className="w-full" onClick={() => { setMenuOpen(false); openContact(); }}>
              Let&apos;s talk
            </Button>
            <a href={siteConfig.resumeUrl} download className="text-center text-sm text-muted py-2">
              Download resume (PDF)
            </a>
            <div className="flex justify-center pt-2"><MotionToggle withLabel /></div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

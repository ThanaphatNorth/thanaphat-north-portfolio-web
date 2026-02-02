"use client";

import { motion } from "framer-motion";
import { ArrowUp, Github, Linkedin, Mail, Heart } from "lucide-react";
import { siteConfig, navLinks } from "@/lib/constants";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card border-t border-border">
      {/* Back to Top Button */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <motion.button
          onClick={scrollToTop}
          whileHover={{ y: -4, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/25 hover:bg-accent-hover transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <motion.a
              href="#"
              className="inline-block text-2xl font-bold text-foreground mb-4"
              whileHover={{ scale: 1.05 }}
            >
              North<span className="text-accent">.</span>
            </motion.a>
            <p className="text-muted leading-relaxed mb-6 max-w-md">
              Engineering Manager and Tech Entrepreneur focused on
              building high-performing teams and scalable systems.
              Let&apos;s create something amazing together.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <motion.a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={`mailto:${siteConfig.links.email}`}
                whileHover={{ y: -4, scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  {siteConfig.links.email}
                </a>
              </li>
              <li>
                <span className="text-muted">Bangkok, Thailand</span>
              </li>
              <li>
                <span className="text-muted">
                  Available for remote work
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted flex items-center gap-1">
            © {currentYear} {siteConfig.name}. Built with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
            using Next.js
          </p>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Menu,
  X,
  Inbox,
  FileText,
  Home,
  Settings,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

const adminNavLinks = [
  { href: "/admin", label: "Contacts", icon: Inbox },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/ventures", label: "Ventures", icon: Rocket },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border-b border-border sticky top-0 z-50"
      >
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-xl font-bold text-foreground"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-accent" />
              </div>
              <span>
                Admin<span className="text-accent">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {adminNavLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-accent text-white"
                        : "text-muted hover:text-foreground hover:bg-background"
                    )}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Back to Site */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background"
            >
              <Home size={16} />
              <span className="hidden lg:inline">View Site</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background disabled:opacity-50"
            >
              <LogOut size={18} />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-card border-l border-border z-50 md:hidden"
            >
              <div className="flex flex-col h-full p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Mobile Nav Links */}
                <div className="flex flex-col gap-2">
                  {adminNavLinks.map((link, index) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                            active
                              ? "bg-accent text-white"
                              : "text-muted hover:text-foreground hover:bg-background"
                          )}
                        >
                          <Icon size={20} />
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Footer Actions */}
                <div className="mt-auto space-y-3">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background w-full"
                  >
                    <Home size={20} />
                    View Site
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10 w-full disabled:opacity-50"
                  >
                    <LogOut size={20} />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

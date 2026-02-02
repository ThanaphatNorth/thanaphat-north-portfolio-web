"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowDown,
  Briefcase,
  MessageSquare,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/constants";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export function Hero() {
  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background animate-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                           linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 md:px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Available for new opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-accent font-medium mb-4"
        >
          Hi, I&apos;m Thanaphat (North)
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight"
        >
          Engineering Manager <span className="text-muted">|</span>{" "}
          <br className="hidden md:block" />
          <span className="gradient-text">Scaling Teams</span>
          <span className="text-muted"> & </span>
          <span className="gradient-text">Systems</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          8+ years in software development with 5+ years in
          leadership. Expert in Agile methodologies, DevOps practices,
          and cloud infrastructure (AWS). Passionate about empowering
          teams to deliver scalable, secure, and high-impact
          solutions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap"
        >
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Briefcase size={20} />}
            onClick={() => handleScroll("#experience")}
          >
            View Full-time Experience
          </Button>
          <Button
            variant="outline"
            size="lg"
            leftIcon={<MessageSquare size={20} />}
            onClick={() => handleScroll("#services")}
          >
            Hire for Freelance
          </Button>
        </motion.div>

        {/* Download Resume */}
        <motion.div variants={itemVariants} className="mt-6">
          <a
            href={siteConfig.resumeUrl}
            download="Thanaphat-Chirutpadathorn-Resume.pdf"
            className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm font-medium group"
          >
            <Download
              size={16}
              className="group-hover:animate-bounce"
            />
            Download Resume (PDF)
          </a>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {[
            { value: "30+", label: "Engineers Managed" },
            { value: "8+", label: "Years in Tech" },
            { value: "30%", label: "Efficiency Boost" },
            { value: "ISO", label: "27001/9001" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.button
            onClick={() => handleScroll("#impact")}
            className="flex flex-col items-center gap-2 text-muted hover:text-foreground transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            aria-label="Scroll to next section"
          >
            <span className="text-xs uppercase tracking-wider">
              Scroll
            </span>
            <ArrowDown size={20} />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}

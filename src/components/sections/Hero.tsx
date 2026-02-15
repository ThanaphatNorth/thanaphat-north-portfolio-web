"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowDown,
  Briefcase,
  MessageSquare,
  Download,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/constants";
import { ExperienceYears } from "@/lib/experience";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
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

interface HeroProps {
  experience: ExperienceYears;
}

export function Hero({ experience }: HeroProps) {
  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24"
      aria-label="Thanaphat North - Technical Consultant, Engineering Manager & Software Architect"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background animate-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-5s" }}
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
        {/* Free Consultation Badge */}
        <motion.div variants={itemVariants} className="mb-4">
          <span className="free-consult-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 text-accent text-sm font-semibold shadow-lg shadow-accent/10">
            <Sparkles size={16} className="animate-pulse" />
            Free 1st Consultation Session
            <ArrowRight size={14} />
          </span>
        </motion.div>

        {/* Availability Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for Hire — Limited Slots
          </span>
        </motion.div>

        {/* Name */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-accent font-medium mb-4"
        >
          Hi, I&apos;m Thanaphat (North)
        </motion.p>

        {/* Main Headline - Client-focused */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight"
        >
          I Help Businesses
          <br className="hidden md:block" />
          <span className="gradient-text">
            Ship Faster & Scale Smarter
          </span>
        </motion.h1>

        {/* Sub-headline - Value proposition */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          Technical Consultant & Engineering Manager with{" "}
          {experience.totalYearsDisplay}+ years designing scalable
          architectures and leading high-performing teams. From strategy to
          delivery — I turn your tech challenges into competitive advantages.
        </motion.p>

        {/* Trust Points */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10 text-sm text-muted"
        >
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            AWS & Cloud Expert
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            Agile & DevOps
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            ISO 27001/9001
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-400" />
            30+ Engineers Managed
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap"
        >
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Sparkles size={20} />}
            onClick={() => handleScroll("#services")}
            className="animate-pulse-glow"
          >
            Book Free Consultation
          </Button>
          <Button
            variant="outline"
            size="lg"
            leftIcon={<Briefcase size={20} />}
            onClick={() => handleScroll("#experience")}
          >
            View My Experience
          </Button>
          <Button
            variant="ghost"
            size="lg"
            leftIcon={<MessageSquare size={20} />}
            onClick={() => handleScroll("#services")}
          >
            Explore Consulting Services
          </Button>
        </motion.div>

        {/* Free Consult Details */}
        <motion.div
          variants={itemVariants}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border text-sm text-muted"
        >
          <Sparkles size={14} className="text-accent" />
          <span>
            <span className="text-foreground font-medium">First consultation is free</span>
            {" "}— 30 min strategy call, no strings attached
          </span>
        </motion.div>

        {/* Download Resume */}
        <motion.div variants={itemVariants} className="mt-4">
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
          {/* Projects Delivered */}
          <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50 hover:border-accent/30 transition-colors">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              30+
            </div>
            <div className="text-sm text-muted">
              Engineers Managed
            </div>
          </div>
          {/* Years in Tech - Dynamic */}
          <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50 hover:border-accent/30 transition-colors">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {experience.totalYearsDisplay}
            </div>
            <div className="text-sm text-muted">Years in Tech</div>
          </div>
          {/* Efficiency Boost */}
          <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50 hover:border-accent/30 transition-colors">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              30%
            </div>
            <div className="text-sm text-muted">Efficiency Boost</div>
          </div>
          {/* Client Satisfaction */}
          <div className="text-center p-4 rounded-xl bg-card/30 border border-border/50 hover:border-accent/30 transition-colors">
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              ISO
            </div>
            <div className="text-sm text-muted">27001/9001</div>
          </div>
        </motion.div>

        {/* SEO: Hidden semantic content for search engines */}
        <div className="sr-only" aria-hidden="false">
          <h2>Technical Consultant, Engineering Manager &amp; Software Architect Portfolio</h2>
          <p>
            Thanaphat North (ฐานพัฒน์) — Technical Consultant and Engineering Manager
            specializing in scalable architecture design, web &amp; mobile app development,
            Agile transformation, and end-to-end technical advisory. Founder of
            JongQue.com (จองคิว / ระบบจองคิวออนไลน์ / online booking &amp; queue management system),
            BuildYourThinks.com (startup ideas platform), and Visibr.com (tech blog).
            Available for consulting engagements, fractional CTO roles, and technical
            advisory in Thailand and worldwide. Portfolio of ventures, blog, and projects.
          </p>
        </div>

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

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Heart, BarChart3, Cpu } from "lucide-react";
import { philosophyPillars } from "@/lib/constants";

const iconMap = {
  0: Heart,
  1: BarChart3,
  2: Cpu,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Quote */}
        <motion.div
          style={{ opacity }}
          className="text-center mb-16 md:mb-24"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-accent text-sm uppercase tracking-widest mb-4"
          >
            Management Philosophy
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            The Scale-Up Mindset
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed"
          >
            &ldquo;Great engineering teams are built on trust, clarity, and
            continuous improvement. Technology is the enabler, but people are
            the multiplier.&rdquo;
          </motion.p>
        </motion.div>

        {/* Three Pillars */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {philosophyPillars.map((pillar, index) => {
            const Icon = iconMap[index as keyof typeof iconMap];

            return (
              <motion.div
                key={pillar.title}
                variants={itemVariants}
                className="text-center"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center"
                >
                  <Icon className="w-8 h-8 text-accent" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-muted leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Decorative Quote Marks */}
        <div className="absolute top-20 left-10 text-9xl text-accent/5 font-serif select-none hidden lg:block">
          &ldquo;
        </div>
        <div className="absolute bottom-20 right-10 text-9xl text-accent/5 font-serif select-none hidden lg:block">
          &rdquo;
        </div>
      </div>
    </section>
  );
}

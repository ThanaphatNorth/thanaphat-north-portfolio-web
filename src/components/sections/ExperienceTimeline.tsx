"use client";

import { motion, Variants } from "framer-motion";
import { Building2, Calendar, CheckCircle2, Download } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { experiences, siteConfig } from "@/lib/constants";

const timelineVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

const lineVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
};

export function ExperienceTimeline() {
  return (
    <SectionWrapper id="experience">
      <SectionHeader
        title="Professional Journey"
        subtitle="A timeline of growth, leadership, and technical excellence"
      />

      <motion.div
        variants={timelineVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative max-w-4xl mx-auto"
      >
        {/* Timeline Line */}
        <motion.div
          variants={lineVariants}
          className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent origin-top"
          style={{ transform: "translateX(-50%)" }}
        />

        {experiences.map((experience, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={`${experience.company}-${experience.role}-${index}`}
              variants={itemVariants}
              className={`relative flex flex-col md:flex-row items-start gap-8 mb-12 last:mb-0 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 -translate-x-1/2 translate-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  className="w-4 h-4 rounded-full bg-accent border-4 border-background"
                />
              </div>

              {/* Content */}
              <div
                className={`w-full md:w-[calc(50%-2rem)] ${
                  isEven ? "md:pr-8" : "md:pl-8"
                } pl-8 md:pl-0`}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-accent/50 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-accent" />
                        <h3 className="text-xl font-bold text-foreground">
                          {experience.company}
                        </h3>
                      </div>
                      <p className="text-accent font-medium">
                        {experience.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted bg-card-hover px-3 py-1 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {experience.period}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted mb-4 leading-relaxed">
                    {experience.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {experience.highlights.map((highlight, hIndex) => (
                      <motion.li
                        key={hIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * hIndex }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block w-[calc(50%-2rem)]" />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Download Resume CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-muted mb-4">
          Want to see more details about my experience?
        </p>
        <a href={siteConfig.resumeUrl} download="Thanaphat-Chirutpadathorn-Resume.pdf">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Download size={20} />}
          >
            Download Full Resume
          </Button>
        </a>
      </motion.div>
    </SectionWrapper>
  );
}

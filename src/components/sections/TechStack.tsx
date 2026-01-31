"use client";

import { motion, Variants } from "framer-motion";
import { Cloud, Monitor, Server, Database } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { techStack } from "@/lib/constants";

const categoryIcons = {
  cloud: Cloud,
  frontend: Monitor,
  backend: Server,
  database: Database,
};

const categoryLabels = {
  cloud: "Cloud & DevOps",
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

// SVG Icons for technologies
const TechIcon = ({ name }: { name: string }) => {
  const iconClass = "w-8 h-8 md:w-10 md:h-10";
  
  switch (name.toLowerCase()) {
    case "aws":
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="currentColor">
          <path d="M18.9 33.4c0 .8.1 1.4.3 1.9.2.5.5.9.9 1.4.1.2.2.3.2.5 0 .2-.1.4-.4.6l-1.3.9c-.2.1-.4.2-.5.2-.2 0-.4-.1-.6-.3-.3-.3-.5-.6-.7-1-.2-.4-.4-.8-.6-1.3-1.5 1.8-3.4 2.7-5.7 2.7-1.6 0-2.9-.5-3.9-1.4-1-.9-1.5-2.2-1.5-3.8 0-1.7.6-3.1 1.8-4.1 1.2-1 2.8-1.5 4.8-1.5.7 0 1.4 0 2.1.1.7.1 1.5.2 2.3.4v-1.5c0-1.5-.3-2.5-.9-3.2-.6-.6-1.7-.9-3.2-.9-.7 0-1.4.1-2.1.3-.7.2-1.4.4-2.1.7-.3.1-.5.2-.7.3-.2 0-.3.1-.4.1-.3 0-.5-.2-.5-.7v-1c0-.4.1-.6.3-.8.2-.2.5-.3.9-.5.7-.3 1.5-.6 2.4-.8.9-.2 1.9-.3 2.9-.3 2.2 0 3.8.5 4.8 1.5 1 1 1.5 2.5 1.5 4.6v6.1h.1zM12 36c.7 0 1.4-.1 2.1-.4.7-.3 1.4-.7 2-1.3.4-.4.6-.9.8-1.4.1-.5.2-1.2.2-2v-1c-.6-.1-1.2-.2-1.8-.3-.6-.1-1.2-.1-1.8-.1-1.3 0-2.3.3-2.9.8-.6.5-.9 1.3-.9 2.3 0 .9.2 1.6.7 2.1.4.6 1 .8 1.8.8l-.2.5zm13.2 2c-.4 0-.7-.1-.9-.3-.2-.2-.4-.5-.5-1l-5.8-19.1c-.1-.3-.2-.6-.2-.8 0-.3.2-.5.5-.5h2.1c.4 0 .7.1.9.3.2.2.3.5.4 1l4.1 16.2 3.8-16.2c.1-.5.2-.8.4-1 .2-.2.5-.3.9-.3h1.7c.4 0 .7.1.9.3.2.2.4.5.4 1l3.9 16.4 4.3-16.4c.1-.5.2-.8.4-1 .2-.2.5-.3.9-.3h2c.3 0 .6.2.6.5 0 .1 0 .2-.1.4 0 .1-.1.3-.2.5l-5.9 19.1c-.1.5-.3.8-.5 1-.2.2-.5.3-.9.3h-1.8c-.4 0-.7-.1-.9-.3-.2-.2-.4-.5-.4-1l-3.8-15.8-3.8 15.7c-.1.5-.2.8-.4 1-.2.2-.5.3-.9.3h-1.8l.1.2zm26.3.6c-1 0-2-.1-2.9-.4-.9-.3-1.6-.6-2-.9-.2-.2-.4-.4-.5-.6 0-.2-.1-.3-.1-.5v-1.1c0-.5.2-.7.5-.7.1 0 .3 0 .4.1.1.1.3.1.6.3.8.4 1.6.6 2.5.8.9.2 1.7.3 2.6.3 1.4 0 2.4-.2 3.2-.7.7-.5 1.1-1.2 1.1-2.1 0-.6-.2-1.1-.6-1.5-.4-.4-1.2-.8-2.3-1.1l-3.3-1c-1.7-.5-2.9-1.3-3.7-2.3-.8-1-1.2-2.1-1.2-3.4 0-1 .2-1.8.6-2.6.4-.7 1-1.4 1.7-1.9.7-.5 1.5-.9 2.4-1.2 1-.3 2-.4 3.1-.4.5 0 1.1 0 1.6.1.6.1 1.1.2 1.6.3.5.1 1 .3 1.4.4.4.2.8.3 1 .5.3.2.6.4.7.6.1.2.2.5.2.8v1c0 .5-.2.7-.5.7-.2 0-.5-.1-.9-.3-1.4-.6-3-.9-4.7-.9-1.2 0-2.2.2-2.9.6-.7.4-1 1.1-1 2 0 .6.2 1.2.7 1.6.5.4 1.3.8 2.6 1.2l3.2 1c1.6.5 2.8 1.2 3.5 2.2.7.9 1.1 2 1.1 3.3 0 1-.2 1.9-.6 2.7-.4.8-1 1.5-1.8 2.1-.8.6-1.7 1-2.8 1.3-1.2.4-2.4.5-3.7.5l-.1.1z" />
        </svg>
      );
    case "docker":
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="currentColor">
          <path d="M62.5 24.3c-.2-.2-1.8-1.2-5.3-1.2-.9 0-1.8.1-2.7.3-.5-3.6-3.5-5.4-3.6-5.5l-.7-.4-.5.6c-.6.8-1.1 1.7-1.4 2.6-.6 1.8-.9 3.8-.4 5.6-1.7.9-4.5 1.2-5.1 1.2H2.6c-.6 0-1.1.5-1.1 1.1-.1 3.4.5 6.8 1.9 9.9 1.5 3.3 3.7 5.7 6.4 7.2 3.1 1.7 8.1 2.6 13.8 2.6 2.6 0 5.2-.2 7.7-.7 3.5-.6 6.8-1.8 9.8-3.6 2.5-1.5 4.7-3.4 6.5-5.7 3-3.8 4.8-8.1 6.1-12.1h.5c3.4 0 5.5-1.4 6.6-2.5.8-.7 1.4-1.6 1.8-2.6l.2-.6-.3-.2zM7.5 28.4h5.3c.3 0 .5-.2.5-.5v-4.7c0-.3-.2-.5-.5-.5H7.5c-.3 0-.5.2-.5.5v4.7c0 .3.2.5.5.5zm7.6 0h5.3c.3 0 .5-.2.5-.5v-4.7c0-.3-.2-.5-.5-.5h-5.3c-.3 0-.5.2-.5.5v4.7c0 .3.2.5.5.5zm7.8 0h5.3c.3 0 .5-.2.5-.5v-4.7c0-.3-.2-.5-.5-.5h-5.3c-.3 0-.5.2-.5.5v4.7c0 .3.2.5.5.5zm7.8 0h5.3c.3 0 .5-.2.5-.5v-4.7c0-.3-.2-.5-.5-.5h-5.3c-.3 0-.5.2-.5.5v4.7c0 .3.2.5.5.5zm-15.6-7h5.3c.3 0 .5-.2.5-.5v-4.7c0-.3-.2-.5-.5-.5h-5.3c-.3 0-.5.2-.5.5v4.7c0 .3.2.5.5.5zm7.8 0h5.3c.3 0 .5-.2.5-.5v-4.7c0-.3-.2-.5-.5-.5h-5.3c-.3 0-.5.2-.5.5v4.7c0 .3.2.5.5.5zm7.8 0h5.3c.3 0 .5-.2.5-.5v-4.7c0-.3-.2-.5-.5-.5h-5.3c-.3 0-.5.2-.5.5v4.7c0 .3.2.5.5.5zm0-7h5.3c.3 0 .5-.2.5-.5V9.2c0-.3-.2-.5-.5-.5h-5.3c-.3 0-.5.2-.5.5v4.7c0 .3.2.5.5.5zm7.8 14h5.3c.3 0 .5-.2.5-.5v-4.7c0-.3-.2-.5-.5-.5h-5.3c-.3 0-.5.2-.5.5v4.7c0 .3.2.5.5.5z" />
        </svg>
      );
    case "kubernetes":
      return (
        <svg className={iconClass} viewBox="0 0 64 64" fill="currentColor">
          <path d="M32 4c-.7 0-1.3.2-1.9.5L7.9 16.8c-1.2.7-2 2-2 3.4v25.6c0 1.4.8 2.7 2 3.4l22.2 12.3c.6.3 1.2.5 1.9.5s1.3-.2 1.9-.5l22.2-12.3c1.2-.7 2-2 2-3.4V20.2c0-1.4-.8-2.7-2-3.4L33.9 4.5c-.6-.3-1.2-.5-1.9-.5zm0 6l17.2 9.5v4.8L38.7 30l-5-2.9v-8.8c1.4-.4 2.4-1.7 2.4-3.2 0-1.9-1.5-3.4-3.4-3.4s-3.4 1.5-3.4 3.4c0 1.5 1 2.8 2.4 3.2v8.8L26.3 30l-10.5-5.8v-4.8L32 10zm-17.2 15l10.5 5.8v8.8c-1.4.4-2.4 1.7-2.4 3.2 0 1.9 1.5 3.4 3.4 3.4 1.9 0 3.4-1.5 3.4-3.4 0-1.5-1-2.8-2.4-3.2v-8.8l5.4-3 5.4 3v8.8c-1.4.4-2.4 1.7-2.4 3.2 0 1.9 1.5 3.4 3.4 3.4 1.9 0 3.4-1.5 3.4-3.4 0-1.5-1-2.8-2.4-3.2v-8.8l10.5-5.8v13.8L32 54l-17.2-9.5V25z" />
        </svg>
      );
    default:
      return (
        <div className={`${iconClass} flex items-center justify-center font-bold text-lg`}>
          {name.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};

export function TechStack() {
  const categories = Object.keys(techStack) as Array<keyof typeof techStack>;

  return (
    <SectionWrapper id="tech-stack" className="bg-card/30">
      <SectionHeader
        title="Technical Stack"
        subtitle="Technologies and tools I use to build scalable, reliable systems"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, categoryIndex) => {
          const CategoryIcon = categoryIcons[category];
          const label = categoryLabels[category];
          const techs = techStack[category];

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <CategoryIcon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {label}
                </h3>
              </div>

              {/* Tech Items */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {techs.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    variants={itemVariants}
                    whileHover={{ x: 4, scale: 1.02 }}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-background/50 hover:bg-accent/10 transition-colors duration-300 cursor-default"
                  >
                    <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center text-muted group-hover:text-accent transition-colors duration-300 grayscale group-hover:grayscale-0">
                      <TechIcon name={tech.icon} />
                    </div>
                    <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-muted">
          ...and many more tools selected based on project requirements and team
          expertise.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}

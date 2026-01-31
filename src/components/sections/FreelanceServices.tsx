"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Lightbulb, Target, Code, Users, ArrowRight, CheckCircle, MessageSquare } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { ContactFormModal } from "@/components/ui/ContactFormModal";
import { services } from "@/lib/constants";

const iconMap = {
  Lightbulb,
  Target,
  Code,
  Users,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export function FreelanceServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");

  const handleGetInTouch = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setIsModalOpen(true);
  };

  const handleScheduleConsultation = () => {
    setSelectedService("");
    setIsModalOpen(true);
  };

  return (
    <>
      <SectionWrapper id="services" className="bg-card/30">
        <SectionHeader
          title="Freelance Services"
          subtitle="Professional consulting and development services tailored to your needs"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 overflow-hidden"
              >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, fIndex) => (
                      <motion.li
                        key={fIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * fIndex }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-foreground/80 text-sm">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    variant="outline"
                    size="md"
                    rightIcon={
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    }
                    className="w-full"
                    onClick={() => handleGetInTouch(service.title)}
                  >
                    Get in Touch
                  </Button>
                </div>

                {/* Decorative Number */}
                <div className="absolute top-4 right-4 text-8xl font-bold text-border/30 select-none">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-muted mb-6">
            Not sure which service fits your needs? Let&apos;s discuss your
            requirements.
          </p>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<MessageSquare size={20} />}
            onClick={handleScheduleConsultation}
          >
            Schedule a Free Consultation
          </Button>
        </motion.div>
      </SectionWrapper>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prefilledService={selectedService}
      />
    </>
  );
}

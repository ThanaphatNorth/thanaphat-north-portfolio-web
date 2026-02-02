"use client";

import { useState, useTransition, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  company: "",
  service: "",
  message: "",
};

async function submitContactForm(data: ContactFormData) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to submit form");
  }

  return response.json();
}

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledService?: string;
}

type FormStatus = "idle" | "success" | "error";

export function ContactFormModal({
  isOpen,
  onClose,
  prefilledService,
}: ContactFormModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    ...initialFormData,
    service: prefilledService || "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Use useTransition for better loading state management
  const [isPending, startTransition] = useTransition();

  // Stable callback using functional setState
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      try {
        await submitContactForm(formData);
        setStatus("success");
        // Reset form after success
        setTimeout(() => {
          setFormData(initialFormData);
        }, 2000);
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    });
  };

  const handleClose = useCallback(() => {
    if (!isPending) {
      onClose();
      // Reset status after modal closes
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 300);
    }
  }, [isPending, onClose]);

  const inputClasses =
    "w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                Get in Touch
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background"
                disabled={isPending}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-muted">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className={inputClasses}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className={inputClasses}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company (optional)"
                      className={inputClasses}
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={cn(inputClasses, "cursor-pointer")}
                    >
                      <option value="">Select a service (optional)</option>
                      <option value="Startup & Product Technical Advisor">
                        Startup & Product Technical Advisor
                      </option>
                      <option value="Agile & Team Performance Consultant">
                        Agile & Team Performance Consultant
                      </option>
                      <option value="Full-Cycle Development">
                        Full-Cycle Development
                      </option>
                      <option value="Tech Leadership Coaching">
                        Tech Leadership Coaching
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell me about your project or inquiry..."
                      className={cn(inputClasses, "resize-none")}
                    />
                  </div>

                  {/* Error Message */}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                    >
                      <AlertCircle size={16} />
                      {errorMessage || "Failed to send message. Please try again."}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isPending}
                    leftIcon={
                      isPending ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <Send size={20} />
                      )
                    }
                  >
                    {isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

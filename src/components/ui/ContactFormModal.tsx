"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { cn } from "@/lib/utils";
import { services } from "@/lib/constants";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  /** honeypot — must stay empty */
  website: string;
}

async function submitContactForm(data: ContactFormData) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
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

const inputClasses =
  "w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors";

/**
 * The parent remounts this component per open (see ContactProvider), so
 * `prefilledService` is always honoured and the form starts clean.
 */
export function ContactFormModal({ isOpen, onClose, prefilledService }: ContactFormModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    service: prefilledService || "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    startTransition(async () => {
      try {
        await submitContactForm(formData);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
      }
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      dismissible={!isPending}
      title={status === "success" ? "Message sent" : "Let's talk"}
      testId="contact-dialog"
    >
      <div className="p-6">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
            role="status"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 grid place-items-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" aria-hidden="true" />
            </div>
            <p className="font-display text-xl font-bold text-foreground mb-2">Thanks — got it.</p>
            <p className="text-muted">I&apos;ll get back to you within 1–2 business days.</p>
            <Button variant="outline" className="mt-6" onClick={onClose}>
              Close
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
            <p className="label-mono">Free 30-min strategy call · no strings attached</p>

            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-2">
                Name <span className="text-accent">*</span>
              </label>
              <input id="contact-name" name="name" type="text" required maxLength={100} autoComplete="name"
                value={formData.name} onChange={handleChange} placeholder="Your name" className={inputClasses} />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-accent">*</span>
              </label>
              <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email"
                value={formData.email} onChange={handleChange} placeholder="you@company.com" className={inputClasses} />
            </div>

            <div>
              <label htmlFor="contact-company" className="block text-sm font-medium text-foreground mb-2">
                Company
              </label>
              <input id="contact-company" name="company" type="text" maxLength={120} autoComplete="organization"
                value={formData.company} onChange={handleChange} placeholder="Optional" className={inputClasses} />
            </div>

            <div>
              <label htmlFor="contact-service" className="block text-sm font-medium text-foreground mb-2">
                Interested in
              </label>
              <select id="contact-service" name="service" value={formData.service} onChange={handleChange}
                className={cn(inputClasses, "cursor-pointer")}>
                <option value="">Select a service (optional)</option>
                {services.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-2">
                Message <span className="text-accent">*</span>
              </label>
              <textarea id="contact-message" name="message" required rows={4} maxLength={5000}
                value={formData.message} onChange={handleChange}
                placeholder="What are you building, and where does it hurt?" className={cn(inputClasses, "resize-none")} />
            </div>

            {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off"
                value={formData.website} onChange={handleChange} />
            </div>

            {status === "error" && (
              <div role="alert" className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                <AlertCircle size={16} aria-hidden="true" />
                {errorMessage || "Failed to send message. Please try again."}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}
              leftIcon={isPending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}>
              {isPending ? "Sending..." : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </Dialog>
  );
}

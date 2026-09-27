"use client";

import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Rocket, Sparkles, BookOpen, Zap, Globe, Star } from "lucide-react";

export const ventureIconOptions = [
  { value: "Rocket", label: "Rocket", icon: Rocket },
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
  { value: "BookOpen", label: "Book", icon: BookOpen },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Star", label: "Star", icon: Star },
];

export const ventureStatusOptions = ["Live", "Beta", "Coming Soon"];

export interface VentureFormValues {
  name: string;
  tagline: string;
  description: string;
  url: string;
  status: string;
  icon: string;
  display_order: number;
  visible: boolean;
}

// Defaults used when creating a new venture.
export const defaultVentureFormValues: VentureFormValues = {
  name: "",
  tagline: "",
  description: "",
  url: "",
  status: "Coming Soon",
  icon: "Rocket",
  display_order: 0,
  visible: true,
};

interface VentureFormProps {
  values: VentureFormValues;
  onChange: Dispatch<SetStateAction<VentureFormValues>>;
}

export function VentureForm({ values, onChange }: VentureFormProps) {
  const SelectedIcon =
    ventureIconOptions.find((i) => i.value === values.icon)?.icon || Rocket;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Name *
        </label>
        <input
          type="text"
          value={values.name}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="e.g., JongQue.com"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors text-lg"
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Tagline *
        </label>
        <input
          type="text"
          value={values.tagline}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, tagline: e.target.value }))
          }
          placeholder="e.g., SaaS for Resource & Queue Management"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <textarea
          value={values.description}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="A comprehensive description of your venture..."
          rows={4}
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          URL *
        </label>
        <input
          type="url"
          value={values.url}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, url: e.target.value }))
          }
          placeholder="https://example.com"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors font-mono text-sm"
        />
      </div>

      {/* Status & Icon Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Status
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
          >
            {ventureStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Icon */}
        <div>
          <label
            htmlFor="icon"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Icon
          </label>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <SelectedIcon className="w-6 h-6 text-accent" />
            </div>
            <select
              id="icon"
              value={values.icon}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, icon: e.target.value }))
              }
              className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
            >
              {ventureIconOptions.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Display Order */}
      <div>
        <label
          htmlFor="display_order"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Display Order
        </label>
        <input
          id="display_order"
          type="number"
          min="0"
          value={values.display_order}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              display_order: parseInt(e.target.value) || 0,
            }))
          }
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent transition-colors"
        />
        <p className="text-xs text-muted mt-1">Lower numbers appear first</p>
      </div>

      {/* Preview Card */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Preview
        </label>
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <SelectedIcon className="w-6 h-6 text-accent" />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                values.status === "Live"
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : values.status === "Beta"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/30"
              }`}
            >
              {values.status}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {values.name || "Venture Name"}
          </h3>
          <p className="text-accent text-sm font-medium mb-3">
            {values.tagline || "Your tagline here"}
          </p>
          <p className="text-muted text-sm leading-relaxed">
            {values.description || "Your description here..."}
          </p>
        </div>
      </div>
    </motion.form>
  );
}

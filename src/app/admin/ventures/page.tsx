"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  Rocket,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Venture } from "@/lib/supabase";

const statusColors: Record<string, string> = {
  Live: "bg-green-500/20 text-green-400",
  Beta: "bg-yellow-500/20 text-yellow-400",
  "Coming Soon": "bg-blue-500/20 text-blue-400",
};

export default function AdminVenturesPage() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");

  const supabase = createSupabaseBrowserClient();

  const fetchVentures = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from("ventures")
      .select("*")
      .order("display_order", { ascending: true });

    if (filter === "visible") {
      query = query.eq("visible", true);
    } else if (filter === "hidden") {
      query = query.eq("visible", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching ventures:", error);
    } else {
      setVentures(data || []);
    }
    setIsLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    fetchVentures();
  }, [fetchVentures]);

  const handleToggleVisible = async (venture: Venture) => {
    const newStatus = !venture.visible;
    const { error } = await supabase
      .from("ventures")
      .update({ visible: newStatus })
      .eq("id", venture.id);

    if (!error) {
      setVentures((prev) =>
        prev.map((v) =>
          v.id === venture.id ? { ...v, visible: newStatus } : v
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venture?")) return;

    setIsDeleting(id);
    const { error } = await supabase.from("ventures").delete().eq("id", id);

    if (!error) {
      setVentures((prev) => prev.filter((v) => v.id !== id));
    }
    setIsDeleting(null);
  };

  const visibleCount = ventures.filter((v) => v.visible).length;
  const hiddenCount = ventures.filter((v) => !v.visible).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">Ventures</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
              {visibleCount} visible
            </span>
            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full">
              {hiddenCount} hidden
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchVentures}
            className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card border border-border"
            title="Refresh"
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
          <Link
            href="/admin/ventures/new"
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            New Venture
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {(["all", "visible", "hidden"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-accent text-white"
                : "bg-card text-muted hover:text-foreground border border-border"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Ventures List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : ventures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted bg-card border border-border rounded-2xl">
          <Rocket size={48} className="mb-4" />
          <p className="mb-4">No ventures found</p>
          <Link
            href="/admin/ventures/new"
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            Create your first venture
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {ventures.map((venture) => (
              <motion.div
                key={venture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-muted cursor-move">
                      <GripVertical size={18} />
                      <span className="text-xs font-mono">#{venture.display_order}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg font-semibold text-foreground truncate">
                          {venture.name}
                        </h2>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            statusColors[venture.status] || "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {venture.status}
                        </span>
                        {!venture.visible && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-accent text-sm font-medium mb-1">
                        {venture.tagline}
                      </p>
                      <p className="text-muted text-sm mb-2 line-clamp-2">
                        {venture.description}
                      </p>
                      <a
                        href={venture.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        {venture.url}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleVisible(venture)}
                      className={`p-2 rounded-lg transition-colors ${
                        venture.visible
                          ? "text-green-400 hover:bg-green-500/10"
                          : "text-muted hover:text-foreground hover:bg-background"
                      }`}
                      title={venture.visible ? "Hide" : "Show"}
                    >
                      {venture.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <Link
                      href={`/admin/ventures/${venture.id}`}
                      className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(venture.id)}
                      disabled={isDeleting === venture.id}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                      title="Delete"
                    >
                      {isDeleting === venture.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

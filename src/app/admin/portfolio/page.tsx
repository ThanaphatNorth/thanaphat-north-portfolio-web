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
  FolderOpen,
  ExternalLink,
  Star,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Portfolio } from "@/lib/supabase";

const typeColors: Record<string, string> = {
  "Web App": "bg-blue-500/20 text-blue-400",
  Mobile: "bg-green-500/20 text-green-400",
  Design: "bg-purple-500/20 text-purple-400",
  "E-commerce": "bg-orange-500/20 text-orange-400",
  SaaS: "bg-cyan-500/20 text-cyan-400",
  API: "bg-indigo-500/20 text-indigo-400",
  Dashboard: "bg-teal-500/20 text-teal-400",
  Library: "bg-emerald-500/20 text-emerald-400",
  Training: "bg-rose-500/20 text-rose-400",
  Consulting: "bg-pink-500/20 text-pink-400",
  Research: "bg-slate-500/20 text-slate-400",
  Education: "bg-blue-500/20 text-blue-400",
  Other: "bg-gray-500/20 text-gray-400",
};

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">(
    "all"
  );

  const supabase = createSupabaseBrowserClient();

  const fetchPortfolios = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from("portfolios")
      .select("*")
      .order("display_order", { ascending: true });

    if (filter === "visible") {
      query = query.eq("visible", true);
    } else if (filter === "hidden") {
      query = query.eq("visible", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching portfolios:", error);
    } else {
      setPortfolios(data || []);
    }
    setIsLoading(false);
  }, [supabase, filter]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const handleToggleVisible = async (portfolio: Portfolio) => {
    const newStatus = !portfolio.visible;
    const { error } = await supabase
      .from("portfolios")
      .update({ visible: newStatus })
      .eq("id", portfolio.id);

    if (!error) {
      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolio.id ? { ...p, visible: newStatus } : p
        )
      );
    }
  };

  const handleToggleFeatured = async (portfolio: Portfolio) => {
    const newStatus = !portfolio.featured;
    const { error } = await supabase
      .from("portfolios")
      .update({ featured: newStatus })
      .eq("id", portfolio.id);

    if (!error) {
      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolio.id ? { ...p, featured: newStatus } : p
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Are you sure you want to delete this portfolio item?")
    )
      return;

    setIsDeleting(id);
    const { error } = await supabase
      .from("portfolios")
      .delete()
      .eq("id", id);

    if (!error) {
      setPortfolios((prev) => prev.filter((p) => p.id !== id));
    }
    setIsDeleting(null);
  };

  const visibleCount = portfolios.filter((p) => p.visible).length;
  const hiddenCount = portfolios.filter((p) => !p.visible).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">
            Portfolio
          </h1>
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
            onClick={fetchPortfolios}
            className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card border border-border"
            title="Refresh"
          >
            <RefreshCw
              size={20}
              className={isLoading ? "animate-spin" : ""}
            />
          </button>
          <Link
            href="/admin/portfolio/new"
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            New Project
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

      {/* Portfolio List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : portfolios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted bg-card border border-border rounded-2xl">
          <FolderOpen size={48} className="mb-4" />
          <p className="mb-4">No portfolio items found</p>
          <Link
            href="/admin/portfolio/new"
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add your first project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {portfolios.map((portfolio) => (
              <motion.div
                key={portfolio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-xl p-4 md:p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="hidden sm:block flex-shrink-0">
                    {portfolio.cover_image ? (
                      <img
                        src={portfolio.cover_image}
                        alt={portfolio.title}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
                        <FolderOpen
                          size={24}
                          className="text-accent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <div className="flex items-center gap-2 text-muted">
                            <GripVertical size={16} />
                            <span className="text-xs font-mono">
                              #{portfolio.display_order}
                            </span>
                          </div>
                          <h2 className="text-lg font-semibold text-foreground truncate">
                            {portfolio.title}
                          </h2>
                          {(portfolio.category || "")
                            .split(", ")
                            .filter(Boolean)
                            .map((type) => (
                              <span
                                key={type}
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  typeColors[type.trim()] ||
                                  "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {type.trim()}
                              </span>
                            ))}
                          {portfolio.featured && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                              Featured
                            </span>
                          )}
                          {!portfolio.visible && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-muted text-sm mb-2 line-clamp-2">
                          {portfolio.description}
                        </p>
                        <div className="flex items-center gap-3 overflow-hidden">
                          {portfolio.technologies.length > 0 && (
                            <span className="text-xs text-muted truncate">
                              {portfolio.technologies.join(", ")}
                            </span>
                          )}
                          {portfolio.project_url && (
                            <a
                              href={portfolio.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                            >
                              View Project
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() =>
                            handleToggleFeatured(portfolio)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            portfolio.featured
                              ? "text-yellow-400 hover:bg-yellow-500/10"
                              : "text-muted hover:text-foreground hover:bg-background"
                          }`}
                          title={
                            portfolio.featured
                              ? "Unfeature"
                              : "Feature"
                          }
                        >
                          <Star
                            size={18}
                            fill={
                              portfolio.featured
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleVisible(portfolio)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            portfolio.visible
                              ? "text-green-400 hover:bg-green-500/10"
                              : "text-muted hover:text-foreground hover:bg-background"
                          }`}
                          title={portfolio.visible ? "Hide" : "Show"}
                        >
                          {portfolio.visible ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                        <Link
                          href={`/admin/portfolio/${portfolio.id}`}
                          className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-background"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(portfolio.id)}
                          disabled={isDeleting === portfolio.id}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                          title="Delete"
                        >
                          {isDeleting === portfolio.id ? (
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>
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

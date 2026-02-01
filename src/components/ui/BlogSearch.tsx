"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search, X, Calendar, Clock, Star, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  cover_image: string | null;
  tags: string[];
  read_time: number;
  published_at: string | null;
  featured: boolean;
}

interface BlogSearchProps {
  posts: BlogPost[];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Debounce hook for performance
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function BlogSearch({ posts }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 150);

  // Memoized search function for performance
  const filteredPosts = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return posts;
    }

    const query = debouncedQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/);

    return posts.filter((post) => {
      // Create searchable text combining all fields
      const searchableText = [
        post.title,
        post.excerpt || "",
        post.tags?.join(" ") || "",
      ]
        .join(" ")
        .toLowerCase();

      // Check if all query words match
      return queryWords.every((word) => searchableText.includes(word));
    });
  }, [posts, debouncedQuery]);

  // Separate featured and regular posts
  const featuredPosts = useMemo(
    () => filteredPosts.filter((p) => p.featured),
    [filteredPosts]
  );
  const regularPosts = useMemo(
    () => filteredPosts.filter((p) => !p.featured),
    [filteredPosts]
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-8">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, content, or tags..."
            className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-xl text-foreground placeholder-muted focus:outline-none focus:border-accent transition-colors text-lg"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {debouncedQuery && (
          <p className="text-sm text-muted mt-2">
            Found {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            {debouncedQuery && ` matching "${debouncedQuery}"`}
          </p>
        )}
      </div>

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Search size={48} className="mx-auto mb-4 text-muted" />
          <p className="text-muted text-lg mb-2">No posts found</p>
          <p className="text-muted text-sm">
            Try searching with different keywords
          </p>
        </div>
      ) : (
        <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Star size={20} className="text-yellow-400" />
                Featured
              </h2>
              <div className="grid gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                      {post.cover_image && (
                        <div className="bg-background overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-auto max-h-[300px] object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-muted mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(post.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {post.read_time} min read
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                          <HighlightText text={post.title} query={debouncedQuery} />
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted mb-4 line-clamp-2">
                            <HighlightText text={post.excerpt} query={debouncedQuery} />
                          </p>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-background text-muted rounded-full"
                              >
                                <HighlightText text={tag} query={debouncedQuery} />
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {featuredPosts.length > 0 ? "All Posts" : "Latest Posts"}
              </h2>
              <div className="grid gap-4">
                {regularPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 text-sm text-muted mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {post.read_time} min read
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                            <HighlightText text={post.title} query={debouncedQuery} />
                          </h3>
                          {post.excerpt && (
                            <p className="text-muted text-sm line-clamp-2 mb-3">
                              <HighlightText text={post.excerpt} query={debouncedQuery} />
                            </p>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs bg-background text-muted rounded-full"
                                >
                                  <HighlightText text={tag} query={debouncedQuery} />
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-xs text-muted">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <ArrowRight
                          size={20}
                          className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-1"
                        />
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// Component to highlight matching text
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = words.some(word => part.toLowerCase() === word);
        return isMatch ? (
          <mark key={i} className="bg-accent/30 text-foreground rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

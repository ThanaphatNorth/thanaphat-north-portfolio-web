import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Calendar, Clock, Tag, ArrowRight, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Thanaphat Chirutpadathorn",
  description: "Thoughts on software development, technology, and building products.",
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published: boolean;
  featured: boolean;
  tags: string[];
  read_time: number;
  published_at: string | null;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image, published, featured, tags, read_time, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data || [];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Thoughts on software development, technology, startups, and building products.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-20">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <p className="text-muted text-lg">No blog posts yet. Check back soon!</p>
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
                          <div className="aspect-2/1 overflow-hidden">
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-muted mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-background text-muted rounded-full"
                                >
                                  {tag}
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

            {/* All Posts */}
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
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-muted text-sm line-clamp-2 mb-3">
                              {post.excerpt}
                            </p>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs bg-background text-muted rounded-full"
                                >
                                  {tag}
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
          </>
        )}
      </main>
    </div>
  );
}

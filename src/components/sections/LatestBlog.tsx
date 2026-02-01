import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  read_time: number;
  published_at: string | null;
}

async function getLatestPosts(): Promise<BlogPost[]> {
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
    .select("id, title, slug, excerpt, cover_image, tags, read_time, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching latest posts:", error);
    return [];
  }

  return data || [];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function LatestBlog() {
  const posts = await getLatestPosts();

  // Don't render the section if there are no posts
  if (posts.length === 0) {
    return null;
  }

  return (
    <SectionWrapper id="blog">
      <SectionHeader
        title="Latest from the Blog"
        subtitle="Thoughts on software development, leadership, and building products"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5"
          >
            {/* Cover Image */}
            {post.cover_image ? (
              <div className="bg-background overflow-hidden flex items-center justify-center p-2">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-auto max-h-[200px] object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="aspect-video bg-linear-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-accent/30" />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted mb-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(post.published_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.read_time} min
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm text-muted line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-accent" />
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-10 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full text-foreground hover:border-accent/50 hover:text-accent transition-all duration-300 group"
        >
          View all posts
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </SectionWrapper>
  );
}

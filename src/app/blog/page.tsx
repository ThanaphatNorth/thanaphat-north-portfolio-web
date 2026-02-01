import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { BlogSearch } from "@/components/ui/BlogSearch";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software development, technology, startups, and building products.",
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: "Blog | Thanaphat Chirutpadathorn",
    description: "Thoughts on software development, technology, startups, and building products.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Thanaphat Chirutpadathorn's Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Thanaphat Chirutpadathorn",
    description: "Thoughts on software development, technology, startups, and building products.",
    images: [siteConfig.ogImage],
    creator: "@thanaphatnorth",
  },
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

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-16 px-4 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto text-center">
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

      <main className="max-w-5xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <p className="text-muted text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <BlogSearch posts={posts} />
        )}
      </main>
    </div>
  );
}

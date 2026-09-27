import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/ui/ShareButton";
import { siteConfig } from "@/lib/constants";
import { Markdown } from "@/components/content/Markdown";
import { safeJsonLd } from "@/lib/security";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published: boolean;
  featured: boolean;
  tags: string[];
  read_time: number;
  published_at: string | null;
  created_at: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
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
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on my blog.`,
    keywords: post.tags?.length ? post.tags : undefined,
    authors: [{ name: siteConfig.name }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      url: postUrl,
      siteName: siteConfig.name,
      images: post.cover_image
        ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }]
        : [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: post.published_at || undefined,
      modifiedTime: post.created_at,
      authors: [siteConfig.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image ? [post.cover_image] : [siteConfig.ogImage],
      creator: "@thanaphatnorth",
    },
  };
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  // JSON-LD Article structured data
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_image || `${siteConfig.url}${siteConfig.ogImage}`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.created_at,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    keywords: post.tags?.join(", "),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
          <ShareButton title={post.title} description={post.excerpt || undefined} />
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-[#1a1a1a] border border-border rounded-2xl p-6 md:p-10">
          {/* Header */}
          <header className="mb-10">
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-accent/10 text-accent rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-400 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} />
                {post.read_time} min read
              </span>
            </div>
          </header>

        {/* Cover Image */}
          {post.cover_image && (
            <div className="relative rounded-xl overflow-hidden mb-10 bg-background p-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS/upload URL of arbitrary host & size */}
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-contain rounded-lg"
              />
            </div>
          )}

        {/* Content */}
          <div className="max-w-none">
            <Markdown>{post.content}</Markdown>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
              >
                <ArrowLeft size={18} />
                Back to all posts
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}

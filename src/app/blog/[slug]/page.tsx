import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { ShareButton } from "@/components/ui/ShareButton";

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

  return {
    title: `${post.title} | Thanaphat Chirutpadathorn`,
    description: post.excerpt || `Read ${post.title} on my blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
      type: "article",
      publishedTime: post.published_at || undefined,
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

// Simple markdown-like rendering (for basic formatting)
function renderContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-12 mb-6">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-[#1e1e1e] border border-border rounded-lg p-4 overflow-x-auto my-6"><code class="text-sm font-mono text-gray-200">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-[#1e1e1e] px-1.5 py-0.5 rounded text-sm font-mono text-accent">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-accent hover:text-accent-hover underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-lg my-6 w-full" />')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-accent pl-4 my-4 text-gray-300 italic">$1</blockquote>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li class="ml-6 list-disc text-gray-300">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal text-gray-300">$1</li>')
    // Horizontal rule
    .replace(/^---$/gim, '<hr class="border-border my-8" />')
    // Paragraphs (wrap remaining text)
    .replace(/^(?!<[hlpbuio]|<\/|<pre|<block|<img|<hr)(.+)$/gim, '<p class="text-gray-300 leading-relaxed mb-4">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p class="text-gray-300 leading-relaxed mb-4"><\/p>/gim, '')
    // Wrap consecutive list items
    .replace(/(<li[^>]*>.*<\/li>\n?)+/gim, '<ul class="my-4">$&</ul>');
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

  const renderedContent = renderContent(post.content);

  return (
    <div className="min-h-screen bg-background">
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
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-contain rounded-lg"
              />
            </div>
          )}

        {/* Content */}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />

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

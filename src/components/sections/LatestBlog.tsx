import { unstable_rethrow } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { SectionWrapper, SectionHeader } from "@/components/ui/SectionWrapper";
import { Reveal } from "@/components/fx/Reveal";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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
  // A blog outage must never take the home page down with it.
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image, tags, read_time, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(6);
    if (error) {
      console.error("Error fetching latest posts:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    unstable_rethrow(error); // let Next handle its own dynamic-render signals
    console.error("Error fetching latest posts:", error);
    return [];
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export async function LatestBlog() {
  const posts = await getLatestPosts();
  if (posts.length === 0) return null;
  const featured = posts.slice(0, 3);

  return (
    <SectionWrapper id="blog">
      <SectionHeader
        index="07"
        eyebrow="Field notes"
        title={<>Notes from the <span className="font-serif-accent text-accent">field.</span></>}
        subtitle="Writing on engineering leadership, delivery and building products."
      />

      {/* Title marquee (decorative duplicate of the cards below) */}
      <div className="relative -mx-4 md:-mx-6 mb-14 overflow-hidden border-y border-border py-5" aria-hidden="true">
        <div className="flex w-max gap-12 [animation:marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
          {[...posts, ...posts].map((p, i) => (
            <span key={`${p.id}-${i}`} className="font-display text-2xl md:text-4xl font-semibold text-foreground/25 whitespace-nowrap">
              {p.title} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {featured.map((post, i) => (
          <Reveal key={post.id} delay={i * 0.08}>
            <Link href={`/blog/${post.slug}`} data-cursor="read" className="group block h-full rounded-2xl border border-border bg-ink-900/60 overflow-hidden hover:border-accent/60 transition-colors">
              <div className="aspect-video bg-ink overflow-hidden grid place-items-center">
                {post.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- CMS image of arbitrary host/size
                  <img src={post.cover_image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <BookOpen className="w-10 h-10 text-accent/30" aria-hidden="true" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 label-mono mb-3">
                  <span className="inline-flex items-center gap-1.5"><Calendar size={12} aria-hidden="true" />{formatDate(post.published_at)}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock size={12} aria-hidden="true" />{post.read_time} min</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                {post.excerpt && <p className="mt-2 text-sm text-muted line-clamp-3">{post.excerpt}</p>}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/blog" className="inline-flex items-center gap-2 text-foreground hover:text-accent transition-colors">
          All posts <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </SectionWrapper>
  );
}

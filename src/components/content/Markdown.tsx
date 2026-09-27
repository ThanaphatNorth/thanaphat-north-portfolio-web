import ReactMarkdown, { type Components } from "react-markdown";

// react-markdown renders no raw HTML and strips unsafe URLs (javascript:, data:)
// by default. Never add rehype-raw here: content comes from the database.
const components: Components = {
  h1: ({ children }) => (
    <h2 className="font-display text-3xl font-bold text-foreground mt-12 mb-6">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-2xl font-bold text-foreground mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display text-xl font-bold text-foreground mt-8 mb-4">{children}</h3>
  ),
  p: ({ children }) => <p className="text-foreground/80 leading-relaxed mb-4">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent underline underline-offset-4 hover:text-accent-hover"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      // eslint-disable-next-line @next/next/no-img-element -- author-supplied URLs of unknown size
      <img src={src} alt={alt ?? ""} loading="lazy" className="rounded-lg my-6 w-full" />
    ) : null,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-accent pl-4 my-4 text-foreground/70 italic">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="my-4 ml-6 list-disc space-y-1 text-foreground/80">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 ml-6 list-decimal space-y-1 text-foreground/80">{children}</ol>,
  hr: () => <hr className="border-border my-8" />,
  pre: ({ children }) => (
    <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto my-6 text-sm font-mono">
      {children}
    </pre>
  ),
  code: ({ children, className }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="bg-card px-1.5 py-0.5 rounded text-sm font-mono text-accent">{children}</code>
    ),
};

export function Markdown({ children }: { children: string }) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}

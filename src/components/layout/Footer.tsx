import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig, navLinks, coordinates } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-ink">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-3xl font-bold text-foreground">
            North<span className="text-accent">.</span>
          </p>
          <p className="mt-3 text-muted max-w-sm">
            {siteConfig.role}. Technical consultant for teams that need to ship.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: siteConfig.links.github, label: "GitHub", Icon: Github },
              { href: siteConfig.links.linkedin, label: "LinkedIn", Icon: Linkedin },
              { href: `mailto:${siteConfig.links.email}`, label: "Email", Icon: Mail },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="grid place-items-center w-10 h-10 rounded-full border border-border text-muted hover:text-accent hover:border-accent transition-colors"
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label-mono mb-4">Navigate</p>
          <ul className="space-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.isExternal ? l.href : `/${l.href}`} className="text-foreground/80 hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="label-mono mb-4">Based in</p>
          <p className="text-foreground/80">Bangkok, Thailand</p>
          <p className="label-mono mt-1">{coordinates}</p>
          <p className="mt-6 text-foreground/80">
            <a href={`mailto:${siteConfig.links.email}`} className="hover:text-accent transition-colors">
              {siteConfig.links.email}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row gap-3 justify-between text-sm text-muted">
          <p>© {year} {siteConfig.name}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

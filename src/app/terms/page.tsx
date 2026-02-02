import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for thanaphat-north.com - Guidelines for using this website and services.",
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          
          <p className="text-muted mb-6">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using thanaphat-north.com, you accept and agree to be bound by 
              these Terms of Service. If you do not agree to these terms, please do not use this website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Use of Website</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You agree to use this website only for lawful purposes and in a way that does not:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Infringe the rights of others</li>
              <li>Restrict or inhibit anyone else&apos;s use of the website</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to any systems or data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content on this website, including text, graphics, logos, and code, is the 
              property of Thanaphat Chirutpadathorn unless otherwise stated. You may not reproduce, 
              distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Blog Content</h2>
            <p className="text-gray-300 leading-relaxed">
              The blog posts and articles on this website are provided for informational purposes 
              only. While I strive for accuracy, I make no warranties about the completeness, 
              reliability, or accuracy of this information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Freelance Services</h2>
            <p className="text-gray-300 leading-relaxed">
              Information about freelance services on this website is for general reference only. 
              Specific terms and conditions for any engagement will be agreed upon separately 
              through a formal agreement or contract.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">External Links</h2>
            <p className="text-gray-300 leading-relaxed">
              This website may contain links to external websites. I am not responsible for the 
              content or privacy practices of these external sites. Visiting external links is 
              at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              This website and its content are provided &quot;as is&quot; without any warranties, 
              express or implied. I shall not be liable for any damages arising from the use 
              or inability to use this website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Indemnification</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree to indemnify and hold harmless Thanaphat Chirutpadathorn from any claims, 
              damages, or expenses arising from your use of this website or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of Thailand, 
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              I reserve the right to modify these Terms of Service at any time. Changes will be 
              effective immediately upon posting to this page. Continued use of the website 
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact me at{" "}
              <a 
                href={`mailto:${siteConfig.links.email}`}
                className="text-accent hover:text-accent-hover underline"
              >
                {siteConfig.links.email}
              </a>
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}

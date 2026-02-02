import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for thanaphat-north.com - Learn how we handle your data and protect your privacy.",
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <p className="text-muted mb-6">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to thanaphat-north.com. This Privacy Policy explains how I collect, use, 
              and protect your personal information when you visit my website. Your privacy is 
              important to me, and I am committed to protecting your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information I Collect</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              This website may collect limited information including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>
                <strong className="text-foreground">Usage Data:</strong> Information about how you 
                interact with the website, including pages visited, time spent, and referral sources.
              </li>
              <li>
                <strong className="text-foreground">Contact Information:</strong> If you contact me 
                via email, I will receive your email address and any information you choose to provide.
              </li>
              <li>
                <strong className="text-foreground">Technical Data:</strong> Browser type, device 
                information, and IP address for analytics and security purposes.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How I Use Your Information</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              I use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Improve website content and user experience</li>
              <li>Respond to inquiries and communication</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Ensure website security and prevent abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Analytics</h2>
            <p className="text-gray-300 leading-relaxed">
              This website may use cookies and similar tracking technologies to enhance your 
              browsing experience. You can control cookie preferences through your browser settings. 
              I may use third-party analytics services to understand website traffic and user behavior.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed">
              This website may use third-party services such as:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
              <li>Vercel for hosting</li>
              <li>Supabase for database services</li>
              <li>Google Fonts for typography</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              These services have their own privacy policies governing their use of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
            <p className="text-gray-300 leading-relaxed">
              I implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure, and I cannot 
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-4">
              <li>Request access to your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact me at{" "}
              <a 
                href={`mailto:${siteConfig.links.email}`}
                className="text-accent hover:text-accent-hover underline"
              >
                {siteConfig.links.email}
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              I may update this Privacy Policy from time to time. Any changes will be posted on 
              this page with an updated revision date.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    // Thai name variations
    "ฐานพัฒน์ จิรุตม์ผะดาทร",
    "ฐานพัฒน์",
    "Thanaphat Chirutpadathorn",
    "Thanaphat North",
    // Core roles
    "Engineering Manager",
    "Software Developer",
    "Software Development",
    "Tech Lead",
    "Software Architect",
    "Full-Stack Developer",
    // Thai keywords
    "พัฒนาระบบ",
    "พัฒนา software",
    "พัฒนาซอฟต์แวร์",
    "นักพัฒนาซอฟต์แวร์",
    "โปรแกรมเมอร์",
    // Freelance
    "Freelance",
    "Freelance Developer",
    "Freelance Software Developer",
    "รับพัฒนาระบบ",
    "รับทำเว็บ",
    "รับทำแอพ",
    // Agile & methodology
    "Agile",
    "Scrum",
    "Agile Coach",
    // Technologies
    "Software",
    "React",
    "Next.js",
    "Node.js",
    "AWS",
    "TypeScript",
    // Other
    "Team Leadership",
    "Startup Advisor",
    "Thailand",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: {
    languages: {
      "en-US": siteConfig.url,
      "th-TH": siteConfig.url,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["th_TH"],
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@thanaphatnorth",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data for Person
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Thanaphat Chirutpadathorn (North)",
  alternateName: ["ฐานพัฒน์ จิรุตม์ผะดาทร", "Thanaphat North", "North"],
  url: siteConfig.url,
  image: `${siteConfig.url}/profile.jpg`,
  jobTitle: ["Engineering Manager", "Software Developer", "Freelance Developer"],
  worksFor: {
    "@type": "Organization",
    name: "Invitrace",
  },
  description: siteConfig.description,
  sameAs: [siteConfig.links.linkedin, siteConfig.links.github],
  knowsAbout: [
    "Software Engineering",
    "Software Development",
    "พัฒนาระบบ",
    "พัฒนา Software",
    "Team Leadership",
    "Agile Methodologies",
    "Agile",
    "Scrum",
    "Cloud Architecture",
    "React",
    "Node.js",
    "AWS",
    "Freelance Development",
  ],
  hasOccupation: [
    {
      "@type": "Occupation",
      name: "Engineering Manager",
      occupationalCategory: "15-1252.00",
    },
    {
      "@type": "Occupation",
      name: "Software Developer",
      occupationalCategory: "15-1252.00",
    },
  ],
};

// JSON-LD for Freelance Service
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Thanaphat North - Freelance Software Development",
  alternateName: "ฐานพัฒน์ - รับพัฒนาระบบ Freelance",
  description: "Freelance Software Development Services - พัฒนาระบบ, พัฒนา Software, Web & Mobile Applications",
  url: siteConfig.url,
  provider: {
    "@type": "Person",
    name: "Thanaphat Chirutpadathorn",
    alternateName: "ฐานพัฒน์ จิรุตม์ผะดาทร",
  },
  areaServed: {
    "@type": "Country",
    name: "Thailand",
  },
  serviceType: [
    "Software Development",
    "Web Development",
    "Mobile App Development",
    "Agile Consulting",
    "Technical Advisory",
    "พัฒนาระบบ",
    "พัฒนา Software",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="canonical" href={siteConfig.url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

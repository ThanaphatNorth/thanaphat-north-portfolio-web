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
  manifest: "/manifest.json",
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en-US": siteConfig.url,
      "th-TH": siteConfig.url,
    },
  },
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
    // Technical Consultant
    "Technical Consultant",
    "Technical Consultant Thailand",
    "Software Technical Consultant",
    "IT Consultant",
    "IT Consultant Thailand",
    "Technology Consultant",
    "Software Consulting",
    "Technical Advisory",
    "Technical Advisor",
    "Startup Technical Advisor",
    "ที่ปรึกษาด้านเทคนิค",
    "ที่ปรึกษาซอฟต์แวร์",
    "ที่ปรึกษา IT",
    "Hire Technical Consultant",
    "Hire Technical Consultant Thailand",
    // Freelance (still indexed but secondary)
    "Freelance",
    "Freelance Developer",
    "Freelance Software Developer",
    "Freelance Software Engineer",
    "Freelance Web Developer",
    "Freelance Mobile Developer",
    "รับพัฒนาระบบ",
    "รับทำเว็บ",
    "รับทำแอพ",
    "รับงาน Freelance",
    "ฟรีแลนซ์",
    "รับเขียนโปรแกรม",
    // Software Development
    "Custom Software Development",
    "Software Development Services",
    "Software Engineering",
    "Application Development",
    "Enterprise Software Development",
    "Outsource Software Development",
    "บริการพัฒนาซอฟต์แวร์",
    // Web Development
    "Web Development",
    "Web Application Development",
    "Website Development",
    "Web Developer Thailand",
    "พัฒนาเว็บ",
    "พัฒนาเว็บไซต์",
    "เว็บแอปพลิเคชัน",
    "ทำเว็บไซต์",
    // Mobile Development
    "Mobile App Development",
    "Mobile Application Development",
    "Mobile Developer",
    "React Native Developer",
    "iOS Android Development",
    "พัฒนาแอพมือถือ",
    "ทำแอพ",
    "สร้างแอปพลิเคชัน",
    // จองคิว / JongQue.com
    "จองคิว",
    "ระบบจองคิว",
    "ระบบจองคิวออนไลน์",
    "ระบบนัดหมาย",
    "ระบบจอง",
    "Queue Management",
    "Booking System",
    "Online Booking System",
    "Queue Management System",
    "Appointment Scheduling",
    "JongQue",
    "jongque.com",
    // Ventures & Products
    "Tech Entrepreneur",
    "SaaS",
    "SaaS Platform",
    "Startup Founder",
    "BuildYourThinks",
    "buildyourthinks.com",
    "Visibr",
    "visibr.com",
    "Founder Matchmaking",
    "Startup Ideas Platform",
    // Blog & Knowledge
    "Tech Blog",
    "Software Engineering Blog",
    "Engineering Leadership Blog",
    "Technology Insights",
    "Software Architecture Blog",
    "บล็อกเทคโนโลยี",
    // Portfolio
    "Developer Portfolio",
    "Software Engineer Portfolio",
    "Engineering Manager Portfolio",
    "Tech Portfolio",
    "Project Portfolio",
    "ผลงาน",
    "พอร์ตโฟลิโอ",
    // Agile & methodology
    "Agile",
    "Scrum",
    "Agile Coach",
    "Agile Consultant",
    "DevOps",
    // Technologies
    "Software",
    "React",
    "Next.js",
    "Node.js",
    "AWS",
    "TypeScript",
    "NestJS",
    "Docker",
    "Kubernetes",
    // Other
    "Team Leadership",
    "Startup Advisor",
    "CTO as a Service",
    "Fractional CTO",
    "Thailand",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
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
  alternateName: [
    "ฐานพัฒน์ จิรุตม์ผะดาทร",
    "Thanaphat North",
    "North",
  ],
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  jobTitle: [
    "Technical Consultant",
    "Engineering Manager",
    "Software Architect",
    "Tech Entrepreneur",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Invitrace",
  },
  description: siteConfig.description,
  sameAs: [
    siteConfig.links.linkedin,
    siteConfig.links.github,
    "https://jongque.com",
    "https://buildyourthinks.com",
    "https://visibr.com",
  ],
  knowsAbout: [
    "Software Engineering",
    "Software Development",
    "Custom Software Development",
    "Web Development",
    "Web Application Development",
    "Mobile App Development",
    "React Native Development",
    "พัฒนาระบบ",
    "พัฒนา Software",
    "พัฒนาเว็บ",
    "พัฒนาแอพมือถือ",
    "จองคิว",
    "ระบบจองคิวออนไลน์",
    "Queue Management System",
    "Booking System",
    "Team Leadership",
    "Agile Methodologies",
    "Agile",
    "Scrum",
    "DevOps",
    "Cloud Architecture",
    "React",
    "Next.js",
    "Node.js",
    "NestJS",
    "AWS",
    "Docker",
    "Kubernetes",
    "Technical Consulting",
    "Software Consulting",
    "IT Advisory",
    "SaaS Development",
    "Tech Entrepreneurship",
    "Scalable Architecture Design",
    "Digital Transformation",
  ],
  hasOccupation: [
    {
      "@type": "Occupation",
      name: "Technical Consultant",
      occupationalCategory: "15-1299.08",
    },
    {
      "@type": "Occupation",
      name: "Engineering Manager",
      occupationalCategory: "15-1252.00",
    },
    {
      "@type": "Occupation",
      name: "Software Architect",
      occupationalCategory: "15-1252.00",
    },
  ],
};

// JSON-LD for Technical Consulting Service
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Thanaphat North - Technical Consultant & Software Development",
  alternateName: "ฐานพัฒน์ - ที่ปรึกษาด้านเทคนิค & พัฒนาระบบ",
  description:
    "Technical Consulting & Software Development Services - ที่ปรึกษาซอฟต์แวร์, พัฒนาระบบ, Architecture Design, Web & Mobile Applications, ระบบจองคิว (jongque.com), Agile Transformation, SaaS Platform Development",
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
    "Technical Consulting",
    "Software Consulting",
    "IT Consulting",
    "Technical Advisory",
    "Startup Technical Consulting",
    "Architecture Design",
    "Agile Transformation",
    "CTO as a Service",
    "Software Development",
    "Custom Software Development",
    "Web Development",
    "Web Application Development",
    "Mobile App Development",
    "React Native Development",
    "Queue Management System",
    "Booking System Development",
    "SaaS Development",
    "ที่ปรึกษาด้านเทคนิค",
    "ที่ปรึกษาซอฟต์แวร์",
    "พัฒนาระบบ",
    "พัฒนา Software",
    "พัฒนาเว็บ",
    "พัฒนาแอพมือถือ",
    "ระบบจองคิว",
    "ระบบจองคิวออนไลน์",
    "รับพัฒนาระบบ",
    "รับทำเว็บ",
    "รับทำแอพ",
  ],
};

// JSON-LD for Ventures (SaaS Products)
const venturesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Thanaphat North - Tech Ventures & Products",
  description: "SaaS products and tech ventures by Thanaphat North",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "JongQue.com",
        alternateName: "จองคิว",
        url: "https://jongque.com",
        applicationCategory: "BusinessApplication",
        description:
          "ระบบจองคิวออนไลน์ - SaaS platform for resource & queue management, online booking system, appointment scheduling",
        offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "WebSite",
        name: "BuildYourThinks.com",
        url: "https://buildyourthinks.com",
        description:
          "Startup ideas & founder matchmaking platform - connecting aspiring founders with ideas and co-founders",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Blog",
        name: "Visibr.com",
        url: "https://visibr.com",
        description:
          "Tech blog sharing insights on software architecture, engineering leadership, and technology trends",
      },
    },
  ],
};

// JSON-LD for Portfolio Website
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Thanaphat North - Portfolio & Blog",
  alternateName: "ฐานพัฒน์ - พอร์ตโฟลิโอ",
  url: siteConfig.url,
  description: siteConfig.description,
  author: {
    "@type": "Person",
    name: "Thanaphat Chirutpadathorn",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(venturesJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
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

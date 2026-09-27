import { getDefaultExperienceYears } from "./experience";

// Get default experience years for static content
const defaultExperience = getDefaultExperienceYears();

export const siteConfig = {
  name: "Thanaphat (North)",
  title:
    "Thanaphat Chirutpadathorn (North) | Technical Consultant, Engineering Manager & Tech Entrepreneur",
  nameThai: "ฐานพัฒน์ จิรุตม์ผะดาทร",
  role: "Senior Engineering Manager · Healthcare Technology",
  description: `Senior Engineering Manager & Technical Consultant with ${defaultExperience.totalYearsDisplay} years in software engineering and ${defaultExperience.leadershipYearsDisplay} years leading teams. Heads a 30+ engineer healthcare-tech organization, scaled it by 50%, drove ISO 27001/9001 and a 3x deployment-frequency gain. Founder of JongQue.com (ระบบจองคิวออนไลน์).`,
  url: "https://thanaphat-north.com",
  ogImage: "/opengraph-image",
  resumeUrl: "/Thanaphat-Chirutpadathorn-Resume.pdf",
  links: {
    linkedin: "https://linkedin.com/in/thanaphat-chirutpadathorn",
    github: "https://github.com/thanaphatnorth",
    email: "north.thanaphat@gmail.com",
  },
};

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#journey", label: "Journey" },
  { href: "#services", label: "Services" },
  { href: "#ventures", label: "Ventures" },
  { href: "/blog", label: "Blog", isExternal: true },
];

/** Bangkok — the "N" in North. Shown as a signature motif. */
export const coordinates = "N 13°45′22″ · E 100°30′06″";

export const impactStats = [
  {
    value: 30,
    suffix: "+",
    label: "Engineers led",
    description: "Cross-functional healthcare-tech organization",
    icon: "users",
  },
  {
    value: 3,
    suffix: "×",
    label: "Deployment frequency",
    description: "AI-assisted workflow, pilot → org-wide",
    icon: "rocket",
  },
  {
    value: 50,
    suffix: "%",
    label: "Org scaled",
    description: "18 engineers hired & onboarded in 3 months",
    icon: "trending",
  },
  {
    value: 25,
    suffix: "%",
    label: "Fewer defects",
    description: "Code review & release governance",
    icon: "shield",
  },
] as const;

export const credentials = [
  "ISO 27001 / 9001",
  "PSM I · Scrum.org",
  "OutSystems Tech Lead & Architecture Specialist",
  "B.Sc. Media Technology · KMUTT",
];

export const experiences = [
  {
    company: "Invitrace",
    role: "Senior Engineering Manager",
    period: "Jul 2026 – Present",
    year: "2026",
    description:
      "Leading the engineering organization end-to-end: 30+ cross-functional engineers delivering secure healthcare technology — patient-facing apps, employee-health products and hospital back-office systems under one delivery org.",
    highlights: [
      "Own hiring strategy, performance management and technical direction",
      "Brought the hospital internal-systems team into a single delivery organization",
      "Matured the AI-assisted workflow to a 3× gain in deployment frequency & cycle time",
      "Completed the org-wide shift to a flow-based (Kanban) operating model",
    ],
  },
  {
    company: "Invitrace",
    role: "Engineering Manager / Delivery Lead",
    period: "Aug 2025 – Jun 2026",
    year: "2025",
    description:
      "Managed delivery across all product teams — a patient-facing hospital app and an employee health & wellness app — owning hiring, onboarding and performance reviews.",
    highlights: [
      "Scaled AI developer tooling from a single-team pilot to the whole organization",
      "Designed structured QA (test planning, regression coverage) to stabilize releases",
      "Ran delivery hands-on in Jira: backlog, boards and stakeholder reporting",
      "Introduced Kanban governance, knowledge-sharing sessions and regular 1:1s",
    ],
  },
  {
    company: "Invitrace",
    role: "Tech Lead",
    period: "Sep 2024 – Jul 2025",
    year: "2024",
    description:
      "Led a cross-functional squad shipping 7+ products around the employee health & wellness app, aligning technical strategy with business priorities.",
    highlights: [
      "Grew team capacity 50% — 18 engineers recruited & onboarded in 3 months",
      "Piloted AI developer tools with responsible-usage training (~30% productivity)",
      "Drove ISO 27001/9001 certification through security & process standardization",
      "~25% fewer production defects; 40% less design time via reusable templates",
    ],
  },
  {
    company: "iPassion",
    role: "Tech Lead & Team Lead",
    period: "Jun 2023 – Aug 2024",
    year: "2023",
    description:
      "Led a 30-member team integrating 10 legacy systems into one unified platform for an enterprise automotive manufacturer.",
    highlights: [
      "Unified 10 legacy systems, streamlining data flow and removing silos",
      "Raised delivery speed and predictability with agile practices",
      "Ran proactive risk monitoring and mitigation for consistent delivery",
    ],
  },
  {
    company: "iPassion",
    role: "Technical Lead & Solution Consultant (Pre-Sales)",
    period: "Jul 2020 – May 2023",
    year: "2020",
    description:
      "Modeled business processes, designed databases and solutions, advised low-code teams and partnered with sales on proposals for automotive and finance clients.",
    highlights: [
      "~20% less manual work through process automation",
      "LINE Bot for support-issue triage — ~30% faster assignment",
      "~20% less post-sale rework through tailored proposals & demos",
    ],
  },
  {
    company: "iPassion",
    role: "Software Developer",
    period: "Jul 2018 – Jun 2020",
    year: "2018",
    description:
      "Built front-end apps (Angular, React) and cross-platform mobile apps (Ionic, React Native) with a 95%+ crash-free rate.",
    highlights: [
      "95%+ crash-free mobile releases",
      "API integrations that cut user-facing errors by ~20%",
    ],
  },
  {
    company: "Codediva",
    role: "Software Developer",
    period: "Jun 2017 – Jul 2018",
    year: "2017",
    description:
      "Delivered Android apps end-to-end, ran UAT with client users, and built Java libraries for POS transaction processing.",
    highlights: [
      "End-to-end Android delivery, from development to handover",
      "Independent UAT with client users before every release",
    ],
  },
];

export const services = [
  {
    id: "advisor",
    title: "Startup & Product Technical Advisor",
    description:
      "Strategic technical guidance for startups and product teams looking to scale.",
    features: [
      "Scalable Architecture Design (AWS)",
      "Tech Stack Selection & Evaluation",
      "MVP Roadmap & Technical Planning",
      "Due Diligence Support",
    ],
    icon: "Lightbulb",
  },
  {
    id: "agile",
    title: "Agile & Team Performance Consultant",
    description:
      "Optimize your team's delivery and establish best practices for predictable outcomes.",
    features: [
      "Scrum → Kanban / flow-based delivery",
      "Jira workflow, boards & delivery reporting",
      "Delivery metrics: deployment frequency, cycle time",
      "AI-assisted development rollout & governance",
    ],
    icon: "Target",
  },
  {
    id: "development",
    title: "Full-Cycle Development",
    description:
      "End-to-end development services for web, mobile, and enterprise solutions.",
    features: [
      "Custom Booking Systems (jongque.com style)",
      "Web & Mobile Applications",
      "Enterprise Solutions",
      "API Development & Integration",
    ],
    icon: "Code",
  },
  {
    id: "coaching",
    title: "Tech Leadership Coaching",
    description:
      "Personalized coaching for engineers transitioning into leadership roles.",
    features: [
      "Career Pathing for Engineers",
      "1-on-1 Mentorship Sessions",
      "Leadership Skills Development",
      "Team Management Strategies",
    ],
    icon: "Users",
  },
];

export const ventures = [
  {
    name: "JongQue.com",
    tagline: "SaaS for Resource & Queue Management",
    description:
      "A comprehensive platform for managing bookings, queues, and resources for businesses of all sizes.",
    url: "https://jongque.com",
    status: "Live",
  },
  {
    name: "BuildYourThinks.com",
    tagline: "Startup Ideas & Founder Matchmaking",
    description:
      "A platform connecting aspiring founders with ideas and co-founders to build the next big thing.",
    url: "https://buildyourthinks.com",
    status: "Beta",
  },
  {
    name: "Visibr.com",
    tagline: "Tech Blog & Knowledge Hub",
    description:
      "Sharing insights on software architecture, engineering leadership, and technology trends.",
    url: "https://visibr.com",
    status: "Live",
  },
];

export const philosophyPillars = [
  {
    title: "Empowerment over Micromanagement",
    description:
      "Trust your team with ownership. Provide clear goals and let them find the best path forward.",
  },
  {
    title: "Data-Driven Delivery",
    description:
      "Make decisions based on metrics, not gut feelings. Track velocity, quality, and customer impact.",
  },
  {
    title: "AI-Augmented Productivity",
    description:
      "Leverage AI tools to amplify human capabilities, not replace them. Stay ahead of the curve.",
  },
];

export const techStack = {
  frontend: [
    { name: "React", icon: "react" },
    { name: "React Native", icon: "react-native" },
    { name: "Next.js", icon: "nextjs" },
    { name: "Angular", icon: "angular" },
  ],
  backend: [
    { name: "Node.js", icon: "nodejs" },
    { name: "NestJS", icon: "nestjs" },
    { name: "Express", icon: "express" },
    { name: "C#", icon: "csharp" },
  ],
  cloud: [
    { name: "AWS", icon: "aws" },
    { name: "Docker", icon: "docker" },
    { name: "CI/CD", icon: "cicd" },
  ],
  database: [
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "MongoDB", icon: "mongodb" },
    { name: "Redis", icon: "redis" },
  ],
};

/**
 * Portfolio type options used in admin forms and filtering
 */
export const portfolioTypeOptions = [
  "Web App",
  "Mobile",
  "Design",
  "E-commerce",
  "SaaS",
  "API",
  "Dashboard",
  "Library",
  "Training",
  "Consulting",
  "Research",
  "Education",
  "Other",
] as const;

/**
 * Portfolio skill options used in admin forms for quick selection
 */
export const portfolioSkillOptions = [
  "AI",
  "ML",
  "Data Science",
  "DevOps",
  "Cloud",
  "Security",
  "Blockchain",
  "IoT",
  "AR/VR",
  "Integration",
  "Automation",
  "Management",
  "Agile",
  "Scrum",
  "Architecture Design",
  "System Design",
  "Code Review",
] as const;

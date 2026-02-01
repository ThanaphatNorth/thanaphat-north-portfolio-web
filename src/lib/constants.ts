export const siteConfig = {
  name: "Thanaphat (North)",
  title: "Thanaphat Chirutpadathorn (North) | Engineering Manager & Tech Entrepreneur",
  description:
    "Engineering Manager with 8+ years of software development experience and 5+ years in leadership roles. Specialized in scaling high-performing teams and building robust systems.",
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
  { href: "#impact", label: "Impact" },
  { href: "#experience", label: "Experience" },
  { href: "#services", label: "Services" },
  { href: "#ventures", label: "Ventures" },
  { href: "#tech-stack", label: "Tech Stack" },
  { href: "/blog", label: "Blog", isExternal: true },
];

export const impactStats = [
  {
    value: 30,
    suffix: "+",
    label: "Engineers Managed",
    description: "Led and mentored cross-functional teams",
  },
  {
    value: 30,
    suffix: "%",
    label: "Efficiency Boost",
    description: "Through Agile & CI/CD optimization",
  },
  {
    value: 25,
    suffix: "%",
    label: "Bug Reduction",
    description: "By implementing structured QA & automated testing",
  },
  {
    value: 0,
    suffix: "",
    label: "ISO 27001/9001",
    description: "Security & Compliance expert",
    isText: true,
  },
];

export const experiences = [
  {
    company: "Invitrace",
    role: "Engineering Manager",
    period: "2025 - Present",
    description:
      "Leading and inspiring a high-performing software development team building multiple products, aligning technical strategy with business priorities to accelerate delivery.",
    highlights: [
      "Mentored 30+ cross-functional engineers with regular 1:1 sessions",
      "Achieved 30% boost in efficiency through team collaboration and prioritization",
      "Ensured ISO 27001/9001 compliance and passed penetration testing",
      "Reduced production bugs by 25% through structured QA process",
    ],
  },
  {
    company: "Invitrace",
    role: "Tech Lead",
    period: "2024 - 2025",
    description:
      "Elevated execution by guiding technical decisions and fostering accountability, while streamlining workflows through AI tools adoption.",
    highlights: [
      "Improved developer productivity by 30% through AI tools training",
      "Expanded team capacity by 50% (15-20 members in 3 months)",
      "Raised successful task completion rates by 25%",
      "Created reusable infrastructure templates and standardized setup",
    ],
  },
  {
    company: "iPassion",
    role: "Tech Lead & Team Lead",
    period: "2023 - 2024",
    description:
      "Led a 30-member team to integrate legacy systems into a unified platform, streamlining data flow and eliminating silos.",
    highlights: [
      "Integrated 10 legacy systems into one unified platform",
      "Applied Agile practices to increase delivery speed and predictability",
      "Drove continuous improvement through regular retrospectives",
      "Monitored risks and implemented proactive mitigation strategies",
    ],
  },
  {
    company: "iPassion",
    role: "Technical Lead (Low Code)",
    period: "2021 - 2023",
    description:
      "Designed databases and technical solutions, consulted low-code developer teams, and provided pre-sales technical guidance.",
    highlights: [
      "Reduced manual work by 20% through process automation",
      "Developed career path frameworks for HR development",
      "Reduced post-sale rework by 20% through seamless handoffs",
      "Delivered accurate proposals improving bid competitiveness",
    ],
  },
  {
    company: "iPassion",
    role: "Software Developer",
    period: "2018 - 2021",
    description:
      "Developed front-end applications with Angular and React, built mobile apps achieving stable performance with 95%+ crash-free rate.",
    highlights: [
      "Built mobile apps with Ionic and React Native (95%+ crash-free)",
      "Integrated APIs reducing user-facing errors by 20%",
      "Contributed to code quality through peer reviews",
      "Helped reduce production bugs by 15%",
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
      "Jira Workflow Setup & Optimization",
      "CI/CD Pipeline Implementation",
      "Sprint Planning & Retrospectives",
      "Predictable Delivery Frameworks",
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
  cloud: [
    { name: "AWS", icon: "aws" },
    { name: "Docker", icon: "docker" },
    { name: "Kubernetes", icon: "kubernetes" },
  ],
  frontend: [
    { name: "Next.js", icon: "nextjs" },
    { name: "React", icon: "react" },
    { name: "React Native", icon: "react-native" },
    { name: "TypeScript", icon: "typescript" },
  ],
  backend: [
    { name: "Node.js", icon: "nodejs" },
    { name: "NestJS", icon: "nestjs" },
    { name: "Java", icon: "java" },
    { name: "Spring Boot", icon: "spring" },
  ],
  database: [
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "MongoDB", icon: "mongodb" },
    { name: "Redis", icon: "redis" },
  ],
};

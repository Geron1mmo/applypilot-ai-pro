import type { Application, Document, User } from "@/types"

export const DEMO_EMAIL = "demoapplypilot.local"
export const DEMO_PASSWORD = "Demo12345!"

export const DEMO_USER_ID = "demo-user-001"

export function createDemoUser(passwordHash: string, salt: string): User {
  return {
    id: DEMO_USER_ID,
    fullName: "Alex Rivera",
    email: DEMO_EMAIL,
    passwordHash,
    salt,
    role: "demo",
    createdAt: new Date().toISOString(),
    profile: {
      jobTargetTitle: "Senior Frontend Developer",
      location: "Remote, EU",
      preferredWorkMode: "remote",
      bio: "Full-stack developer with 6+ years building SaaS products. Passionate about React, TypeScript, and developer experience.",
      skills: ["React", "TypeScript", "Node.js", "Tailwind", "GraphQL"],
    },
  }
}

export function createDemoApplications(): Application[] {
  const now = new Date()
  const daysAgo = (n: number) =>
    new Date(now.getTime() - n * 86400000).toISOString()

  return [
    {
      id: "app-001",
      userId: DEMO_USER_ID,
      company: "Vercel",
      role: "Senior Frontend Engineer",
      location: "Remote",
      workMode: "remote",
      salaryMin: 140000,
      salaryMax: 180000,
      currency: "USD",
      jobUrl: "https://vercel.com/careers",
      hrName: "Sarah Chen",
      hrEmail: "sarah.chen@vercel.com",
      status: "interview",
      priority: "high",
      deadline: daysAgo(-14),
      dateApplied: daysAgo(10),
      notes: "Second round scheduled next week. Focus on React performance.",
      jobDescription:
        "Looking for a Senior Frontend Engineer with React, TypeScript, Next.js, and performance optimization experience.",
      cvMatchScore: 82,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(2),
    },
    {
      id: "app-002",
      userId: DEMO_USER_ID,
      company: "Stripe",
      role: "Full Stack Developer",
      location: "San Francisco, CA",
      workMode: "hybrid",
      salaryMin: 150000,
      salaryMax: 200000,
      currency: "USD",
      jobUrl: "https://stripe.com/jobs",
      hrName: "James Park",
      hrEmail: "james@stripe.com",
      status: "applied",
      priority: "high",
      deadline: daysAgo(-7),
      dateApplied: daysAgo(5),
      notes: "Applied via referral from former colleague.",
      jobDescription:
        "Full Stack Developer with Node.js, React, PostgreSQL, API design, and security best practices.",
      cvMatchScore: 74,
      createdAt: daysAgo(6),
      updatedAt: daysAgo(5),
    },
    {
      id: "app-003",
      userId: DEMO_USER_ID,
      company: "Linear",
      role: "Product Engineer",
      location: "Remote",
      workMode: "remote",
      salaryMin: 130000,
      salaryMax: 170000,
      currency: "USD",
      jobUrl: "https://linear.app/careers",
      hrName: "",
      hrEmail: "",
      status: "technical",
      priority: "medium",
      deadline: null,
      dateApplied: daysAgo(20),
      notes: "Technical interview completed. Awaiting feedback.",
      jobDescription:
        "Product Engineer with React, TypeScript, UI/UX sensibility, and Agile experience.",
      cvMatchScore: 88,
      createdAt: daysAgo(22),
      updatedAt: daysAgo(1),
    },
    {
      id: "app-004",
      userId: DEMO_USER_ID,
      company: "Notion",
      role: "Frontend Developer",
      location: "New York, NY",
      workMode: "hybrid",
      salaryMin: 120000,
      salaryMax: 160000,
      currency: "USD",
      jobUrl: "https://notion.so/careers",
      hrName: "Emily Wu",
      hrEmail: "emily@notion.so",
      status: "offer",
      priority: "high",
      deadline: null,
      dateApplied: daysAgo(30),
      notes: "Offer received! Negotiating start date.",
      jobDescription:
        "Frontend Developer with React, CSS, responsive design, and Figma collaboration.",
      cvMatchScore: 91,
      createdAt: daysAgo(35),
      updatedAt: daysAgo(3),
    },
    {
      id: "app-005",
      userId: DEMO_USER_ID,
      company: "Meta",
      role: "Software Engineer",
      location: "Menlo Park, CA",
      workMode: "onsite",
      salaryMin: 160000,
      salaryMax: 220000,
      currency: "USD",
      jobUrl: "https://metacareers.com",
      hrName: "",
      hrEmail: "",
      status: "rejected",
      priority: "medium",
      deadline: null,
      dateApplied: daysAgo(45),
      notes: "Rejected after onsite. Good feedback on system design.",
      jobDescription:
        "Software Engineer with JavaScript, React, GraphQL, testing, and CI/CD pipeline experience.",
      cvMatchScore: 65,
      createdAt: daysAgo(50),
      updatedAt: daysAgo(40),
    },
    {
      id: "app-006",
      userId: DEMO_USER_ID,
      company: "Figma",
      role: "Design Engineer",
      location: "Remote",
      workMode: "remote",
      salaryMin: 135000,
      salaryMax: 175000,
      currency: "USD",
      jobUrl: "https://figma.com/careers",
      hrName: "Lisa Tran",
      hrEmail: "lisa@figma.com",
      status: "saved",
      priority: "low",
      deadline: daysAgo(-21),
      dateApplied: null,
      notes: "Interesting role. Need to tailor CV before applying.",
      jobDescription:
        "Design Engineer with React, TypeScript, Figma, UI/UX, and CSS expertise.",
      cvMatchScore: null,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
  ]
}

export function createDemoDocuments(): Document[] {
  const now = new Date().toISOString()
  return [
    {
      id: "doc-001",
      userId: DEMO_USER_ID,
      type: "cv",
      title: "Senior Frontend CV — 2026",
      content:
        "Alex Rivera\nSenior Frontend Developer\n\nSkills: React, TypeScript, Node.js, Next.js, Tailwind CSS, GraphQL, Jest, Cypress, Docker, CI/CD\n\nExperience:\n- Built SaaS dashboards serving 50k+ users\n- Led migration to TypeScript across 40+ components\n- Optimized LCP by 40% through code splitting and lazy loading",
      tags: ["frontend", "2026", "primary"],
      isPrimary: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "doc-002",
      userId: DEMO_USER_ID,
      type: "cover-letter",
      title: "Vercel Application Cover Letter",
      content:
        "Dear Hiring Team,\n\nI am excited to apply for the Senior Frontend Engineer role at Vercel. With 6+ years of experience building performant React applications, I believe I can contribute meaningfully to your platform team.\n\nBest regards,\nAlex Rivera",
      tags: ["vercel", "cover-letter"],
      isPrimary: false,
      createdAt: now,
      updatedAt: now,
    },
  ]
}
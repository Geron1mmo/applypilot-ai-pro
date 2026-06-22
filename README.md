# ApplyPilot AI Pro

[![CI](https://github.com/Geron1mmo/applypilot-ai-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/Geron1mmo/applypilot-ai-pro/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-blue)](https://geron1mmo.github.io/applypilot-ai-pro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A local-first, portfolio-ready SaaS-style job application tracker for developers and job seekers. Track applications, analyze CV fit, manage documents, and visualize your job search — all running in the browser with zero backend dependencies.

**Live Demo:** [https://geron1mmo.github.io/applypilot-ai-pro/](https://geron1mmo.github.io/applypilot-ai-pro/)

**GitHub:** [https://github.com/Geron1mmo/applypilot-ai-pro](https://github.com/Geron1mmo/applypilot-ai-pro)

## Screenshots

| Dashboard | Kanban | CV Analyzer |
|-----------|--------|-------------|
| _Add screenshot_ | _Add screenshot_ | _Add screenshot_ |

> Place screenshots in the `screenshots/` folder and update the paths above.

## Features

- **Application Pipeline** — Track jobs through Saved → Applied → Interview → Offer stages
- **Kanban Board** — Visual pipeline with status management on each card
- **CV Match Analyzer** — Local skill-matching engine (no AI APIs, no external calls)
- **Document Storage** — Save CV versions and cover letter drafts locally
- **Analytics Dashboard** — Conversion rates, salary trends, and match score insights
- **Local Authentication** — Register/login with Web Crypto password hashing
- **Demo Mode** — Pre-loaded demo account with sample data
- **Export/Import** — Full JSON backup and restore
- **CSV Export** — Download applications for spreadsheets or recruiters
- **Follow-up Reminders** — Interview dates, follow-ups, and deadline alerts
- **Status History** — Track how each application moved through the pipeline
- **CV Analyzer Links** — Jump from any application to pre-filled CV analysis
- **Dark/Light Theme** — Professional SaaS dashboard UI
- **Responsive Design** — Mobile-friendly with collapsible sidebar

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- shadcn/ui (Radix Nova)
- React Router 7
- Recharts
- Zod
- Sonner
- Lucide React
- Web Crypto API
- localStorage

## Why I Built This

I wanted a portfolio project that demonstrates full-stack product thinking without relying on paid APIs or backend services. ApplyPilot shows I can design and ship a complete SaaS experience — authentication, dashboards, data persistence, analytics, and polished UI — as a self-contained client application.

## Installation

```bash
git clone https://github.com/Geron1mmo/applypilot-ai-pro.git
cd applypilot-ai-pro
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Create an Account

1. Visit the landing page and click **Get Started**
2. Fill in your name, email, and password
3. You'll land on the dashboard ready to add applications

### Demo Account

Use these credentials on the login page or click **Try Demo Account**:

| Field | Value |
|-------|-------|
| Email | `demoapplypilot.local` |
| Password | `Demo12345!` |

The demo account includes sample applications, documents, and profile data.

### CV Analyzer

1. Navigate to **CV Analyzer**
2. Paste your resume text and a job description
3. Click **Analyze Match** for a local skill-matching score (0–100)
4. Review matched/missing skills and improvement suggestions

### Data Backup

Go to **Settings → Data Management** to export all data as JSON or import a previous backup.

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Sidebar, TopNav, AppLayout
│   └── applications/    # StatusBadge, ApplicationFormDialog
├── contexts/            # AuthContext, ThemeContext
├── hooks/               # useApplications
├── lib/                 # crypto, storage, validation, cvAnalyzer
├── pages/               # All route pages
├── routes/              # AppRoutes, ProtectedRoute
└── types/               # TypeScript interfaces
```

## Security Notes

> **This is a portfolio demo, not a production authentication system.**

- Passwords are hashed locally with Web Crypto API (SHA-256 + salt)
- All data lives in browser `localStorage`
- No external server receives your data
- Session management is client-side only
- See [SECURITY.md](./SECURITY.md) for full details

## Roadmap

- [ ] IndexedDB migration for larger datasets
- [ ] Drag-and-drop kanban with @dnd-kit
- [ ] PDF export for applications
- [ ] Browser extension for job posting capture
- [ ] PWA offline support

## Deployment (Vercel)

### 1. Push to GitHub

```bash
cd applypilot-ai-pro
git init
git add .
git commit -m "Initial commit: ApplyPilot AI Pro"
git branch -M main
git remote add origin https://github.com/Geron1mmo/applypilot-ai-pro.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project** → Import your GitHub repository
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**

SPA routing is configured via `vercel.json` — all routes rewrite to `index.html`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## License

[MIT](./LICENSE)
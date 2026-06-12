# Documentation Governance System — GV Monorepo

> **This is the single authoritative entry point for all project knowledge.**
> Every document, plan, task, decision, report, and log MUST exist within this `docs/` tree.

---

## 🗺️ Documentation Map

| Section          | Path                                  | Purpose                                  |
| ---------------- | ------------------------------------- | ---------------------------------------- |
| **Architecture** | [docs/architecture/](./architecture/) | System design, patterns, layer diagrams  |
| **Modules**      | [docs/modules/](./modules/)           | Frontend & backend module documentation  |
| **Packages**     | [docs/packages/](./packages/)         | SSOT packages (`@gv/*`) reference        |
| **Development**  | [docs/development/](./development/)   | Setup, coding standards, workflow        |
| **Deployment**   | [docs/deployment/](./deployment/)     | Infrastructure, CI/CD, environments      |
| **Operations**   | [docs/operations/](./operations/)     | Monitoring, alerting, runbooks           |
| **Planning**     | [docs/planning/](./planning/)         | Roadmap, active/completed/archived plans |
| **Tracking**     | [docs/tracking/](./tracking/)         | Tasks, bugs, features, code-changes      |
| **Decisions**    | [docs/decisions/](./decisions/)       | Architecture Decision Records (ADRs)     |
| **Changelogs**   | [docs/changelogs/](./changelogs/)     | Change history per subsystem             |
| **Reports**      | [docs/reports/](./reports/)           | Implementation, migration, audit reports |
| **AI Context**   | [docs/ai-context/](./ai-context/)     | AI agent summaries for quick onboarding  |
| **Governance**   | [docs/governance/](./governance/)     | Documentation rules and enforcement      |
| **Generated**    | [docs/generated/](./generated/)       | Auto-generated API docs, schemas, etc.   |
| **Audits**       | [docs/audits/](./audits/)             | Periodic system audits                   |

---

## 🚀 Quick Start

```powershell
# Start frontend development server
npm run dev

# Run backend API
npm run dev -w apps/api

# Typecheck entire workspace
npm run typecheck

# Run SSOT integrity audit
npm run validate:ssot

# Run documentation governance check
npm run validate:docs
```

See [docs/development/getting-started.md](./development/getting-started.md) for full setup.

---

## 🏗️ System Architecture

- **Frontend**: Next.js 16 (App Router, Tailwind CSS v4, Zustand, TanStack Query)
- **Backend**: Fastify (Clean + Hexagonal Architecture, Drizzle ORM, Pino)
- **SSOT Packages**: 16 `@gv/*` shared packages ([→ SSOT Overview](./packages/ssot-overview.md))
- **Database**: SQLite (dev) / Turso (prod) via Drizzle ORM
- **Auth**: JWT (Fastify JWT)
- **Storage**: Cloudflare R2, Google Drive (adapter pattern)

Full architecture: [docs/architecture/system-overview.md](./architecture/system-overview.md)

---

## 📋 Active Work

- Active plans: [docs/planning/active-plans/](./planning/active-plans/)
- In-progress tasks: [docs/tracking/in-progress.md](./tracking/in-progress.md)
- Open bugs: [docs/tracking/bugs/open.md](./tracking/bugs/open.md)
- In-progress features: [docs/tracking/features/in-progress.md](./tracking/features/in-progress.md)

---

## 📊 Tracking Structure

### Task Tracking
- [backlog.md](./tracking/backlog.md) - Planned tasks
- [in-progress.md](./tracking/in-progress.md) - Currently in progress
- [blocked.md](./tracking/blocked.md) - Blocked tasks
- [completed.md](./tracking/completed.md) - Completed tasks
- [future-ideas.md](./tracking/future-ideas.md) - Future ideas

### Bug Tracking
- [bugs/open.md](./tracking/bugs/open.md) - Open bugs
- [bugs/fixed.md](./tracking/bugs/fixed.md) - Fixed bugs
- [bugs/known-issues.md](./tracking/bugs/known-issues.md) - Known issues with workarounds
- [bugs/regressions.md](./tracking/bugs/regressions.md) - Regressions

### Feature Tracking
- [features/planned.md](./tracking/features/planned.md) - Planned features
- [features/in-progress.md](./tracking/features/in-progress.md) - In-progress features
- [features/completed.md](./tracking/features/completed.md) - Completed features
- [features/deprecated.md](./tracking/features/deprecated.md) - Deprecated features

### Code Changes
- [code-changes/](./tracking/code-changes/) - Code change traceability

---

## 🔒 Governance Rule

> **NO `.md` or `.mdx` files may be created outside `docs/` directory.**
>
> Exceptions: `README.md` (project root only), `AGENTS.md` (AI tooling config, root only), `CHANGELOG.md` (root, auto-generated).
>
> See [docs/governance/file-placement-rules.md](./governance/file-placement-rules.md) for full rules.

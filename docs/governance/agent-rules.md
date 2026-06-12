# AI Agent Documentation Rules

> **Source**: `docs/governance/agent-rules.md`
> **Status**: Active
> **Last Updated**: 2026-06-12

---

## Purpose

This document defines the rules that AI agents (Antigravity, Claude, Gemini, Copilot, etc.) MUST follow when operating within this monorepo. These rules exist to prevent documentation sprawl, maintain SSOT integrity, and ensure all system knowledge is discoverable.

---

## Rule 1: Documentation Location

AI agents MUST NOT create `.md` or `.mdx` files outside `docs/`.

**Allowed**:

```
docs/architecture/
docs/modules/
docs/packages/
docs/development/
docs/planning/active-plans/
docs/tracking/
docs/decisions/
docs/changelogs/
docs/reports/
docs/ai-context/
docs/governance/
docs/audits/
docs/generated/
```

**Prohibited**:

- `src/docs/*.md` — this directory is now deprecated
- `apps/api/docs/*.md` — moved to `docs/modules/`
- `packages/*/README.md` — package docs go in `docs/packages/`
- Root-level arbitrary `.md` files

---

## Rule 2: SSOT Package Rules

AI agents MUST NOT:

- Define DTOs locally in `src/` or `apps/api/src/` — use `@gv/contracts`
- Define Zod schemas locally — use `@gv/schemas`
- Define roles/permissions locally — use `@gv/auth`
- Hardcode colors or spacing values — use `@gv/theme` CSS variables
- Hardcode user-facing strings — use `@gv/translations`
- Use `process.env` directly — use `@gv/config` loaders
- Define business limits as magic numbers — use `@gv/business-rules`

---

## Rule 3: Plan and Task Creation

When creating a plan or task:

- Plans → `docs/planning/active-plans/YYYY-MM-DD-plan-name.md`
- Tasks → update `docs/tracking/in-progress.md`
- Bugs → update `docs/tracking/bugs/open.md`

AI agent artifact files (implementation_plan.md, task.md, walkthrough.md) are stored in the agent's brain directory and do NOT need to be migrated to `docs/`.

---

## Rule 4: ADR Creation

When making an architectural decision:

1. Create `docs/decisions/ADR-XXXX.md` (next available number)
2. Update `docs/decisions/index.md`
3. Reference the ADR in the related code comments or commit message

---

## Rule 5: Changelog Updates

When modifying code significantly:

- Update the relevant changelog in `docs/changelogs/`
- Frontend changes → `docs/changelogs/frontend.md`
- Backend changes → `docs/changelogs/backend.md`
- Package changes → `docs/changelogs/packages.md`
- Database changes → `docs/changelogs/database.md`

---

## Rule 6: Code Safety Rules

AI agents MUST:

- Never modify `window.AppMemory` without explicit user approval
- Never delete persistent local state (IndexedDB, localStorage)
- Never read or modify `note/` directory
- Always use `try...catch` — no empty catch blocks
- Always validate with `node --check <file>` after editing TypeScript
- Never use `eval()`, `setTimeout(string)`, raw SQL concatenation

---

## Rule 7: Token Optimization

AI agents SHOULD:

- Query `@gv/*` package exports before reading entire files
- Use targeted line ranges instead of reading entire large files
- Prefer `grep_search` over reading files to locate symbols
- Never re-read files that were just created in the same session

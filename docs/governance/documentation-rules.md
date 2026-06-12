# Documentation Governance Rules

> **Source**: `docs/governance/documentation-rules.md`
> **Status**: Active
> **Last Updated**: 2026-06-12

---

## The Governance Contract

Every developer, AI agent, and automation tool working on this monorepo MUST abide by these rules. This is not advisory — violations will cause CI to fail.

---

## Core Rules

### Rule 1: One Documentation Root

`docs/` is the only allowed location for project documentation.

### Rule 2: No Orphan Documents

Every document in `docs/` must be reachable from `docs/README.md` via at least one link. Orphan documents will be flagged by `npm run validate:docs`.

### Rule 3: One ADR Per Decision

Every significant architectural decision MUST have an ADR. ADRs are never deleted — only superseded by new ADRs with a reference to the old one.

### Rule 4: Changelogs Are Mandatory

Every significant code change MUST update the corresponding changelog under `docs/changelogs/`. "Significant" means:

- A new feature is added
- An API contract changes
- A database schema changes
- A package is added or removed
- A bug fix affects public behavior

### Rule 5: Plans Must Have Owners

Every active plan in `docs/planning/active-plans/` must have:

- A creation date in the filename (`YYYY-MM-DD-name.md`)
- A `Status` field: `Draft | Active | Blocked | Completed`
- An assigned owner

### Rule 6: Tasks Have Exactly One State

A task exists in exactly one of:

- `docs/tracking/backlog.md`
- `docs/tracking/in-progress.md`
- `docs/tracking/blocked.md`
- `docs/tracking/completed.md`

It MUST NOT appear in multiple files simultaneously.

### Rule 7: Bugs Have Exactly One State

A bug exists in exactly one of:

- `docs/tracking/bugs/open.md`
- `docs/tracking/bugs/fixed.md`
- `docs/tracking/bugs/known-issues.md`
- `docs/tracking/bugs/regressions.md`

### Rule 8: AI Context Must Stay Fresh

Files in `docs/ai-context/` MUST be updated whenever a significant architectural change occurs. These files are the first thing AI agents read.

### Rule 9: Document Headers Are Required

Every `.md` file in `docs/` (except `README.md` files) must start with:

```markdown
# Title

> **Source**: `docs/path/to/file.md`
> **Status**: Active | Draft | Deprecated
> **Last Updated**: YYYY-MM-DD
```

### Rule 10: Superseded Documents

When a document becomes outdated, add to its header:

```markdown
> **⚠️ DEPRECATED**: Superseded by [NewDoc](./new-doc.md) on YYYY-MM-DD.
```

Never delete — keep for historical reference.

---

## Enforcement Levels

| Level       | Trigger                            | Action                 |
| ----------- | ---------------------------------- | ---------------------- |
| **Error**   | `.md` outside `docs/`              | CI fails — block merge |
| **Error**   | Missing document header            | CI fails — block merge |
| **Warning** | Broken internal link               | CI warns — log only    |
| **Warning** | Task in multiple states            | CI warns — log only    |
| **Info**    | AI context file older than 30 days | CI info — notify       |

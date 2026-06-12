# Documentation File Placement Rules

**Version**: 1.0.0
**Status**: Active and Enforced
**ADR Reference**: [ADR-0004](../decisions/ADR-0004.md)

---

## Rule 1: Documentation Root

The **only** authorized documentation root is:

```
docs/
```

All Markdown documents (`.md`, `.mdx`) describing the project MUST live under `docs/`.

---

## Rule 2: Allowed Exceptions

The following files are permitted **outside** `docs/` with strict restrictions:

| File           | Location             | Reason                                                        | Editable? |
| -------------- | -------------------- | ------------------------------------------------------------- | --------- |
| `README.md`    | Repository root only | GitHub convention entry point — must link to `docs/README.md` | Yes       |
| `AGENTS.md`    | Repository root only | AI tooling configuration — NOT project documentation          | Yes       |
| `CHANGELOG.md` | Repository root only | Auto-generated from `docs/changelogs/` — do not hand-edit     | No        |

**No other `.md` or `.mdx` files are allowed outside `docs/`.**

---

## Rule 3: Internal docs/ Placement

Within `docs/`, each document must live in the correct subdirectory:

| Document Type          | Correct Location                 |
| ---------------------- | -------------------------------- |
| Architecture diagrams  | `docs/architecture/`             |
| Module documentation   | `docs/modules/`                  |
| Package (`@gv/*`) docs | `docs/packages/`                 |
| Setup guides           | `docs/development/`              |
| Coding standards       | `docs/development/`              |
| Deployment guides      | `docs/deployment/`               |
| Runbooks / alerts      | `docs/operations/`               |
| Active plans           | `docs/planning/active-plans/`    |
| Completed plans        | `docs/planning/completed-plans/` |
| Archived plans         | `docs/planning/archived-plans/`  |
| Task backlog           | `docs/tracking/backlog.md`       |
| In-progress tasks      | `docs/tracking/in-progress.md`   |
| Bug reports            | `docs/tracking/bugs/`            |
| Feature tracking       | `docs/tracking/features/`        |
| Code change logs       | `docs/tracking/code-changes/`    |
| ADRs                   | `docs/decisions/ADR-XXXX.md`     |
| System changelogs      | `docs/changelogs/`               |
| Implementation reports | `docs/reports/implementation/`   |
| Migration reports      | `docs/reports/migrations/`       |
| Audit reports          | `docs/audits/`                   |
| AI context summaries   | `docs/ai-context/`               |
| Governance rules       | `docs/governance/`               |
| Auto-generated docs    | `docs/generated/`                |

---

## Rule 4: Naming Conventions

- Use **kebab-case** for all filenames: `my-document.md`
- ADRs: `ADR-XXXX.md` (4-digit zero-padded number)
- Plans: `YYYY-MM-DD-short-title.md`
- Reports: `YYYY-MM-DD-report-name.md`
- Changelogs: lowercase subsystem name, e.g., `frontend.md`

---

## Rule 5: Document Header Requirements

Every document MUST have a header block:

```markdown
# Document Title

> **Source**: `docs/section/filename.md`
> **Status**: Active | Deprecated | Draft
> **Last Updated**: YYYY-MM-DD
```

---

## Rule 6: Enforcement

The script `packages/shared/scripts/validate-docs.ts` (run via `npm run validate:docs`) enforces these rules.

**CI will FAIL if:**

- A `.md` or `.mdx` file is found outside `docs/` (excluding the 3 exceptions)
- A document is missing its header block
- A broken internal link is detected

---

## Rule 7: Governance Override

If a special case requires creating a `.md` file outside `docs/`, it MUST:

1. Be explicitly approved and documented in `docs/governance/exceptions.md`
2. Reference the ADR or decision that authorized it
3. Include an expiry date after which it must be migrated to `docs/`

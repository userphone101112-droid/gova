# Contribution Rules

> **Source**: `docs/governance/contribution-rules.md`
> **Status**: Active
> **Last Updated**: 2026-06-12

---

## Before You Start

1. Read [docs/governance/documentation-rules.md](./documentation-rules.md)
2. Read [docs/governance/file-placement-rules.md](./file-placement-rules.md)
3. Read [docs/development/coding-standards.md](../development/coding-standards.md)
4. Check [docs/tracking/in-progress.md](../tracking/in-progress.md) — don't duplicate work

---

## Development Flow

```
1. Pick a task from docs/tracking/backlog.md
2. Move task entry to docs/tracking/in-progress.md
3. Create a branch: type/short-description
4. Write code
5. Run: npm run typecheck && npm run validate:docs && npm run validate:ssot
6. Update the relevant changelog in docs/changelogs/
7. Move task to docs/tracking/completed.md
8. Submit PR with references to task and any ADR
```

---

## Documentation Obligations

Every code contribution MUST:

| Contribution Type      | Documentation Required                                                  |
| ---------------------- | ----------------------------------------------------------------------- |
| New feature            | Update `docs/tracking/features/<name>.md`                               |
| New `@gv/*` package    | Create `docs/packages/<package-name>.md`                                |
| API contract change    | Update `docs/modules/backend-api.md` + `docs/changelogs/backend.md`     |
| Database schema change | Update `docs/changelogs/database.md` + create migration report          |
| Architectural decision | Create new ADR in `docs/decisions/ADR-XXXX.md`                          |
| Bug fix                | Move from `docs/tracking/bugs/open.md` to `docs/tracking/bugs/fixed.md` |

---

## Code Quality Checklist

Before submitting a PR:

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run validate:ssot` passes
- [ ] `npm run validate:docs` passes
- [ ] No `.md` files created outside `docs/`
- [ ] No hardcoded strings (use `@gv/translations`)
- [ ] No hardcoded colors (use `@gv/theme` CSS vars)
- [ ] No duplicate DTOs (use `@gv/contracts`)
- [ ] No magic numbers (use `@gv/business-rules`)
- [ ] Changelog updated
- [ ] Tests written for new business logic

---

## PR Description Template

```markdown
## Summary

Brief description of what this PR does.

## Related

- Task: docs/tracking/in-progress.md#task-id
- ADR: docs/decisions/ADR-XXXX.md (if applicable)
- Bug: docs/tracking/bugs/open.md#bug-id (if applicable)

## Changes

- List of files changed
- Reason for each change

## Testing

- How was this tested?

## Documentation Updated

- [ ] Changelog updated
- [ ] ADR created (if needed)
- [ ] AI context updated (if architecture changed)
```

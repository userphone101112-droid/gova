# Governance Overview

> **Source**: `docs/governance/README.md`
> **Status**: Active
> **Last Updated**: 2026-06-12

---

## Governance Documents

| File                                                 | Purpose                                         |
| ---------------------------------------------------- | ----------------------------------------------- |
| [documentation-rules.md](./documentation-rules.md)   | Core rules: what, where, when to document       |
| [file-placement-rules.md](./file-placement-rules.md) | Exact locations for every document type         |
| [naming-rules.md](./naming-rules.md)                 | File, symbol, branch, commit naming conventions |
| [agent-rules.md](./agent-rules.md)                   | Rules for AI agents operating in this repo      |
| [contribution-rules.md](./contribution-rules.md)     | Developer contribution workflow and obligations |

---

## Enforcement

Documentation governance is enforced via:

1. **`npm run validate:docs`** — local validation script
2. **CI pipeline** — blocks merge on violations
3. **Pre-commit hook** — Husky checks for stray markdown files

---

## Exception Process

If a special case genuinely requires a `.md` file outside `docs/`:

1. Open a PR with justification
2. Get approval from a senior engineer
3. Document the exception in `docs/governance/exceptions.md`
4. Set an expiry date for migration

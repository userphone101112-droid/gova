# Naming Conventions Rules

> **Source**: `docs/governance/naming-rules.md`
> **Status**: Active
> **Last Updated**: 2026-06-12

---

## File Naming

| Type          | Format                      | Example                        |
| ------------- | --------------------------- | ------------------------------ |
| General docs  | `kebab-case.md`             | `getting-started.md`           |
| ADRs          | `ADR-XXXX.md`               | `ADR-0005.md`                  |
| Plans         | `YYYY-MM-DD-short-title.md` | `2026-06-12-ssot-migration.md` |
| Reports       | `YYYY-MM-DD-report-name.md` | `2026-06-12-ssot-audit.md`     |
| Changelogs    | `subsystem.md`              | `frontend.md`, `backend.md`    |
| Bug files     | `state.md`                  | `open.md`, `fixed.md`          |
| Feature files | `feature-name.md`           | `user-authentication.md`       |

---

## Directory Naming

- All directories use `kebab-case`
- No uppercase in directory names
- No spaces in directory names

---

## Code Symbol Naming

| Symbol                      | Format                      | Example              |
| --------------------------- | --------------------------- | -------------------- |
| TypeScript types/interfaces | `PascalCase`                | `UserResponseDTO`    |
| TypeScript enums            | `PascalCase`                | `UserRole`           |
| TypeScript functions        | `camelCase`                 | `getTranslation()`   |
| TypeScript constants        | `SCREAMING_SNAKE_CASE`      | `BUSINESS_RULES`     |
| CSS variables               | `--kebab-case`              | `--color-primary`    |
| Zod schemas                 | `camelCase` + Schema suffix | `createUserSchema`   |
| React components            | `PascalCase`                | `ProductCard`        |
| Zustand stores              | `camelCase` + Store suffix  | `useAuthStore`       |
| npm packages                | `@gv/kebab-case`            | `@gv/business-rules` |

---

## Commit Message Naming

Format: `type(scope): description`

```
feat(auth): add JWT refresh token endpoint
fix(frontend): resolve RTL layout overflow
docs(governance): add naming rules document
chore(packages): upgrade @gv/theme to v1.1.0
refactor(domain): move email value object to @gv/domain
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`

---

## Branch Naming

Format: `type/short-description`

```
feat/user-authentication
fix/rtl-overflow
docs/governance-system
chore/upgrade-dependencies
```

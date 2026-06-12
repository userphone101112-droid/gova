# SSOT Summary

Quick reference for AI agents to understand the SSOT (Single Source of Truth) architecture.

## SSOT Packages

16 shared packages in `packages/` directory with `@gv/*` naming convention.

## Key SSOT Systems

1. **@gv/domain** - Domain entities and value objects
2. **@gv/contracts** - API contracts and DTOs
3. **@gv/schemas** - Validation schemas
4. **@gv/business-rules** - Business constants and limits
5. **@gv/theme** - Design tokens and theming
6. **@gv/translations** - UI translations
7. **@gv/localization** - Locale detection and RTL support
8. **@gv/auth** - Authentication package
9. **@gv/branding** - Branding package
10. **@gv/config** - Configuration package
11. **[6 more packages]** - Additional shared packages

## Package Structure

```
packages/
├── domain/          # Domain entities and value objects
├── contracts/       # API DTOs (SSOT)
├── schemas/        # Validation schemas (SSOT)
├── business-rules/  # Business constants (SSOT)
├── theme/          # Design tokens (SSOT)
├── translations/   # UI translations (SSOT)
├── localization/   # Locale utilities (SSOT)
├── auth/           # Authentication package
├── branding/       # Branding package
├── config/         # Configuration package
└── [6 more packages]
```

## Documentation

- SSOT architecture: [../architecture/ssot-architecture.md](../architecture/ssot-architecture.md)
- Domain models: [../architecture/domain-models.md](../architecture/domain-models.md)
- Business rules: [../modules/business-rules-system.md](../modules/business-rules-system.md)
- Contracts: [../modules/contracts-system.md](../modules/contracts-system.md)
- Theme: [../modules/theme-system.md](../modules/theme-system.md)
- Localization: [../modules/localization-system.md](../modules/localization-system.md)

## Governance

All SSOT changes must:
1. Update relevant changelog in `docs/changelogs/packages.md`
2. Reference related ADRs
3. Follow package governance rules
4. Never define DTOs locally - always import from @gv/contracts
5. Never use magic numbers - always reference @gv/business-rules

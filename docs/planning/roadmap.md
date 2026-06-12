# Project Roadmap

> **Source**: `docs/planning/roadmap.md`
> **Status**: Active
> **Last Updated**: 2026-06-12

---

## Vision

Build a production-ready, multi-tenant, white-label marketplace platform powered by a clean SSOT architecture.

---

## Phase 1: Foundation (✅ Complete)

| Milestone                                      | Status  | ADR                                  |
| ---------------------------------------------- | ------- | ------------------------------------ |
| Clean + Hexagonal Architecture setup (Fastify) | ✅ Done | [ADR-0001](../decisions/ADR-0001.md) |
| SSOT Package Ecosystem (16 `@gv/*` packages)   | ✅ Done | [ADR-0002](../decisions/ADR-0002.md) |
| Database Adapter Pattern (SQLite / Turso)      | ✅ Done | [ADR-0003](../decisions/ADR-0003.md) |
| Documentation Governance System                | ✅ Done | [ADR-0004](../decisions/ADR-0004.md) |
| Next.js 16 Frontend with Tailwind v4           | ✅ Done | —                                    |
| JWT Authentication (Fastify)                   | ✅ Done | —                                    |
| Image Upload System with Cloud Storage         | ✅ Done | —                                    |

---

## Phase 2: Core Features (🔄 In Progress)

| Milestone                                   | Status         | Target  |
| ------------------------------------------- | -------------- | ------- |
| User Authentication (Register + Login)      | 🔄 In Progress | Q3 2026 |
| Product CRUD (Create, Read, Update, Delete) | ⬜ Planned     | Q3 2026 |
| Merchant Profiles                           | ⬜ Planned     | Q3 2026 |
| Category System                             | ⬜ Planned     | Q3 2026 |
| Image Upload UI (Frontend)                  | ⬜ Planned     | Q3 2026 |
| Design System Components (Full Library)     | ⬜ Planned     | Q3 2026 |

---

## Phase 3: Marketplace Features (⬜ Planned)

| Milestone              | Status     | Target  |
| ---------------------- | ---------- | ------- |
| Order System           | ⬜ Planned | Q4 2026 |
| Search & Filtering     | ⬜ Planned | Q4 2026 |
| Review & Rating System | ⬜ Planned | Q4 2026 |
| Notifications          | ⬜ Planned | Q4 2026 |
| Analytics Dashboard    | ⬜ Planned | Q4 2026 |

---

## Phase 4: Multi-Tenant / White-Label (⬜ Planned)

| Milestone                     | Status     | Target  |
| ----------------------------- | ---------- | ------- |
| Tenant Configuration System   | ⬜ Planned | Q1 2027 |
| Per-Tenant Theme Overrides    | ⬜ Planned | Q1 2027 |
| Per-Tenant Feature Flags      | ⬜ Planned | Q1 2027 |
| Multi-Brand Branding System   | ⬜ Planned | Q1 2027 |
| Admin Dashboard (Super Admin) | ⬜ Planned | Q1 2027 |

---

## Phase 5: Production Hardening (⬜ Planned)

| Milestone                                | Status     | Target  |
| ---------------------------------------- | ---------- | ------- |
| Comprehensive Test Suite (>80% coverage) | ⬜ Planned | Q1 2027 |
| Performance Optimization                 | ⬜ Planned | Q2 2027 |
| Security Audit                           | ⬜ Planned | Q2 2027 |
| Production Deployment Pipeline           | ⬜ Planned | Q2 2027 |
| Mobile App (React Native)                | ⬜ Planned | Q2 2027 |

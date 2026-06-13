# @gv/governance-gate

Governance Gate - The mandatory entry point for all changes before implementation.

## Purpose

The Governance Gate enforces governance BEFORE implementation starts. No feature, page, route, API, form, schema, contract, translation, permission, database entity, storage provider, or infrastructure change should begin without Governance Gate approval.

## Core Principle

Before any implementation:

1. What is being changed?
2. Which SSOTs are affected?
3. Which workflows apply?
4. Which documents must be updated?
5. Which validations are required?
6. Which approvals are required?

Only then can implementation begin.

## Usage

### Create a Governance Gate

```bash
npm run governance:plan -- --title "New Product Page" --description "Create a new product listing page with search and filters" --requester "developer"
```

### Approve a Gate

```bash
npm run governance:approve -- --gate-id "GATE-2026-0001" --approver "frontend-lead"
```

### Run Preflight Validation

```bash
npm run governance:preflight -- --gate-id "GATE-2026-0001"
```

## Structure

- `registry/` - Gate record storage
- `analyzers/` - Change classification engine
- `workflows/` - Workflow definitions
- `approvals/` - Approval engine
- `validators/` - Pre-implementation validators
- `reports/` - Report generators
- `policies/` - Governance policies
- `engine/` - Main orchestration
- `cli/` - Command-line interface

## Change Categories

- new-feature
- new-page
- new-route
- new-form
- new-api
- new-schema
- new-contract
- new-translation
- new-permission
- new-business-rule
- new-database-entity
- storage-change
- infrastructure-change
- documentation-change
- bug-fix
- refactor
- performance
- security
- other

## Risk Levels

- low
- medium
- high
- critical

## Gate Status

- pending
- approved
- rejected
- in-progress
- completed
- cancelled

# @gv/governance-firewall

Governance Firewall - Hard execution enforcement layer that blocks unauthorized operations.

## Purpose

The Governance Firewall is NOT a validation tool. It is an EXECUTION FIREWALL that:

- Blocks unauthorized operations
- Enforces governance before execution
- Prevents SSOT violations
- Auto-rolls back violations
- Logs all violations

## Core Principle

**NO OPERATION MAY EXECUTE WITHOUT FIREWALL APPROVAL**

The firewall sits ABOVE all execution systems:

```
Operation → Firewall → Governance Gate → Execution
```

If the firewall blocks, execution NEVER happens.

## Usage

### Set Gate ID

```bash
export GATE_ID="GATE-2026-0001"
```

### Run with Firewall

```bash
# All npm scripts automatically include firewall preflight
npm run dev
npm run build
npm run test
```

### Manual Firewall Check

```typescript
import { getFirewall } from '@gv/governance-firewall';

const firewall = getFirewall();
firewall.setGateId('GATE-2026-0001');

const result = await firewall.preflight('operation-name', context);

if (!result.allowed) {
  console.error('Blocked:', result.violation);
  process.exit(1);
}
```

## Enforcement Modes

### HARD Mode (GOVERNANCE_MODE=HARD)

- All operations blocked without gate approval
- No bypass allowed
- No direct execution allowed

### STRICT Mode

- Gate required for all operations
- SSOT violations blocked
- Auto-rollback enabled

### LENIENT Mode

- Gate recommended but not required
- SSOT violations logged but not blocked
- No auto-rollback

## Block Rules

The firewall blocks:

- Creating page.tsx without Pages SSOT
- Creating route without Routes SSOT
- Creating schema outside @gv/schemas
- Creating translation without Translations SSOT
- Creating DTO outside @gv/contracts
- Implementing feature without Features SSOT
- Defining permission without Permissions SSOT
- Creating form without Forms SSOT

## Violation Logging

All violations are logged to:

```
docs/audits/governance-violations/
```

Each violation includes:

- Timestamp
- Operation
- Violation type
- Severity
- Suggested fix
- Gate ID (if applicable)

## Auto-Rollback

When a violation is detected, the firewall can:

- Revert changed files
- Cancel operation
- Restore last valid state
- Log rollback event

## Integration Points

- **Package.json scripts**: All scripts include firewall preflight
- **Git hooks**: pre-commit and pre-push enforce firewall
- **CI/CD**: GitHub Actions enforce firewall before build
- **File system watcher**: Daemon monitors for unauthorized changes
- **Runtime guard**: Wraps Node.js, Next.js, build, test execution

## Success Criteria

The repository is valid only if:

- No code executes without firewall approval
- No commit passes without preflight
- No CI/CD builds without validation
- No file changes persist without governance approval
- No SSOT violation is possible without detection and blocking

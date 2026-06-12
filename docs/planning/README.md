# Planning SSOT

This is the Single Source of Truth for all project planning.

## Structure

- **[roadmap.md](./roadmap.md)** - Overall project roadmap
- **[active-plans/](./active-plans/)** - Currently active implementation plans
- **[completed-plans/](./completed-plans/)** - Completed implementation plans
- **[archived-plans/](./archived-plans/)** - Archived/cancelled plans

## Governance Rules

1. All plans MUST be stored in this directory
2. No plan files may exist outside this structure
3. Every plan must reference related ADRs
4. Every plan must track related tasks in `docs/tracking/`
5. Plans must be moved to appropriate folders as their status changes

## Plan Template

When creating a new plan, use the following structure:

```markdown
# PLAN-XXXX: [Plan Title]

## Status
- Status: [Active/Completed/Archived]
- Created: [Date]
- Updated: [Date]
- Owner: [Name/Team]

## Overview
[Brief description of what this plan achieves]

## Related ADRs
- [ADR-XXXX](../decisions/ADR-XXXX.md)

## Related Tasks
- [Task ID](../tracking/in-progress.md)

## Implementation Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Risks & Mitigations
- [Risk]: [Mitigation]

## Dependencies
- [Dependency 1]
- [Dependency 2]
```

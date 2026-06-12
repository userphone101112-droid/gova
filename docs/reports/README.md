# Reports SSOT

This is the Single Source of Truth for all implementation reports, migration logs, release notes, audit reports, and incident reports.

## Structure

- **[implementation/](./implementation/)** - Implementation reports for major features
- **[migrations/](./migrations/)** - Database and system migration reports
- **[releases/](./releases/)** - Release notes and summaries
- **[audits/](./audits/)** - System audit reports
- **[incident-reports/](./incident-reports/)** - Incident reports and post-mortems

## Governance Rules

1. Every major implementation must generate a report
2. Every migration must be documented
3. Every release must have release notes
4. Every incident must have a post-mortem
5. All reports must reference related ADRs, plans, and tasks

## Report Template

```markdown
# REPORT-XXXX: [Report Title]

## Type
[Implementation/Migration/Release/Audit/Incident]

## Date
[Date]

## Author
[Name]

## Related ADRs
- [ADR-XXXX](../decisions/ADR-XXXX.md)

## Related Plans
- [PLAN-XXXX](../planning/active-plans/PLAN-XXXX.md)

## Related Tasks
- [TASK-ID](../tracking/completed.md)

## Summary
[Brief summary of the report]

## Details
[Detailed information]

## Outcomes
- [Outcome 1]
- [Outcome 2]

## Lessons Learned
- [Lesson 1]
- [Lesson 2]
```

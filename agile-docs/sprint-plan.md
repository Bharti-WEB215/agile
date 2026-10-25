# Sprint plan and completion record

This is a proposed sequence derived from repository gaps, not evidence that Agile ceremonies or dated sprints occurred.

## Sprint A — Restore repeatable verification (proposed)

**Goal:** make installs, tests, static checks, and builds reproducible. Fix package manifest/lock mismatches and current compile/test failures. Add mocked tests for server-side price calculation, quantities, allowed status transitions, and table session settlement. **Exit:** actual local command output is recorded; CI workflow passes on the repository branch.

## Sprint B — Complete delivery workflow (proposed)

**Goal:** verify Docker Compose startup and improve process documentation/templates. Add a real issue/PR workflow if a remote repository and project board are configured. **Exit:** documented build/start/health checks pass and work items link to real review artifacts.

## Sprint C — Access control and release readiness (proposed)

**Goal:** implement authentication/authorization, verify role boundaries, and conduct an end-to-end cashier/customer/kitchen flow with a disposable database. **Exit:** security and regression checks pass; release only after authorized review and deployment configuration.

## Current evidence

No completed sprint dates, team velocity, burndown, review ceremonies, deployment, release tag, or GitHub Actions run are recorded by this plan. See `baseline-report.md` for command results observed during this work.

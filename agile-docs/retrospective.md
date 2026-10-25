# Retrospective

## Evidence available for this pass

This is a code and workflow review, not a record of team ceremonies. No sprint review, stand-up, stakeholder feedback session, or production deployment was evidenced in the repository. The checked-out branch already contained extensive uncommitted modifications at inspection time; these were preserved.

## Observations

- Useful groundwork exists: the app has QR ordering/table session code, Docker configuration, CI workflow, and initial tests.
- Verification was not reproducible at the start: test executables were unavailable; backend TypeScript checks reported errors; frontend fixtures did not match the current `CartItem` interface.
- Several draft Agile docs described tests, PR reviews, Docker builds, and performance metrics as completed without supporting artifacts. Future updates should record command output or link to the actual PR/run rather than assume completion.

## Actions

1. Fix install and CI reproducibility, then record real test/build outputs.
2. Add focused mocked billing/status/session tests without requiring a production database.
3. Prioritize API authentication and authorization before deploying outside a trusted local environment.
4. Keep backlog status evidence-based; label work planned until verified.

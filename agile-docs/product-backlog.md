# Product backlog

Updated: 2026-10-25. Status describes repository evidence at the time of inspection; planned means not verified as complete.

| Priority | Story | Acceptance criteria | Estimate | Status |
| --- | --- | --- | ---: | --- |
| Must | As cashier, I can create an order using current menu prices | Server loads active products and calculates totals from stored prices; invalid quantities/products are rejected | 8 | Implemented in working tree; price, quantity, and transition behavior partially tested |
| Must | As operator, I can move orders through valid kitchen states | Only permitted state transitions succeed and invalid transitions return a client error | 5 | Implemented in working tree; price, quantity, and transition behavior partially tested |
| Must | As customer, I can order through an active table QR code | Token resolves to an active table; order is saved and awaits cashier approval | 8 | Implemented in working tree; full flow not verified |
| Must | As cashier, I can settle a table session | Current session orders are listed and combined into a total; settlement starts a new session | 5 | Session summary tested; settlement persistence not verified |
| Must | As operator, I can use the app without unauthorized changes | Login, authentication, and role-based API authorization | 13 | Planned; not present in current API |
| Should | As maintainer, I can run quality checks reproducibly | Lockfile installs work; backend/frontend tests, lint/type checks, and builds pass locally; CI run is confirmed | 8 | Local checks pass; remote CI not run |
| Should | As developer, I can start the stack consistently | Docker images build and all services become healthy with safe local defaults | 8 | Docker build and all Compose services verified healthy |
| Could | As manager, I can export reports | Sales reports export to CSV with correct totals | 5 | Planned |
| Could | As team, I can inspect real delivery progress | Jira issues link to branches/PRs and report actual state, assignee, due date, and blockers | 3 | Jira workflow documented; no Jira site/project connected or verified |

## Ready criteria

A story has a named owner, priority, measurable acceptance criteria, dependencies, and estimate before work starts. Estimates are planning inputs, not completed-work metrics.





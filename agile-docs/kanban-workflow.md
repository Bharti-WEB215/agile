# Kanban workflow

## Columns and WIP limits

| Stage | WIP limit | Entry policy |
| --- | ---: | --- |
| Backlog | — | Captured request, not yet refined |
| Ready | 5 | Priority, owner, estimate, dependencies, and acceptance criteria are clear |
| In Progress | 2 | Owner starts implementation; work is linked to a branch |
| Code Review | 2 | Change is reviewable, with verification details and a PR |
| Testing | 2 | Review feedback resolved; acceptance checks are being run |
| Done | — | Acceptance criteria met, CI green, docs updated, and review approved |

A Jira issue should include status, priority, assignee, due date (or explicitly none), acceptance criteria, and links to branch/PR where available. Keep the repository Jira key in branch names, commit subjects, and PR titles so Jira can associate development activity with the issue. Do not invent an assignee, due date, or board state when no board is connected.

## Blocked work

Add a `Blocked` label and record the reason, blocker owner, date identified, and next action. A blocked card continues to count against its column WIP. Revisit it during replenishment and move it back to Backlog if its scope or dependencies need redefinition.

## Done gate

All acceptance criteria are demonstrated; automated checks pass; review comments are resolved; secrets and real customer/payment data are absent; operational and user docs are updated. A written policy does not mean a live board or ceremony has been run.

# Jira and GitHub workflow

## Connected workspace

- Jira site: [chini-sot.atlassian.net](https://chini-sot.atlassian.net)
- Jira project: **Team Astro** (`SCRUM`)
- GitHub repository connected through GitHub for Atlassian: [`Bharti-WEB215/agile`](https://github.com/Bharti-WEB215/agile)
- The integration is scoped to the `agile` repository. Jira opens from the RestoPOS home page and the shared application header.

The Jira link is a workspace shortcut. The RestoPOS browser app does not call Jira APIs or display live Jira issue data. Do not add Jira API tokens or credentials to this repository. Jira issues and statuses must be checked in Jira itself.

## Work item flow

1. Create or refine a Jira issue with a summary, acceptance criteria, priority, and owner.
2. Use its issue key in the branch name, commit subject, and pull request title or description. Example: `feature/SCRUM-123-table-session` and `SCRUM-123 feat: settle table session`.
3. Open a pull request against `main` and include the Jira key and issue link.
4. Move the issue through the agreed Jira workflow as work progresses. Mark it Done only after acceptance criteria, review, and required checks are complete.

Use `N/A` in the PR template only for maintenance work that genuinely has no Jira issue. Never invent an issue key or report a Jira status that has not been confirmed in Jira.

## Board setup

Recommended issue types are Epic, Story, Task, and Bug. Suggested board columns are Backlog, Ready, In Progress, Code Review, Testing, and Done, with WIP limits documented in [kanban-workflow.md](kanban-workflow.md). Keep status mappings and required fields aligned with the team's actual Jira configuration. The repository connection does not automatically create issues or change Jira workflow settings.

## Connection status

The Jira site and `SCRUM` project were verified, and the Atlassian GitHub integration confirmed the `Bharti-WEB215/agile` repository connection. The RestoPOS app provides a direct project shortcut; no credentials or live Jira API integration are present in the app.

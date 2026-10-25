# Jira and GitHub workflow

## Repository link

The repository is `Bharti-WEB215/agile`. The codebase is Jira-ready, but no Jira site, project key, or linked project has been confirmed yet. Connect the Jira project to the GitHub repository with Atlassian's GitHub integration from the Jira workspace, and grant it access to this repository. Do not put Jira API tokens or credentials in this repository.

## Work item flow

1. Create or refine a Jira issue with a summary, acceptance criteria, priority, and owner.
2. Use its issue key in the branch name, commit subject, and pull request title or description. Example: `feature/POS-123-table-session` and `POS-123 feat: settle table session`.
3. Open a pull request against `main` and include the Jira key and issue link.
4. Move the issue through the agreed Jira workflow as work progresses. Mark it Done only after acceptance criteria, review, and required checks are complete.

Use `N/A` in the PR template only for maintenance work that genuinely has no Jira issue. Never invent an issue key or report a Jira status that has not been confirmed in Jira.

## Board setup

Recommended issue types are Epic, Story, Task, and Bug. Suggested board columns are Backlog, Ready, In Progress, Code Review, Testing, and Done, with WIP limits documented in [kanban-workflow.md](kanban-workflow.md). Keep status mappings and required fields aligned with the team's actual Jira configuration; these recommendations do not mean that a board has been created.

## Current connection status

No live Jira project or board has been connected or verified. Once the Atlassian account is connected in Codex and the Jira project key/site are available, Jira issues and project details can be added to the actual backlog.

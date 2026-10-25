# Git workflow

## Branches and changes

- The GitHub repository default branch is `main`; keep it as the stable integration branch. Use the feature branch for this project enhancement and open a PR targeting `main`.
- Use `feature/<JIRA-KEY>-<short-topic>` for scoped enhancements and `fix/<JIRA-KEY>-<short-topic>` for defects when a Jira issue exists (for example, `feature/POS-123-table-session`).
- Include the Jira key in commit subjects and PR titles, for example `POS-123 feat: settle table session`.
- Do not amend shared history, force-push, or push without explicit authorization.

## Pull requests

Open a PR against `main`, link its Jira issue, summarize behavior and risk, list verification actually performed, and include screenshots for UI changes. Require CI checks and a human review before merge. Templates live in `.github/pull_request_template.md` and `.github/ISSUE_TEMPLATE/`.

## Release

Create a version tag only after an approved release has passed tests, build, and deployment checks. `origin` is configured as `https://github.com/Bharti-WEB215/agile.git`. The project is on `feature/agile-devops-enhancement`; keep the remote `main` branch as the integration target.



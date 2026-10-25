# Git workflow

## Branches and changes

- The GitHub repository default branch is `main`; keep it as the stable integration branch. Use the feature branch for this project enhancement and open a PR targeting `main`.
- Use `feature/<short-topic>` for scoped enhancements and `fix/<short-topic>` for defects.
- Use small Conventional Commit messages such as `fix(orders): reject non-positive quantities`.
- Do not amend shared history, force-push, or push without explicit authorization.

## Pull requests

Open a PR against `main`, link its backlog item, summarize behavior and risk, list verification actually performed, and include screenshots for UI changes. Require CI checks and a human review before merge. Templates live in `.github/PULL_REQUEST_TEMPLATE.md` and `.github/ISSUE_TEMPLATE/`.

## Release

Create a version tag only after an approved release has passed tests, build, and deployment checks. `origin` is configured as `https://github.com/Bharti-WEB215/agile.git`. The remote `main` branch was fetched and preserved; the feature changes have not yet been committed or pushed.



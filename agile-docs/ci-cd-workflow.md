# CI/CD workflow

`.github/workflows/ci.yml` runs on pushes to `main`, `master`, and `feature/*`, and pull requests targeting `main` or `master`. It installs dependencies with `npm ci`, generates Prisma Client, type-checks and tests the backend, tests and builds the frontend, then builds both Docker images.

The workflow is a CI build gate only. No deployment target or release credentials are configured. CI has not been observed running on GitHub for this branch; local checks and their results are recorded in `baseline-report.md`. Branch protection must be enabled in repository settings if passing checks are to be required before merge.

Each package needs a lockfile kept in sync with its manifest for `npm ci`. Docker jobs use no secrets and do not publish images.

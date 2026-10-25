# Definition of Done

A story can move to Done when:

- Its acceptance criteria are met and demonstrated with appropriate tests or a recorded manual check.
- Relevant backend/frontend tests, type checks, lint, and production build pass; exceptions are documented rather than hidden.
- API inputs, error handling, and database changes are reviewed; server-calculated financial values remain authoritative.
- A reviewer approves the change and CI is green when a PR workflow is available.
- Docs and placeholder-only environment examples are updated.
- No secrets, real customer data, or payment-card information are included.
- Any Docker/deployment requirement is verified in the target environment; no deployment is claimed from a local build.

For a release, verify Prisma schema, Docker health checks, and the end-to-end cashier/customer/kitchen flow against a disposable database. Do not mark work Done solely because documentation or scaffolding exists.

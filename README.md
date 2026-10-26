# Restaurant POS

React/Vite frontend, Express/Prisma API, and PostgreSQL database. Supabase-hosted PostgreSQL is supported through the Prisma connection variables.

## Local development

Requirements: Node.js 20.6+, npm, and PostgreSQL (or a Supabase PostgreSQL database). For local development without Docker or PostgreSQL, use the SQLite demo mode below.

1. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and `DIRECT_URL` for your database. Never commit `.env` files.
2. In `backend/`, run `npm ci`, `npm run prisma:generate`, `npm run prisma:push`, then `npm run dev`.
3. In `frontend/`, run `npm ci` and `npm run dev`. Set `VITE_API_BASE_URL` only when the API is not reachable through the Vite proxy/configuration.

### Local demo mode without Docker

In `backend/`, copy `local.env.example` to `.env.local`, then run `npm run local:setup` once and `npm run dev:local`. This uses a persistent SQLite file at `backend/prisma/local.db` and seeds the sample menu, tables, and order. Start the frontend as usual with `npm run dev` from `frontend/`. PostgreSQL remains the production and Docker database.

## Docker

Copy `.env.example` to `.env`, replace the local PostgreSQL password placeholder, then run `docker compose up --build`. Open <http://localhost:3000>; the API health endpoint is <http://localhost:3002/api/health>. Stop with `docker compose down`; use `docker compose down -v` only when you intentionally want to delete the local database volume.

Compose starts a local PostgreSQL service. It does not replace Supabase in hosted deployments. Change placeholder credentials for any shared environment.

## Quality checks

Run `npm test` and `npm run lint` in `backend/`; run `npm test`, `npm run lint`, and `npm run build` in `frontend/`. See [Agile project documentation](agile-docs/) for scope, current verification status, Jira setup, and planned work.

## Current limitations

Authentication and role-based access control are not present in the current API. Do not expose it to an untrusted network until authorization is implemented. Automated coverage is currently limited; see `agile-docs/baseline-report.md` for verified status and open issues.

# Docker setup

`docker-compose.yml` defines PostgreSQL, the Express API, and the Nginx-hosted Vite build. Compose persists PostgreSQL in the named `postgres_data` volume and waits for service health checks.

1. Copy `.env.example` to `.env` and replace `POSTGRES_PASSWORD` with a local development password.
2. Start the stack with `docker compose up --build`.
3. Open `http://localhost:3000`; check the API at `http://localhost:3002/api/health`.
4. Stop with `docker compose down`.

`docker compose down -v` deletes the persisted local database volume. Compose's PostgreSQL credentials are for local development. For hosted PostgreSQL/Supabase, configure the backend connection variables and do not use the local database service as a replacement. The root `.env.example` uses placeholders and is not a set of deployment credentials.

Troubleshooting: inspect `docker compose logs backend`, `docker compose logs frontend`, or `docker compose logs postgres`; confirm Docker Desktop's Linux engine is running and host ports 3000, 3002, and 5433 are available. Docker image build and Compose startup were verified. All three long-running services reached healthy status; schema push and synthetic demo seeding ran automatically through `db-init`.


# Testing strategy

## Current coverage

Backend tests cover API health, request validation, server-side order price calculation, zero-quantity rejection, invalid status transitions, and active table-session totals. Frontend tests cover currency formatting, cart totals, and status/payment helper utilities. These tests do not prove full database behavior or complete user journeys.

## Layers

1. **Unit:** pure currency, quantity, tax/discount, and state transition rules. Keep financial arithmetic decimal-safe.
2. **API integration:** Express handlers with Prisma mocked for success, error, and authorization paths. Use synthetic data only. No production database.
3. **UI component:** React Testing Library for cart, order card, customer menu, and table workflows; only utility tests currently exist.
4. **End-to-end:** planned cashier/customer/kitchen journey against a disposable database; not configured.

## Commands

Run `npm test` and `npm run lint` in `backend/`. Run `npm test`, `npm run lint`, and `npm run build` in `frontend/`. Validate schema changes with `npx prisma validate` and `npx prisma generate` from `backend/` (provide placeholder connection variables for schema validation). Docker checks are described in `docker-setup.md`.

## Safety

Use synthetic products and orders only. Never use real customer information or payment-card data. Tests must not connect to a production database.


# Project charter: Restaurant POS

**Status:** Enhancement in progress. **Reviewed:** 2026-10-25.

## Problem

This repository contains a restaurant POS with cashier, kitchen, reports, menu, and table QR workflows. The enhancement work is intended to improve order integrity, testability, reproducible development, and delivery documentation while preserving the existing application.

## Scope

**In scope:** maintain the current React/Vite frontend and Express/Prisma backend; validate order inputs and server-side totals; exercise key business rules with automated tests; support local Docker Compose and hosted PostgreSQL/Supabase configuration; document backlog, workflow, testing, Git, and CI.

**Not yet verified or not in scope for this pass:** production deployment, live GitHub Project/Actions execution, database-backed end-to-end tests, and role-based access control. Authentication is a required future security item before exposing the API to untrusted users.

## Goals

- Make backend/frontend clean installs and checks repeatable.
- Verify prices are recalculated from stored product prices and invalid order transitions are rejected.
- Keep Agile documentation evidence-based and label future work clearly.
- Document how to run locally and with Docker; verify containers when Docker is available.

Current command results and risks are recorded in `baseline-report.md`. Docker startup and remote CI remain unverified.

## Stakeholders

- Restaurant owner or manager: menu, pricing, reports, and operational acceptance.
- Cashier: manual billing, QR order approval, and table settlement.
- Kitchen staff: preparation queue and order status updates.
- Customer: menu browsing and QR order placement.
- Maintainer/developer: implementation, review, testing, and operations.

These are expected user roles based on the application features, not evidence of stakeholder interviews or formal approvals.

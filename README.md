# Habit Tracker API (API Design with Node.js v5 - Reference)

Reference repository for the **API Design with Node.js, v5** Frontend Masters course: [https://frontendmasters.com/courses/api-design-nodejs-v5/](https://frontendmasters.com/courses/api-design-nodejs-v5/). Course notes: [https://api-design-with-node-v5.super.site/](https://api-design-with-node-v5.super.site/). The goal is to document backend API design patterns and implementation choices, not to ship a production app.

## What this project demonstrates
- REST API structure with Express 5 and classic middleware flow (auth, validation, error handling).
- Relational modeling with Drizzle ORM and PostgreSQL, including relations and transactions.
- Request and environment validation with Zod.
- JWT-based authentication (registration, login, token verification middleware).
- Domain-based layering (routes/controllers/db/utils) plus testing with Vitest.

## Technical features
- Node.js with ES Modules and TypeScript (`module: nodenext`) to enforce explicit `.ts` imports and typed APIs.
- Express 5 for routing and middleware; Helmet/CORS/Morgan to cover common security and logging needs.
- Drizzle ORM for typed schema definition in `src/db/schema.ts`, migrations in `migrations/`, and seed data in `src/db/seed.ts`.
- PostgreSQL as the primary database, configured via `DATABASE_URL`.
- Zod for request validation in `src/middlewares/validation.ts` and env validation in `env.ts`.
- `jose` for JWT signing/verification and `bcrypt` for password hashing.
- `custom-env` to load `.env` or `.env.test` based on `APP_STAGE`.
- Vitest for test execution (see `vitest.config.ts`).

## Architecture / Structure
```
src/
  controllers/   # Domain logic (auth, habits)
  db/            # Connection, schema, seed
  middlewares/   # Auth, validation, error handler
  routes/        # Resource routes
  utils/         # JWT and password helpers
  server.ts      # App and middleware wiring
  index.ts       # Server bootstrap
```

## Where to look if you need X
- Auth + JWT: `src/controllers/authController.ts`, `src/utils/jwt.ts`, `src/middlewares/auth.ts`
- Request validation: `src/middlewares/validation.ts`, `src/routes/*.ts`
- Models and relations: `src/db/schema.ts`
- DB connection and reuse: `src/db/connection.ts`
- Migrations and seeds: `migrations/`, `src/db/seed.ts`
- Environment config: `env.ts`, `.env.example`, `.env.test`
- App wiring: `src/server.ts`, `src/index.ts`
- Test setup: `vitest.config.ts`, `tests/`

## Running locally (for reference)
1) Install dependencies: `npm install`
2) Create a database and copy `.env.example` to `.env` (update `DATABASE_URL`, `JWT_SECRET`, etc.)
3) Sync schema:
   - `npm run db:push` (dev/prototyping)
   - `npm run db:migrate` (migrations)
4) Optional seed: `npm run db:seed`
5) Start dev server: `npm run dev`

## Non-goals
- Not production-ready or fully secured.
- No UI or client app.
- No RBAC, refresh tokens, or full auth hardening.
- Some endpoints are placeholders or incomplete (notably in habits/tags/entries).

## Status / Intended use
Reference-only / Learning. Intended for course support and future technical reference.

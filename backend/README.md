# Backend (Node.js + Express)

## Overview
The **backend** is the core of the e‑book e‑commerce system. It exposes a **RESTful API** that powers the mobile app, the admin web UI, and performs **Simple Additive Weighting (SAW)** calculations for recommendation scores. All business logic, authentication, and data persistence live here.

---

---
## Tech Stack
- **Node.js (ESM)** – runtime
- **Express** – HTTP server & router
- **TypeScript** – static typing, strict mode
- **Zod** – schema validation for request bodies & query params
- **Prisma 7** – ORM for PostgreSQL (Supabase)
- **PostgreSQL (Supabase)** – relational data store
- **Supabase Storage** – private bucket for PDF files (access via signed URLs)
- **Vitest** – unit & integration testing framework
- **Swagger (OpenAPI)** – auto‑generated API documentation

---
## Project Structure
```
backend/
├─ src/                     # Source code (ESM modules)
│   ├─ api/                # Express routers per domain
│   │   ├─ auth.ts
│   │   ├─ books.ts
│   │   ├─ orders.ts
│   │   └─ saw.ts
│   ├─ controllers/        # Handler functions – thin, delegating to services
│   ├─ services/           # Business logic (auth, books, orders, SAW)
│   ├─ middleware/         # Auth, error handling, logging
│   ├─ utils/              # Helpers (jwt, validation, supabase client)
│   └─ index.ts            # App bootstrap
├─ prisma/                  # Prisma schema + migration files
│   ├─ schema.prisma
│   └─ migrations/
├─ tests/                   # Vitest test suites
│   ├─ unit/
│   └─ integration/
├─ .env.example            # Template for environment variables
├─ README.md                # This document
├─ package.json
├─ tsconfig.json
└─ vitest.config.ts
```
---
## Environment Variables
| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) | `postgresql://user:password@db.supabase.co:5432/dbname` |
| `SUPABASE_URL` | Supabase REST endpoint | `https://xyz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service‑role key with full storage access | `service_role_key` |
| `JWT_SECRET` | Secret for signing JWTs | `super‑secret‑key` |
| `PORT` | Port the API listens on (default 3000) | `3000` |
| `SAW_WEIGHTS` | JSON string of SAW attribute weights (backend‑only) | `{"price":0.4,"rating":0.3,"popularity":0.3}` |
> **NOTE**: Never commit `.env` or any secret value to the repository.

---
## Setup & Development Workflow
1. **Copy environment file**
   ```powershell
   cp .env.example .env
   # edit .env with your Supabase credentials and JWT secret
   ```
2. **Install dependencies**
   ```powershell
   npm ci   # reproducible install based on lockfile
   ```
3. **Generate Prisma client & run migrations**
   ```powershell
   npx prisma generate
   npx prisma migrate dev --name init   # creates tables in the dev DB
   ```
4. **Run the development server** (hot‑reload)
   ```powershell
   npm run dev   # starts `node --watch src/index.js`
   ```
   API available at `http://localhost:3000`.
5. **Testing**
   ```powershell
   npm test   # runs Vitest unit + integration suites
   ```
6. **Lint & type‑check**
   ```powershell
   npm run lint
   npm run typecheck
   ```
7. **Generate API docs**
   ```powershell
   npm run docs   # serves Swagger UI at /api-docs
   ```
---
## Selected API Endpoints
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user, return JWT |
| `POST` | `/api/auth/register` | Register new user (admin only) |
| `GET`  | `/api/books` | List books with optional filters |
| `GET`  | `/api/books/:id` | Get single book details |
| `POST` | `/api/books` | Create a new book (admin) |
| `PUT`  | `/api/books/:id` | Update book (admin) |
| `DELETE`| `/api/books/:id` | Delete book (admin) |
| `GET`  | `/api/orders` | List orders for authenticated user |
| `POST` | `/api/orders` | Create a new order |
| `GET`  | `/api/saw/recommendations/:userId` | **Backend‑only** – compute SAW scores for a user |
---
## Authentication & Authorization
- **JWT** signed with `JWT_SECRET`. Tokens contain `sub` (user id) and `role` (`admin`, `user`).
- **Role‑based middleware** protects admin routes.
- UI may hide menu items, but **server‑side checks** are mandatory (project rule 5).
---
## SAW (Simple Additive Weighting) Engine
The SAW calculation is performed **exclusively on the backend** to prevent client manipulation of weights (rule 4). The engine:
1. Retrieves candidate books.
2. Normalises each attribute (price, rating, popularity).
3. Applies weights defined in `SAW_WEIGHTS`.
4. Returns a sorted list of recommendations.

The algorithm is implemented in `src/services/saw.ts` and covered by unit tests.
---
## Testing Strategy
- **Unit tests** (`tests/unit/**/*.test.ts`) for services and utilities.
- **Integration tests** (`tests/integration/**/*.test.ts`) spin up an in‑memory SQLite database via Prisma to verify end‑to‑end request handling.
- **API contract tests** using the generated OpenAPI spec.
- Coverage threshold enforced at **90%**.
---
## CI / CD (GitHub Actions)
```yaml
name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
```
The workflow runs lint, type‑check, and test suites on every PR.
---
## Security Considerations
- **Never expose** `.env` or any secret in the repo.
- All endpoints validate input **via Zod** to prevent injection attacks.
- Rate limiting middleware (e.g., `express-rate-limit`) is configured in `src/middleware/rateLimiter.ts`.
- Uploaded PDFs are stored in a **private Supabase bucket**; signed URLs are short‑lived (max 5 min).
---
## Contribution Guidelines
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/your-feature`).
3. Follow the **coding style** defined in `.eslintrc.cjs` and run `npm run lint -- --fix` before committing.
4. Write unit tests for any new logic; ensure coverage does not drop.
5. Open a Pull Request with a clear description and link to the related issue.
---
## Troubleshooting
- **Database connection errors** – verify `DATABASE_URL` points to a reachable Supabase instance and that the service role key has the required permissions.
- **JWT verification fails** – ensure the same `JWT_SECRET` is used both in dev and production environments.
- **SAW results seem off** – check the `SAW_WEIGHTS` JSON in the environment; weights must sum to `1`.
---
## License
MIT License – see `LICENSE` file.

# Nita Clinics Web Platform

Full-stack healthcare platform for Nita Clinics.

## Stack
- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Swiper
- Backend: NestJS 10, TypeORM, PostgreSQL
- Queue/Cache: Bull + Redis
- Media: Cloudinary
- Mail: Nodemailer
- Realtime: Socket.IO

## Monorepo Structure
```
backend/   # NestJS API
frontend/  # Next.js app
images/    # static source assets
```

## Local Development
### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (optional for queue workers)

### Install
```bash
npm run install:all
```

### Run
```bash
npm run dev
```

- Frontend: `http://localhost:3002`
- Backend API: `http://localhost:3001/api/v1`

## Build
```bash
npm run build
```

## E2E tests (Playwright)
With the app running (`npm run dev`), from the repo root:

```bash
npm run test:e2e:install   # once: download Chromium
cp e2e/.env.example e2e/.env   # optional: add E2E_ADMIN_* / E2E_PATIENT_* for auth tests
npm run test:e2e
```

- Without `e2e/.env` credentials, **public** smoke tests still run; admin/patient login tests are **skipped**.
- With credentials, tests include **every admin sidebar URL** and **every authenticated patient page** (loads + not redirected to login + expected heading/shell). They do **not** automatically create/update/delete data (use a disposable DB or manual QA for full CRUD).
- `npm run test:e2e:ui` opens the Playwright UI for debugging.

## Notes
- Configure environment variables in `frontend/.env.local` and `backend/.env`.
- Payment gateways are set to test mode by default.
- This repository is private and intended for internal development.

# Nita Clinics — Render + Supabase Production Setup

**Status (2026-08-07):** Code, build, and local backend are ready. Only 2 short manual steps remain to light up the Vercel frontend with real data.

---

## What's already done

- ✅ Local backend (port 3003) serves all 6 data endpoints with real data:
  - 8 doctors, 8 packages, 35 lab tests, 3 vaccines, 4 health-card tiers, 6 departments
- ✅ Backend code (`backend/src/app.module.ts`) reads `DATABASE_SCHEMA=nita` correctly
- ✅ `render.yaml` declares `DATABASE_SCHEMA: nita` + `DATABASE_SYNCHRONIZE: "false"`
- ✅ `dist/app.module.js` already contains the schema fix (line 67)
- ✅ `nita_remote_seed.sql` (111 KB) is ready: 22 enums, 29 tables, 43 constraints, 151 inserts
- ✅ Render build `d08a187` is deployed — but crashes on startup because env vars are missing

The build is correct. The data is correct. Render just needs env vars and Supabase just needs the seed.

---

## Step 1 — Apply the seed to Supabase (~60 seconds)

**File:** `D:\Nita_clinik\nita_remote_seed.sql`

1. Open https://supabase.com/dashboard/project/egkdaebiwaamwgkgnuav/sql/new
2. Copy the entire contents of `nita_remote_seed.sql` (Ctrl+A → Ctrl+C in VS Code)
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Wait for the green "Success. No rows returned" — takes 5-10 seconds

The file is **idempotent** (uses `CREATE ... IF NOT EXISTS`). Safe to re-run.

---

## Step 2 — Set Render env vars (~90 seconds)

**File:** `D:\Nita_clinik\render-env-template.txt` (open alongside this one to copy values)

1. Open https://dashboard.render.com/web/srv-XXXXX (your `nita-backend` service)
2. Go to **Environment** tab → click **Add Environment Variable** for each of these:

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.egkdaebiwaamwgkgnuav:[YOUR-PASSWORD]@db.egkdaebiwaamwgkgnuav.supabase.co:5432/postgres` |
| `REDIS_URL` | `rediss://default:[PASSWORD]@[HOST].upstash.io:6379` (your Upstash Redis URL) |
| `JWT_SECRET` | (any 32+ char random string — use a password generator) |
| `FRONTEND_URL` | `https://nita-clinics-prod.vercel.app` |
| `NODE_ENV` | `production` (already set via render.yaml) |
| `PORT` | `3001` (already set via render.yaml) |
| `DATABASE_SCHEMA` | `nita` (already set via render.yaml) |
| `DATABASE_SYNCHRONIZE` | `false` (already set via render.yaml) |

3. **Save** — Render will auto-redeploy (~3-5 min)

### How to get the `DATABASE_URL`

In Supabase dashboard:
- **Settings** → **Database** → **Connection string** → **Direct connection** (NOT pooler for this — Render needs the persistent connection, port 5432)
- Copy the URI, replace `[YOUR-PASSWORD]` with the database password you set when creating the Supabase project
- The host should be `db.egkdaebiwaamwgkgnuav.supabase.co`, port `5432`

### How to get `REDIS_URL`

If you don't have Upstash yet:
- Sign up at https://upstash.com (free tier is fine)
- Create a Redis database (region: Singapore to match Render)
- Copy the **Endpoint** URL — looks like `rediss://default:abc123@apn1-xxxxx.upstash.io:6379`

---

## Step 3 — Verify (~30 seconds)

After Render redeploys:

```bash
# 1. Test the backend directly
curl -i https://nita-backend.onrender.com/api/v1/doctors
# Expected: HTTP 200, JSON array of 8 doctors

# 2. Open the frontend
start https://nita-clinics-prod.vercel.app/specialists
# Expected: 8 doctor cards rendered
```

If you see 200 on step 1 but Vercel still shows skeleton, hard-refresh Vercel (Ctrl+Shift+R) — Next.js may be serving a cached shell.

---

## Why I can't do these 2 steps myself

- **Step 1 (Supabase SQL)** — requires the DB password, which you correctly asked me never to paste in chat
- **Step 2 (Render env vars)** — Render dashboard has no public API; changes must come from a browser session

The rest of the system (8 doctors, 8 packages, 35 lab tests, all UI) is already wired and tested locally on `http://localhost:3002`.

# Dream Support — Deployment Guide (Free-tier Demo)

This walkthrough takes the system from "runs on my laptop" to "lives on the
public internet" using only free services. End state:

| Layer    | Host                | Free tier              | URL shape                                |
|----------|---------------------|------------------------|------------------------------------------|
| Frontend | Firebase Hosting    | 10 GB / 360 MB-day egress | `https://<project>.web.app`             |
| Backend  | Render (web service)| 750 hours / month (sleeps after 15 min) | `https://<service>.onrender.com` |
| Database | Supabase            | 500 MB Postgres + admin UI | `db.<project>.supabase.co:5432`     |

Total cost: **$0** for demo traffic. Total hands-on time: ~45 minutes.

> **Free-tier caveats**
> - Render free instances cold-start (~30 s) after 15 minutes of no traffic.
>   Hit the URL or set a UptimeRobot ping ~1 minute before any demo.
> - Render's free filesystem is ephemeral. Sponsor templates uploaded during a
>   demo will be lost on the next deploy. Acceptable for a demo; not for prod.
> - Supabase free pauses after 7 days of inactivity — log into the dashboard
>   periodically while you're iterating.

---

## 0. Prerequisites

- A GitHub account, and both repos pushed:
  - `dream-support-backend`
  - `dream-support-frontend`
- A free [Supabase](https://supabase.com) account
- A free [Render](https://render.com) account (sign in with GitHub)
- A [Firebase](https://console.firebase.google.com) account — the project
  `dream-support-5fffd` referenced in `.firebaserc` already exists; you'll
  need access to it (or update `.firebaserc` to point at your own project).
- `firebase-tools` installed locally: `npm install -g firebase-tools`

Generate a JWT signing secret you'll paste into Render later:

```bash
openssl rand -base64 48
```

Keep that string somewhere safe; you'll only need it once.

---

## 1. Provision Supabase (Postgres database)

1. In the Supabase dashboard click **New project**.
2. Name it (e.g. `dream-support-demo`), pick a strong DB password, choose the
   region nearest you, and **Create**.
3. Wait ~1 minute for provisioning to finish.
4. Go to **Settings → Database → Connection string** and switch the tab to
   **Java**. Copy the connection string — it looks like:
   ```
   jdbc:postgresql://db.<project-ref>.supabase.co:5432/postgres?user=postgres&password=<your-password>
   ```
5. From that string, peel off three values you'll paste into Render:
   - **DB_URL** = the connection string **without** the `?user=...&password=...`
     query part, with `?sslmode=require` appended. Example:
     ```
     jdbc:postgresql://db.abcdefgh.supabase.co:5432/postgres?sslmode=require
     ```
   - **DB_USERNAME** = `postgres`
   - **DB_PASSWORD** = the password you set in step 2

Nothing to import — Flyway will create every table on the backend's first
boot.

---

## 2. Deploy the backend to Render

1. Push the latest backend code to GitHub (the repo must contain the
   `render.yaml` and `system.properties` files that ship with this project).
2. In Render click **New → Blueprint**, pick the `dream-support-backend` repo.
3. Render reads `render.yaml` and prompts for the secret env vars. Fill in:

   | Variable               | Value                                                                 |
   |------------------------|-----------------------------------------------------------------------|
   | `JWT_SECRET`           | The output of `openssl rand -base64 48` from §0                       |
   | `DB_URL`               | The JDBC URL from §1                                                  |
   | `DB_USERNAME`          | `postgres`                                                            |
   | `DB_PASSWORD`          | The Supabase DB password                                              |
   | `CORS_ALLOWED_ORIGINS` | Leave blank for now — we'll set it after the frontend has a URL       |

   `APP_TEMPLATES_DIR` and `JAVA_OPTS` are already filled in by `render.yaml`.

4. Click **Apply**. Render runs `mvn clean package -DskipTests`, starts the
   JAR, and applies all Flyway migrations against Supabase. First build takes
   ~3 minutes.
5. When the service goes **Live**, copy the URL (e.g.
   `https://dream-support-backend.onrender.com`).
6. Smoke-test it from a terminal:

   ```bash
   curl -X POST https://<your-render-url>/api/auth/login \
        -H 'Content-Type: application/json' \
        -d '{"username":"admin","password":"changeme"}'
   ```

   You should get a JSON response with a `token` field. If you do, the
   backend, database, and Flyway migrations are all wired correctly.

---

## 3. Deploy the frontend to Firebase Hosting

1. Edit `.env.production` and replace the placeholder with your Render URL:

   ```env
   VITE_API_BASE_URL="https://<your-render-url>/api"
   ```

2. (Once only) sign in to the Firebase CLI and pick the project:

   ```bash
   firebase login
   firebase use --add        # pick dream-support-5fffd (or your own project)
   ```

3. Build and deploy:

   ```bash
   npm ci
   npm run build
   firebase deploy --only hosting
   ```

4. Firebase prints two URLs; the canonical one is
   `https://<project-id>.web.app`. Open it — the login page should render.

---

## 4. Close the CORS loop

Until this step the browser will reject the frontend's API calls with a
CORS error.

1. Back in Render, go to **dream-support-backend → Environment → Edit**.
2. Set `CORS_ALLOWED_ORIGINS` to your Firebase URL, comma-separated if
   you have more than one (e.g. custom domain + `web.app` mirror):

   ```
   https://dream-support-5fffd.web.app,https://dream-support-5fffd.firebaseapp.com
   ```

3. Render restarts the service automatically (~30 s).

---

## 5. Log in & verify

Visit your Firebase URL and log in:

- Username: `admin`
- Password: `changeme`

Immediately go to **帳號及權限** and either rotate the admin password or
create a fresh admin account and delete the seeded one.

---

## Daily ops

**Wake the backend before a demo.** Free Render instances sleep. Either visit
the URL once a minute before showtime, or set up a free UptimeRobot monitor
to ping `https://<your-render-url>/api/auth/login` every 5 minutes (it will
return 401/400 which is fine — the ping keeps the instance warm).

**Inspect the database.** Supabase's **Table editor** lets you view rows in
`user_account`, `audit_log`, `case_entity`, etc. Useful during demos to show
that mutations are persisted.

**Rotate a leaked secret.** Update `JWT_SECRET` in Render and redeploy; all
existing sessions are invalidated, users must log in again.

**See logs.** Render's **Logs** tab streams the JVM stdout/stderr live. The
backend writes audit-log writes, login attempts, and any 4xx/5xx with a
correlation id you can grep against.

---

## Upgrade paths (when "demo" becomes "real")

- **Persist uploaded templates.** Swap `TemplatePaths` for an S3-backed
  implementation (Cloudflare R2 is the cheapest at $0 ingress + $0.015/GB
  storage). The interface is one file; no service changes needed.
- **Stop the cold starts.** Move to Render's $7/mo Starter plan or to Fly.io
  with one always-on shared-cpu-1x machine.
- **Custom domain.** Both Firebase Hosting and Render support custom domains
  on free / starter plans with automatic Let's Encrypt certs.
- **Schedule backups.** Supabase Pro ($25/mo) adds point-in-time recovery;
  for free tier, a nightly `pg_dump` cron is a reasonable substitute.

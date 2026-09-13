# Deployment Guide — Robotics Club MMMUT Website

Target stack for this deployment:
- **Hosting:** Hostinger (domain + server)
- **Database:** MongoDB Atlas
- **Framework:** Next.js 16 (App Router), single unified app

---

## Is Vercel used anywhere?

**Not required, but the codebase has leftover Vercel-specific code paths** from when the EmbedX registration module (`embed_x_reg` branch) was originally built targeting Vercel. These do **not** block deploying elsewhere — they're conditional and simply won't trigger outside Vercel — but you should know they exist:

| File | What it does |
|---|---|
| `vercel.json` (repo root) | `{ "framework": "nextjs" }` — only read if you deploy via Vercel's platform. Harmless to leave, unused on Hostinger. |
| `railway.json` (repo root) | Railway.app build/deploy config (Nixpacks builder, `npm run start`). Also unused on Hostinger — safe to ignore or delete. |
| `src/lib/upload.ts` | Checks `process.env.VERCEL` — if true, stores the payment screenshot as a base64 Data URL in MongoDB instead of writing to disk (because Vercel's serverless filesystem is read-only/ephemeral). **On Hostinger this branch never runs** since `VERCEL` won't be set, so uploads go to a real folder on disk (see Uploads section below). |
| `src/lib/db.ts` | Has a Vercel-specific error message reminding you to set `MONGODB_URI` "in your Vercel Project Settings" — cosmetic only, the actual env var lookup is generic (`process.env.MONGODB_URI`). |

**Bottom line:** you can safely ignore `vercel.json` and `railway.json` for a Hostinger deployment. Nothing about the app's *required* functionality depends on Vercel.

---

## Two ways to deploy — pick one

**Option A: Vercel (hosting) + Hostinger (domain/DNS only)** — simplest, least maintenance, and the codebase already has Vercel-aware code paths built in. Recommended unless you specifically want everything on one server.

**Option B: Hostinger VPS (hosting + domain)** — full control, but you manage the Node process, reverse proxy, and TLS certificate yourself.

Both are covered below.

---

## Architecture summary

One Next.js app, multiple routes:

| Route | Description |
|---|---|
| `/` | Landing page (3D hero, robot loader) |
| `/play` | Flight demo game |
| `/events` | Event trailer page |
| `/team` | Team roster |
| `/embedx` | EmbedX event info page |
| `/embedx/register`, `/login`, `/dashboard`, `/admin` | Registration flow (needs DB + email) |
| `/api/embedx/*` | API routes backing the registration flow |

Because of the `/api/embedx/*` routes and file uploads, this **must run as a persistent Node.js server** (`next start`), not be exported as static HTML. Any Hostinger plan you use needs to support running a Node.js process (Hostinger VPS, or a shared-hosting plan with Node.js app support in hPanel).

---

## 1. MongoDB Atlas setup

1. Create a cluster (the free M0 tier is enough to start).
2. Create a database user (Database Access → Add New Database User) with a strong password.
3. **Network Access:** add an IP allowlist entry.
   - If your Hostinger server has a static IP, allowlist that exact IP (most secure).
   - If not, you can temporarily use `0.0.0.0/0` (allow from anywhere) to get running, then tighten later. The app's own error message (`src/lib/db.ts`) references this exact setting if the connection times out.
4. Get your connection string from Atlas (Connect → Drivers → Node.js). It looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
5. This becomes your `MONGODB_URI` env var (see below). Note: `.env.example` in this repo mentions a "non-SRV URI" as a placeholder — either the `mongodb+srv://` form or a plain `mongodb://` form works; `mongoose.connect()` in `src/lib/db.ts` accepts both. The database name used internally is fixed to `embedx` (set via `dbName: "embedx"` in the connection options), regardless of what's in the URI path.

---

## 2. Environment variables

Copy `.env.example` to `.env.local` (or `.env` on the server) and fill in real values:

```bash
# Required
MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority"
ADMIN_PASSWORD="<pick a strong passkey — do NOT keep the admin123 default>"
NEXT_PUBLIC_APP_URL="https://your-actual-domain.com"

# Optional — only needed if disk location differs from the default
# UPLOAD_DIR=/absolute/path/to/persistent/uploads/receipts

# Optional — email notifications (registration confirmations)
# If left unset, emails are just logged to the server console instead of sent.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=roboticsclub@mmmut.ac.in
SMTP_PASS=<app password, not your normal email password>
EMAIL_FROM="Robotics Club MMMUT" <roboticsclub@mmmut.ac.in>
```

`ADMIN_PASSWORD` currently defaults to `admin123` if unset (`src/app/api/embedx/admin/login/route.ts:10`) — **this gates access to all registrants' PII and payment screenshots at `/embedx/admin`, so set a real value before going live.**

---

## 3. File uploads (payment screenshots)

- Files are written to `public/uploads/receipts/` by default (`src/lib/upload.ts`), served back via `src/app/uploads/receipts/[filename]/route.ts`.
- This directory **must be writable by the Node process** and must **persist across deploys/restarts** — don't let a deploy script wipe `public/` on every release.
- If you redeploy by re-pulling the whole repo each time, point `UPLOAD_DIR` at a location outside the repo checkout (e.g. `/var/www/embedx-uploads`) so uploads survive a fresh `git pull`.

---

## 4A. Option A — Deploy to Vercel, keep the domain on Hostinger

This is the easier path: Vercel hosts and runs the app (build, serverless functions, TLS certs, CDN — all automatic), and Hostinger stays purely a domain registrar / DNS host.

1. **Push this repo to GitHub** if it isn't already there.
2. **Import into Vercel:** vercel.com → New Project → import the GitHub repo. It auto-detects Next.js (that's what the existing `vercel.json` is for).
3. **Set environment variables** in Vercel → Project Settings → Environment Variables — the same ones from Section 2 (`MONGODB_URI`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_APP_URL`, SMTP vars). Set `NEXT_PUBLIC_APP_URL` to your final custom domain, not the `*.vercel.app` one.
4. **Deploy.** You'll immediately get a working `your-project.vercel.app` URL to test against before touching DNS.
5. **Add your custom domain:** Vercel → Project Settings → Domains → enter your domain (e.g. `roboticsclubmmmut.com`). Vercel shows you the exact DNS records to add.
6. **Add those records in Hostinger's DNS zone editor** (hPanel → Domains → DNS Zone):
   - Apex domain (`roboticsclubmmmut.com`): an **A record** → the IP Vercel gives you (currently `76.76.21.21`, but use whatever Vercel's dashboard shows at the time)
   - `www`: a **CNAME record** → `cname.vercel-dns.com`
7. Vercel auto-issues an SSL certificate once DNS propagates (usually minutes, sometimes a few hours).
8. **Redeploys** happen automatically on every push to the connected branch — no manual build/restart steps.

**App-specific things to check on Vercel:**
- **MongoDB Atlas Network Access:** Vercel's serverless functions don't have a fixed IP, so Atlas needs `0.0.0.0/0` allowed (or use the official Vercel↔MongoDB Atlas integration, which manages this for you).
- **File uploads:** `src/lib/upload.ts` already detects `process.env.VERCEL` and stores the payment screenshot as a base64 Data URL directly in MongoDB instead of writing to disk (Vercel's filesystem is read-only). This "just works" without extra config, but it does mean payment screenshots live inside your MongoDB documents — keep an eye on Atlas' free-tier 512MB storage cap if registration volume is high.
- **Upload size limits:** Vercel's Hobby (free) plan caps request body size around 4.5MB for serverless functions. If registrants' payment screenshots are getting rejected, this is the first thing to check (independent of the app's own `maxFileSizeBytes` validation in `src/config/embedx.ts`).

---

## 4B. Option B — Hostinger VPS (hosting + domain, one server)

If you're on Hostinger VPS (full control, but more to maintain — plain shared hosting is more limited for a Node.js app):

1. **Provision the VPS**, SSH in, install Node.js (use a current LTS — the project currently warns on Node 23; Node 20 or 22 LTS is safer) and `pm2` (or use `systemd`) to keep the process alive:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pm2
   ```
2. **Clone the repo** onto the server and install dependencies:
   ```bash
   git clone <your-repo-url> /var/www/robotics-club
   cd /var/www/robotics-club
   npm install
   ```
3. **Create `.env`** in the project root with the values from Section 2.
4. **Build and start:**
   ```bash
   npm run build
   pm2 start npm --name robotics-club -- start
   pm2 save
   pm2 startup   # sets up pm2 to survive server reboots
   ```
   By default `next start` listens on port 3000.
5. **Reverse proxy with Nginx** so the domain (port 80/443) forwards to the Node process (port 3000):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
6. **Point the domain at the VPS:** in Hostinger's DNS zone editor, add an `A` record for `@` (and `www`) pointing to the VPS's public IP.
7. **HTTPS:** install Certbot and get a free Let's Encrypt certificate:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```
8. **Redeploys:** `git pull`, `npm install` (if deps changed), `npm run build`, `pm2 restart robotics-club`.

If instead you're on Hostinger shared hosting with their Node.js App Manager (hPanel → Advanced → Node.js), the same env vars and `npm run build` / `npm run start` apply — hPanel handles the process management and reverse proxy for you; just make sure the app's "startup file" points at Next's own server entry as their panel expects (consult Hostinger's Node.js app docs for the exact field, since this varies by plan).

---

## 5. Pre-launch checklist

- [ ] `ADMIN_PASSWORD` changed from the `admin123` default
- [ ] `MONGODB_URI` set and Atlas Network Access allows the server's IP
- [ ] `NEXT_PUBLIC_APP_URL` set to the real domain (used in confirmation emails/links)
- [ ] SMTP credentials set, or confirmed emails are okay being console-logged only
- [ ] `public/uploads/receipts/` (or your custom `UPLOAD_DIR`) is writable and will persist across redeploys
- [ ] Domain DNS pointed at the server, HTTPS certificate installed
- [ ] Confirmed `/embedx-chip-bg.jpg` and `/embedx-robot-panoramic.jpg` — referenced in `src/app/embedx/page.tsx` but not present in the repo — are either supplied or left on the current fallback image (`/images/embedx-bg.jpg`)

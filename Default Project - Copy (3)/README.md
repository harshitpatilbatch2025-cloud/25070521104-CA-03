# ScamShield — Digital Fraud Awareness Portal

ScamShield is a full-stack digital fraud awareness portal. It combines a public education site with personal accounts, bookmarks, server-graded quizzes, XP, streaks, and a dashboard backed by MongoDB.

**Stack:** React 18 + Vite · Node.js + Express · MongoDB + Mongoose · JWT in an httpOnly cookie · Zod · bcrypt

---

## What is included

- Professional, responsive public homepage with hero, scam-type cards, featured guides, safety tips, quiz call-to-action, and a cybercrime reporting footer.
- 8 scam-type guides, 10 long-form learning articles, and 4 five-question safety quizzes seeded into MongoDB.
- Registration and login with bcrypt-hashed passwords and an httpOnly JWT cookie.
- Protected dashboard with:
  - XP, level, streak, saved-article count, quiz attempts, average/best score, and articles read.
  - Saved articles with removal.
  - Full quiz history with scores, pass/fail, XP, and completion dates.
  - Profile, theme, notification preferences, learning goal, password change, logout, and account deletion.
- Article bookmarks and "mark as read" progress, both persisted per user.
- Quizzes are graded **on the server**. Correct answers are not sent to the browser until the attempt is submitted.
- User data isolation: every private query is scoped to the authenticated user.
- No `localStorage` or `sessionStorage` is used for accounts, profiles, progress, or quiz results.

---

## Quick start (Windows PowerShell)

### 1. Prerequisites

- **Node.js 20 LTS or newer** (Node 18+ should work).
- **MongoDB** — either an existing MongoDB service, a free MongoDB Atlas cluster, or the user-local MongoDB installed by this project (no administrator rights required).

### 2. Install dependencies

```powershell
npm run install:all
```

### 3. Start MongoDB

**Option A — MongoDB installed with the Windows installer (recommended):**

The MongoDB Community Server installer registers an automatic Windows service on port `27017`. Check it once:

```powershell
Get-Service MongoDB
```

If it is not running:

```powershell
Start-Service MongoDB
```

The service uses its own data directory (for MongoDB 9.0: `C:\Program Files\MongoDB\Server\9.0\data`) and does **not** need `npm run db:setup` or `npm run db:start`.

**Option B — project-local MongoDB (no administrator rights):**

```powershell
npm run db:setup   # one-time download of MongoDB 7.0.14 (~620 MB) into %USERPROFILE%\.scamshield
npm run db:start   # starts mongod on 127.0.0.1:27017, data in .data/db
```

`npm run db:start` is safe to run repeatedly — it exits early if anything is already listening on port `27017`. Do not run this while the MongoDB Windows service is active.

**Option C — MongoDB Atlas:**

Create a cluster and set `MONGODB_URI` in `server/.env` to your Atlas connection string.

### 4. Configure the server

```powershell
Copy-Item server\.env.example server\.env
```

Edit `server/.env` and set a strong `JWT_SECRET`:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Example configuration:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/scamshield
JWT_SECRET=<paste-the-generated-secret>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173,http://localhost:4173
SEED_ON_START=true
```

> `server/.env` is gitignored. Never commit real secrets.

### 5. Run the app

```powershell
npm run dev
```

- Web app: **http://localhost:5173**
- API: **http://localhost:5000**
- Health check: **http://localhost:5000/api/health**

Vite proxies `/api` to the Express server. The API seeds articles and quizzes on startup when `SEED_ON_START` is not `false`. Seeding is idempotent and never touches user data.

### 6. Try the workflow

1. Open the homepage and browse **Scam Types**, **Learn**, and **Quizzes**.
2. Create an account.
3. Open a guide, save it, and mark it as read.
4. Take a quiz and submit all five answers.
5. Open **Dashboard** to see the bookmark, XP, quiz history, and activity.
6. Change your theme or learning goal under **Profile & preferences**, then reload to confirm persistence.
7. Log out and log back in — your data should still be there.

---

## Production build

```powershell
npm run build
npm start
```

The Express server serves the built React app from `client/dist` and the API from the same origin at **http://localhost:5000**.

For production:

- Set `NODE_ENV=production`.
- Use a long, unique `JWT_SECRET`.
- Use a production `MONGODB_URI` (for example MongoDB Atlas).
- Serve over HTTPS. The auth cookie is marked `Secure` in production, so plain HTTP will not keep users logged in.
- Set `CLIENT_ORIGIN` to the deployed web origin if it differs from the API origin.
- Set `SEED_ON_START=false` if you do not want startup seeding, then run `npm run seed` explicitly when needed.

---

## Verify data in MongoDB Compass

1. Open MongoDB Compass.
2. Connect to:

   ```text
   mongodb://127.0.0.1:27017
   ```

3. Open the **`scamshield`** database.
4. Inspect these collections:

| Collection | What it stores |
| --- | --- |
| `users` | Name, unique lowercase email, `passwordHash` (bcrypt, 12 rounds), preferences, timestamps, last login |
| `articles` | Seeded learning guides, categories, body blocks, tips, featured flags |
| `quizzes` | Seeded quizzes, questions, options, correct answers, explanations, XP settings |
| `bookmarks` | One document per user + article pair |
| `quizattempts` | Submitted answers, score, percentage, pass/fail, XP, duration, completion date |
| `progresses` | XP, streak days, articles read, completed quizzes, last activity |
| `activities` | Per-user activity feed (registration, login, bookmarks, reads, quizzes, profile/password changes) |

Useful checks:

- Register a new account in the UI, refresh Compass, and open `users`. Confirm the new document exists and `passwordHash` starts with `$2`.
- Save an article, then inspect `bookmarks`; confirm the `user` field matches the new user's `_id`.
- Submit a quiz, then inspect `quizattempts`; confirm `answers`, `score`, and `completedAt`.
- Inspect `progresses`; confirm XP and completed items increased.
- Email addresses and quiz answers are never stored in browser localStorage; all of this data lives in the collections above.

Indexes are defined by the Mongoose schemas, including unique email, unique user/article bookmarks, and attempt lookup indexes.

---

## Available scripts

Run these from the project root.

| Command | Description |
| --- | --- |
| `npm run install:all` | Install root, server, and client dependencies |
| `npm run db:setup` | Download the user-local MongoDB build for Windows (one-time) |
| `npm run db:start` | Start local MongoDB on `127.0.0.1:27017` |
| `npm run dev` | Run API and Vite dev server together |
| `npm run dev:server` | Run only the Express API with nodemon |
| `npm run dev:client` | Run only the Vite frontend |
| `npm run seed` | Upsert articles and quizzes without starting the API |
| `npm run build` | Build the React app into `client/dist` |
| `npm start` | Start the production Express server (serves `client/dist` when present) |
| `npm run test:smoke` | Run the 45-check end-to-end API smoke test |

---

## API overview

Base URL: `/api`. Authentication uses the `scamshield_token` httpOnly cookie; send requests with credentials.

### Public

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | API/database status and seeded content counts |
| `GET` | `/articles?category=&q=&featured=&limit=` | List/filter guides (bookmark state when logged in) |
| `GET` | `/articles/categories` | Distinct article categories |
| `GET` | `/articles/:slug` | Article detail, related guides, bookmark/read state |
| `GET` | `/quizzes` | Quiz list with per-user best score when logged in |
| `GET` | `/quizzes/:slug` | Quiz questions and options without correct answers |

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create account, hash password, set auth cookie |
| `POST` | `/auth/login` | Verify credentials, set auth cookie |
| `POST` | `/auth/logout` | Clear the auth cookie |
| `GET` | `/auth/me` | Current authenticated user |

### Authenticated (user-owned data only)

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/users/me` | Current profile |
| `PATCH` | `/users/me` | Update name and preferences |
| `PUT` | `/users/me/password` | Change password with current-password verification |
| `GET` | `/users/me/stats` | Dashboard stats, progress, activity, recent attempts |
| `GET` | `/users/me/activity?limit=&page=` | Paginated activity feed |
| `DELETE` | `/users/me` | Delete account and all related data |
| `GET` | `/bookmarks` | Current user's saved articles |
| `POST` | `/bookmarks` | Save an article (`{ "articleSlug": "..." }`) |
| `DELETE` | `/bookmarks/:slug` | Remove a bookmark |
| `GET` | `/quizzes/attempts/mine?limit=` | Current user's quiz history |
| `GET` | `/quizzes/attempts/:id` | One owned attempt |
| `POST` | `/quizzes/:slug/attempt` | Submit answers; graded server-side |
| `GET` | `/progress` | Reading and quiz progress |
| `POST` | `/progress/read/:slug` | Mark an article read (+10 XP once) |

Validation failures return `422` with field-level errors. Missing/invalid sessions return `401`; unauthorized access to another user's records returns `404`/`403` as appropriate.

---

## Rules and behavior

- **XP:** +10 XP for each article marked read (once per article); quiz XP = `score × xpPerCorrect`, plus a 25 XP bonus for a perfect score.
- **Pass mark:** 70%.
- **Streaks:** consecutive-day activity is tracked in `progresses`.
- **Quiz grading:** answers are validated against the quiz document on the server. Duplicate or incomplete submissions are rejected.
- **Account deletion:** removes the user, bookmarks, quiz attempts, progress, and activity, then clears the cookie.
- **Email preferences:** notification/digest toggles are persisted with the profile. Actual outbound email delivery is outside the scope of this educational build.

---

## Security notes

- Passwords hashed with **bcryptjs, 12 rounds**; hashes are never returned by the API.
- JWT stored in an **httpOnly** cookie (`SameSite=Lax`, `Secure` in production), so JavaScript cannot read the token.
- **Zod** validates request bodies; **Mongoose** validates persisted data.
- **Helmet**, CORS allowlisting, and rate limits (60 auth attempts and 600 API requests per 15 minutes) are enabled.
- Correct quiz answers are excluded from public quiz payloads until submission.
- All private routes use `requireAuth`; owned records are queried with the authenticated user's ID.
- Central error handler avoids leaking stack traces in production.
- No browser storage is used as the source of truth for accounts or learning data.

---

## Project structure

```text
.
├─ client/                  React + Vite frontend
│  ├─ public/               Static assets (robots.txt, favicon)
│  └─ src/
│     ├─ api/               Fetch wrapper with cookie credentials
│     ├─ components/        Navbar, footer, logo, cards, route guard, feedback
│     ├─ context/           Auth and toast providers
│     ├─ data/              Scam-type reference content
│     ├─ pages/             Home, Scam Types, Learn, Article, Quizzes, Dashboard, auth
│     ├─ utils/             Formatting helpers
│     └─ styles.css         Responsive design system (dark + light themes)
├─ server/                  Express + Mongoose API
│  └─ src/
│     ├─ config/            Environment and database connection
│     ├─ middleware/        Auth and Zod validation
│     ├─ models/            User, Article, Quiz, Bookmark, QuizAttempt, Progress, Activity
│     ├─ routes/            REST endpoints
│     ├─ seed/              Curated article and quiz content + idempotent seeding
│     ├─ utils/             Tokens, dashboard aggregation, progress, errors
│     ├─ validators/        Zod request schemas
│     └─ index.js           App entry, middleware, routing, production static serving
├─ scripts/                 MongoDB setup/start and API smoke test
├─ .data/                   Local MongoDB data and logs (gitignored)
└─ package.json             Root orchestration scripts
```

---

## Testing

With the API running (`npm run dev` or `npm run dev:server`):

```powershell
npm run test:smoke
```

The smoke test exercises 45 checks across public content, registration/login, auth cookies, duplicate and bad credentials, bookmarks, article reads, server-side grading, incomplete submissions, progress, dashboard stats, profile/preferences, password changes, cross-user isolation, logout, protected routes, and cascading account deletion. It creates temporary `smoke.*@example.com` accounts and deletes them at the end.

The frontend production build can be verified with:

```powershell
npm run build
```

The public homepage has been audited with Lighthouse at **100** for Accessibility, Best Practices, and SEO (in both the default dark and light themes after the included contrast fixes).

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| API cannot connect to MongoDB | Start it with `npm run db:start`, check `.data/mongod.log`, or update `MONGODB_URI` |
| `mongod` not found | Run `npm run db:setup` once, or install MongoDB and add it to `PATH` |
| `Refusing to start: set a strong JWT_SECRET` | Copy `server/.env.example` to `server/.env` and set a real secret |
| Requests blocked by CORS | Add your web origin to `CLIENT_ORIGIN` in `server/.env` |
| Login works in development but not production | Use HTTPS; the production cookie is `Secure` |
| Port 5000 already in use | Stop the other process or change `PORT` (and update the Vite proxy target) |
| Seed data missing | Run `npm run seed` or keep `SEED_ON_START=true` |
| Anonymous homepage logs a `401` for `/api/auth/me` | Expected: the app checks whether a session exists |
| Database has test accounts after an interrupted test | Delete the `smoke.*@example.com` users in Compass; normal test runs clean up after themselves |

---

## Reporting real fraud

ScamShield is an educational project and cannot recover money or provide legal advice. In India, call the cybercrime helpline **1930** or report at **cybercrime.gov.in**. Elsewhere, contact local police and the national cybercrime authority.

# RecallIQ — Full Stack App

AI-powered memory tracking using the Ebbinghaus Forgetting Curve.

## Folder Structure
```
RecallIQ/

├── client/     ← Frontend (Next.js)

└── server/     ← Backend (Node.js + Express)
```

---

## SETUP IN 5 STEPS

### Step 1 — Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Step 2 — Setup PostgreSQL

Make sure PostgreSQL is running. Then create a database:

```sql
CREATE DATABASE recalliq;
```

### Step 3 — Create environment file

```bash
cd server
cp .env.example .env
```

Open `.env` and fill in:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/recalliq"
JWT_SECRET="any-long-random-string-here"
OPENAI_API_KEY="sk-..."   # optional — app works without it
CLIENT_URL="http://localhost:3000"
PORT=5000
```

### Step 4 — Push database schema

```bash
cd server
npm run db:generate
npm run db:push
```

### Step 5 — Run both servers

Open TWO terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# Running on http://localhost:3000
```

Open http://localhost:3000 — done!

---

## Deploy to Production

### Frontend → Vercel
```bash
cd client
npx vercel
```
Set env variable in Vercel dashboard:
```
NEXT_PUBLIC_API_URL = https://your-backend.railway.app
```

### Backend → Railway
1. Go to railway.app → New Project → Deploy from GitHub
2. Select the `/server` folder
3. Add environment variables (same as .env)
4. Railway gives you a URL like `https://recalliq-server.railway.app`

### Database → Neon (free PostgreSQL)
1. Go to neon.tech → Create project
2. Copy the connection string
3. Paste into DATABASE_URL in Railway env vars
4. Run: `npm run db:push`

---

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: MySQL
- **Auth**: JWT + HTTP-only cookies
- **AI**: OpenAI GPT-3.5 (optional)

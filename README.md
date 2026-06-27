# RecallIQ — Full Stack App

AI-powered memory tracking using the Ebbinghaus Forgetting Curve.

## Folder Structure
```
RecallIQ/

├── client/     ← Frontend (Next.js)

└── server/     ← Backend (Node.js + Express)
```


## Setup & Run

### Step 1 — Database
Open MySQL Workbench and run:
```sql
CREATE DATABASE recalliq;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'recalliq123';
FLUSH PRIVILEGES;
```

### Step 2 — Backend
```powershell
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```
Server runs on http://localhost:5000

### Step 3 — Frontend
```powershell
cd client
npm install
npm run dev
```
App runs on http://localhost:3000

### .env file (server/.env)

```
DATABASE_URL="mysql://root:recalliq123@localhost:3306/recalliq"

JWT_SECRET="recalliq123secret"

JWT_EXPIRES_IN="7d"

CLIENT_URL="http://localhost:3000"

PORT=5000

NODE_ENV=development
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

## Deploy

### Frontend → Vercel
```bash
cd client
npx vercel
```

### Backend → Railway
1. Push code to GitHub
2. Go to railway.app
3. New Project → Deploy from GitHub → select server folder
4. Add environment variables

### Database → Railway MySQL
Add MySQL plugin in Railway and update DATABASE_URL

## Pages
- / → Landing page
- /login → Login
- /register → Register
- /dashboard → Main dashboard with forgetting curve
- /dashboard/upload → Upload PDFs, URLs, add concepts
- /dashboard/graph → Knowledge graph
- /dashboard/quiz → AI quiz center
- /dashboard/revision → Revision queue
- /dashboard/concepts → All concepts
- /dashboard/analytics → Charts and analytics
- /dashboard/search → Semantic search
- /dashboard/settings → Profile settings
'@

---

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: MySQL
- **Auth**: JWT + HTTP-only cookies
- **AI**: OpenAI GPT-3.5 (optional)

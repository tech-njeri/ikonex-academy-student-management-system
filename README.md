# Ikonex Academy — Student Management System

> A web-based student management system for secondary schools. Manage streams, students, and subjects; record scores; generate ranked results; and download PDF report cards.

---

## Quick Start

```bash
git clone https://github.com/tech-njeri/ikonex-academy.git
cd ikonex-academy
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-string"
```

> **Tip:** Generate a secure secret with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Prerequisites

- Node.js v18+
- npm v9+
- Git
- PostgreSQL database (Railway recommended)

---

## Deployment

### Vercel

1. Push your code to GitHub.
2. Import the repository at [vercel.com](https://vercel.com).
3. Add the following environment variables in **Project Settings → Environment Variables**:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Your Railway PostgreSQL connection string |
   | `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://ikonex-academy.vercel.app`) |
   | `NEXTAUTH_SECRET` | The same secure random string used locally |

4. Ensure `package.json` includes Prisma in the build step:
   ```json
   "build": "prisma generate && next build"
   ```
5. Deploy — Vercel will auto-redeploy on every push to `main`.

### Database (Railway)

1. Go to [railway.app](https://railway.app) and create a new project.
2. Add a **PostgreSQL** service.
3. Copy the connection string from the **Connect** tab.
4. Set it as `DATABASE_URL` in both `.env` and Vercel.
5. Run `npx prisma db push` locally to create all tables.

---

## System Usage

Follow this order when setting up the system for the first time:

| Step | Action |
|---|---|
| 1 | **Streams** — Create class streams (e.g. Form 1A) |
| 2 | **Subjects** — Add subjects (e.g. Mathematics, English) |
| 3 | **Assign Subjects** — Link subjects to streams |
| 4 | **Students** — Register students with name, admission number, and stream |
| 5 | **Scores** — Enter exam scores (out of 70) and CAT scores (out of 30) |
| 6 | **Results** — View ranked results with grades per stream |
| 7 | **Report Cards** — Preview and download individual PDF report cards |
| 8 | **Class Report** — Download a class-wide performance summary PDF |

> **Note:** A subject must be assigned to a stream before scores can be recorded for students in that stream.

---

## Grading System

Grades are calculated from each student's average score across all recorded subjects.

| Grade | Range | Descriptor |
|---|---|---|
| A | 80 and above | Excellent |
| B | 60 – 79 | Good |
| C | 50 – 59 | Average |
| D | 40 – 49 | Below Average |
| E | Below 40 | Fail |

> Rankings are based on total marks. Students with equal totals share the same position.

---

## Troubleshooting

**API routes returning 500 errors**
- Verify `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` are set in your environment.
- Run `npx prisma generate` and restart the dev server.
- Check the terminal output for the specific error above the 500 line.

**Cannot push to GitHub**
- Run `git pull origin main --rebase` before pushing.
- Verify the remote URL with `git remote -v`.

**Vercel shows old version**
- Trigger a manual redeploy from the Vercel dashboard.
- Confirm the correct branch is set under **Project Settings → Git**.

**Scores not showing for a student**
- Confirm the subject is assigned to the student's stream under **Assign Subjects**.
- Check for the green toast notification confirming the save was successful.

**PDF download not working**
- Ensure the student has at least one score recorded.
- Refresh the report card page and try again.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (React) |
| Database | PostgreSQL (Railway) |
| ORM | Prisma |
| Auth | NextAuth.js |
| Styling | Tailwind CSS + Inline styles |
| PDF Generation | @react-pdf/renderer |
| Deployment | Vercel |

---

*© 2026 Joy Njeri — Ikonex Academy Student Management System*

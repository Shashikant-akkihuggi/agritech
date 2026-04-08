# Registration Error - Quick Fix

If you're seeing "Registration failed" error, follow these steps:

## Step 1: Check if Database is Setup

The most common issue is the database hasn't been initialized.

### Fix:

1. **Stop the dev server** (Ctrl+C in terminal)

2. **Setup the database:**
```bash
npm run db:push
```

3. **Generate Prisma client:**
```bash
npm run db:generate
```

4. **Restart dev server:**
```bash
npm run dev
```

## Step 2: Verify .env File

Make sure your `.env` file exists and has the correct DATABASE_URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/smart_agro?schema=public"
JWT_SECRET="your-secret-key-here"
```

### If you don't have PostgreSQL installed:

**Option 1: Install PostgreSQL locally**
- Windows: Download from https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Linux: `sudo apt-get install postgresql`

**Option 2: Use a cloud database (easier)**
- Supabase (free): https://supabase.com
- Neon (free): https://neon.tech
- Railway (free): https://railway.app

After creating a database, copy the connection string to your `.env` file.

## Step 3: Check Server Logs

Look at your terminal where `npm run dev` is running. You should see the actual error there.

Common errors:

### Error: "Table does not exist"
**Fix:** Run `npm run db:push`

### Error: "Can't reach database server"
**Fix:** 
1. Make sure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Test connection: `psql -U postgres` (or your username)

### Error: "Invalid connection string"
**Fix:** Check DATABASE_URL format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

## Step 4: Use Demo Data (Quick Test)

If you just want to test the app quickly:

1. Make sure database is setup (Step 1)
2. Seed demo data:
```bash
# In a new terminal (keep dev server running)
curl -X POST http://localhost:3000/api/seed
```

3. Login with demo account:
   - Phone: `9876543210`
   - Password: `demo123`

## Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try registering again
4. Look for error messages
5. Share the error message if you need more help

## Still Having Issues?

Run the verification script:
```bash
npm run verify
```

This will check your setup and tell you what's missing.

## Quick Database Setup (SQLite Alternative)

If PostgreSQL is too complex, you can use SQLite for testing:

1. Change `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Update `.env`:
```env
DATABASE_URL="file:./dev.db"
```

3. Run:
```bash
npm run db:push
npm run dev
```

This creates a local SQLite database file (easier for testing).

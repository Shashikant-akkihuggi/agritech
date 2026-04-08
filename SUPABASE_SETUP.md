# Supabase Database Setup Guide

## Issue: Cannot Connect to Supabase

You're experiencing connection issues with Supabase. Here are solutions:

---

## Solution 1: Check Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Check if the database is **Active** (green status)
4. Verify the connection string matches

---

## Solution 2: Use Supabase Studio (Web Interface)

Instead of pushing from local, use Supabase's SQL Editor:

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Copy and paste this SQL to create all tables:

```sql
-- Create Users table
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create Farms table
CREATE TABLE IF NOT EXISTS "Farm" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  "totalArea" DOUBLE PRECISION NOT NULL,
  "soilType" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create Fields table
CREATE TABLE IF NOT EXISTS "Field" (
  id TEXT PRIMARY KEY,
  "farmId" TEXT NOT NULL REFERENCES "Farm"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area DOUBLE PRECISION NOT NULL,
  "cropType" TEXT,
  "plantingDate" TIMESTAMP,
  "harvestDate" TIMESTAMP,
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create Crops table
CREATE TABLE IF NOT EXISTS "Crop" (
  id TEXT PRIMARY KEY,
  "fieldId" TEXT NOT NULL REFERENCES "Field"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  variety TEXT,
  "plantingDate" TIMESTAMP NOT NULL,
  "expectedHarvest" TIMESTAMP NOT NULL,
  "actualHarvest" TIMESTAMP,
  status TEXT DEFAULT 'growing',
  "waterRequirement" DOUBLE PRECISION NOT NULL,
  "growthStage" TEXT DEFAULT 'seedling',
  health TEXT DEFAULT 'good',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create SoilData table
CREATE TABLE IF NOT EXISTS "SoilData" (
  id TEXT PRIMARY KEY,
  "fieldId" TEXT NOT NULL REFERENCES "Field"(id) ON DELETE CASCADE,
  moisture DOUBLE PRECISION NOT NULL,
  temperature DOUBLE PRECISION NOT NULL,
  ph DOUBLE PRECISION,
  nitrogen DOUBLE PRECISION,
  phosphorus DOUBLE PRECISION,
  potassium DOUBLE PRECISION,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create WeatherData table
CREATE TABLE IF NOT EXISTS "WeatherData" (
  id TEXT PRIMARY KEY,
  "farmId" TEXT NOT NULL REFERENCES "Farm"(id) ON DELETE CASCADE,
  temperature DOUBLE PRECISION NOT NULL,
  humidity DOUBLE PRECISION NOT NULL,
  rainfall DOUBLE PRECISION NOT NULL,
  "windSpeed" DOUBLE PRECISION NOT NULL,
  pressure DOUBLE PRECISION,
  condition TEXT NOT NULL,
  "rainProbability" DOUBLE PRECISION,
  forecast JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Create IrrigationLog table
CREATE TABLE IF NOT EXISTS "IrrigationLog" (
  id TEXT PRIMARY KEY,
  "fieldId" TEXT NOT NULL REFERENCES "Field"(id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  "waterAmount" DOUBLE PRECISION,
  "waterSaved" DOUBLE PRECISION,
  reason TEXT NOT NULL,
  "soilMoisture" DOUBLE PRECISION NOT NULL,
  temperature DOUBLE PRECISION NOT NULL,
  humidity DOUBLE PRECISION NOT NULL,
  "rainProbability" DOUBLE PRECISION NOT NULL,
  "executedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create Loan table
CREATE TABLE IF NOT EXISTS "Loan" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  amount DOUBLE PRECISION NOT NULL,
  "interestRate" DOUBLE PRECISION NOT NULL,
  tenure INTEGER NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  "approvedAt" TIMESTAMP,
  "disbursedAt" TIMESTAMP,
  "repaymentDate" TIMESTAMP,
  "repaidAt" TIMESTAMP,
  "repaidAmount" DOUBLE PRECISION,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create MarketplaceListing table
CREATE TABLE IF NOT EXISTS "MarketplaceListing" (
  id TEXT PRIMARY KEY,
  "cropId" TEXT NOT NULL REFERENCES "Crop"(id) ON DELETE CASCADE,
  "sellerId" TEXT NOT NULL,
  quantity DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  "pricePerUnit" DOUBLE PRECISION NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  description TEXT,
  images TEXT[],
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create MandiPrice table
CREATE TABLE IF NOT EXISTS "MandiPrice" (
  id TEXT PRIMARY KEY,
  commodity TEXT NOT NULL,
  market TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  "minPrice" DOUBLE PRECISION NOT NULL,
  "maxPrice" DOUBLE PRECISION NOT NULL,
  "modalPrice" DOUBLE PRECISION NOT NULL,
  date TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create Transaction table
CREATE TABLE IF NOT EXISTS "Transaction" (
  id TEXT PRIMARY KEY,
  "listingId" TEXT NOT NULL REFERENCES "MarketplaceListing"(id) ON DELETE CASCADE,
  "buyerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  quantity DOUBLE PRECISION NOT NULL,
  "totalAmount" DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'pending',
  "paymentMethod" TEXT,
  "completedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create Alert table
CREATE TABLE IF NOT EXISTS "Alert" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Farm_userId_idx" ON "Farm"("userId");
CREATE INDEX IF NOT EXISTS "Field_farmId_idx" ON "Field"("farmId");
CREATE INDEX IF NOT EXISTS "Crop_fieldId_idx" ON "Crop"("fieldId");
CREATE INDEX IF NOT EXISTS "SoilData_fieldId_timestamp_idx" ON "SoilData"("fieldId", timestamp);
CREATE INDEX IF NOT EXISTS "WeatherData_farmId_timestamp_idx" ON "WeatherData"("farmId", timestamp);
CREATE INDEX IF NOT EXISTS "IrrigationLog_fieldId_createdAt_idx" ON "IrrigationLog"("fieldId", "createdAt");
CREATE INDEX IF NOT EXISTS "Loan_userId_idx" ON "Loan"("userId");
CREATE INDEX IF NOT EXISTS "MarketplaceListing_status_createdAt_idx" ON "MarketplaceListing"(status, "createdAt");
CREATE INDEX IF NOT EXISTS "MandiPrice_commodity_date_idx" ON "MandiPrice"(commodity, date);
CREATE INDEX IF NOT EXISTS "MandiPrice_market_date_idx" ON "MandiPrice"(market, date);
CREATE INDEX IF NOT EXISTS "Transaction_buyerId_idx" ON "Transaction"("buyerId");
CREATE INDEX IF NOT EXISTS "Transaction_listingId_idx" ON "Transaction"("listingId");
CREATE INDEX IF NOT EXISTS "Alert_userId_isRead_createdAt_idx" ON "Alert"("userId", "isRead", "createdAt");
```

4. Click **Run** to execute the SQL
5. All tables will be created in your Supabase database

---

## Solution 3: Enable IPv4 Add-on

If you need to use Prisma locally:

1. Go to Supabase Dashboard → **Settings** → **Add-ons**
2. Purchase **IPv4 Add-on** (if available)
3. This will allow direct connection from IPv4 networks

---

## Solution 4: Use Supabase CLI

Install Supabase CLI and link your project:

```bash
npm install -g supabase
supabase login
supabase link --project-ref esfpkjsgkfubkmdtuokb
supabase db push
```

---

## Solution 5: Check Firewall/Network

1. Check if your firewall is blocking port 5432
2. Try from a different network
3. Check if your ISP blocks PostgreSQL ports

---

## After Database is Created

Once tables are created (via any method above), you can:

1. **Generate Prisma Client:**
```bash
npm run db:generate
```

2. **Start the app:**
```bash
npm run dev
```

3. **Seed demo data:**
```bash
curl -X POST http://localhost:3000/api/seed
```

---

## Verify Connection

Test if you can connect:

```bash
npx prisma studio
```

This will open Prisma Studio. If it works, your connection is good!

---

## Current .env Configuration

Your `.env` file should have:

```env
DATABASE_URL="postgresql://postgres:Shashi12%40%2A%22%5F@db.esfpkjsgkfubkmdtuokb.supabase.co:5432/postgres"
JWT_SECRET="smart-agro-secret-key-2024-change-in-production"
OPENWEATHER_API_KEY=""
AGMARKNET_API_KEY=""
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

---

## Recommended: Use Supabase SQL Editor

The easiest solution is **Solution 2** - just copy the SQL above into Supabase SQL Editor and run it. This bypasses all connection issues!

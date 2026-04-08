# Quick Start Guide

Get the Smart Agro Platform running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Terminal/Command Prompt

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/smart_agro?schema=public"
JWT_SECRET="your-secret-key-here"
OPENWEATHER_API_KEY="optional-api-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Setup Database

```bash
npm run db:push
npm run db:generate
```

### 4. Seed Demo Data (Optional)

```bash
# Start the dev server first
npm run dev

# In another terminal, seed demo data
curl -X POST http://localhost:3000/api/seed
```

Demo credentials:
- Phone: `9876543210`
- Password: `demo123`

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Time Usage

### Option 1: Use Demo Account
1. Login with demo credentials above
2. Explore pre-populated farm data

### Option 2: Create New Account
1. Click "Register" on login page
2. Fill in your details
3. Complete onboarding:
   - Add farm location (or use GPS)
   - Select soil type
   - Enter land size
4. Start using the platform!

## Key Features to Try

### 1. Smart Irrigation
- Go to "Smart Irrigation" from sidebar
- Select a field
- Get AI-powered irrigation decision
- See detailed reasoning and water savings

### 2. Weather Dashboard
- View current weather for your farm
- Check 7-day forecast
- See irrigation impact analysis

### 3. Marketplace
- Browse live Mandi prices
- Compare prices across markets
- Filter by commodity

### 4. Finance
- Check loan eligibility
- Apply for micro-loans
- Track loan history

### 5. Analytics
- View water usage trends
- Track efficiency metrics
- Analyze crop yields

### 6. Farm Management
- View farm overview
- Monitor soil health
- Track crop health

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Run migrations again
npm run db:push
```

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Production Build

```bash
npm run build
npm start
```

## Next Steps

1. Add your real farm data
2. Configure OpenWeather API for accurate weather
3. Integrate IoT sensors for real-time soil data
4. Connect to AGMARKNET API for live Mandi prices
5. Customize irrigation rules for your crops

## Support

Need help? Check:
- README.md for detailed documentation
- Database schema in `prisma/schema.prisma`
- API routes in `app/api/`

Happy Farming! 🌾

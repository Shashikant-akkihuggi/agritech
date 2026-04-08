#!/usr/bin/env node

/**
 * Smart Agro Platform - Setup Verification Script
 * Run this after installation to verify everything is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🌾 Smart Agro Platform - Setup Verification\n');

let errors = 0;
let warnings = 0;

// Check Node version
console.log('📦 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 18) {
    console.error('❌ Node.js 18+ required. Current:', nodeVersion);
    errors++;
} else {
    console.log('✅ Node.js version:', nodeVersion);
}

// Check package.json
console.log('\n📄 Checking package.json...');
if (fs.existsSync('package.json')) {
    console.log('✅ package.json found');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // Check dependencies
    const requiredDeps = [
        'next', 'react', 'react-dom', '@prisma/client',
        'zustand', 'axios', 'bcryptjs', 'jsonwebtoken'
    ];

    requiredDeps.forEach(dep => {
        if (pkg.dependencies[dep]) {
            console.log(`  ✅ ${dep}`);
        } else {
            console.error(`  ❌ Missing dependency: ${dep}`);
            errors++;
        }
    });
} else {
    console.error('❌ package.json not found');
    errors++;
}

// Check .env file
console.log('\n🔐 Checking environment configuration...');
if (fs.existsSync('.env')) {
    console.log('✅ .env file found');
    const env = fs.readFileSync('.env', 'utf8');

    const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
    requiredVars.forEach(varName => {
        if (env.includes(varName)) {
            console.log(`  ✅ ${varName} configured`);
        } else {
            console.error(`  ❌ Missing: ${varName}`);
            errors++;
        }
    });

    const optionalVars = ['OPENWEATHER_API_KEY', 'AGMARKNET_API_KEY'];
    optionalVars.forEach(varName => {
        if (env.includes(varName)) {
            console.log(`  ✅ ${varName} configured`);
        } else {
            console.warn(`  ⚠️  Optional: ${varName} not configured (will use mock data)`);
            warnings++;
        }
    });
} else {
    console.error('❌ .env file not found. Copy .env.example to .env');
    errors++;
}

// Check Prisma schema
console.log('\n🗄️  Checking database schema...');
if (fs.existsSync('prisma/schema.prisma')) {
    console.log('✅ Prisma schema found');
} else {
    console.error('❌ Prisma schema not found');
    errors++;
}

// Check node_modules
console.log('\n📚 Checking dependencies installation...');
if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules found');
} else {
    console.error('❌ node_modules not found. Run: npm install');
    errors++;
}

// Check key directories
console.log('\n📁 Checking project structure...');
const requiredDirs = [
    'app',
    'app/api',
    'app/auth',
    'app/dashboard',
    'components',
    'lib',
    'prisma',
    'store'
];

requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`  ✅ ${dir}/`);
    } else {
        console.error(`  ❌ Missing directory: ${dir}/`);
        errors++;
    }
});

// Check key files
console.log('\n📝 Checking key files...');
const requiredFiles = [
    'app/layout.tsx',
    'app/page.tsx',
    'components/Sidebar.tsx',
    'lib/auth.ts',
    'lib/irrigation-engine.ts',
    'lib/weather-service.ts',
    'lib/prisma.ts',
    'README.md',
    'QUICKSTART.md'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.error(`  ❌ Missing file: ${file}`);
        errors++;
    }
});

// Check API routes
console.log('\n🔌 Checking API routes...');
const apiRoutes = [
    'app/api/auth/login/route.ts',
    'app/api/auth/register/route.ts',
    'app/api/farms/route.ts',
    'app/api/irrigation/decision/route.ts',
    'app/api/weather/route.ts',
    'app/api/marketplace/prices/route.ts',
    'app/api/loans/eligibility/route.ts'
];

apiRoutes.forEach(route => {
    if (fs.existsSync(route)) {
        console.log(`  ✅ ${route.replace('app/api/', '').replace('/route.ts', '')}`);
    } else {
        console.error(`  ❌ Missing route: ${route}`);
        errors++;
    }
});

// Check dashboard pages
console.log('\n📊 Checking dashboard pages...');
const dashboardPages = [
    'app/dashboard/page.tsx',
    'app/dashboard/irrigation/page.tsx',
    'app/dashboard/weather/page.tsx',
    'app/dashboard/marketplace/page.tsx',
    'app/dashboard/finance/page.tsx',
    'app/dashboard/analytics/page.tsx',
    'app/dashboard/farm/page.tsx',
    'app/dashboard/alerts/page.tsx'
];

dashboardPages.forEach(page => {
    if (fs.existsSync(page)) {
        console.log(`  ✅ ${page.replace('app/dashboard/', '').replace('/page.tsx', '') || 'overview'}`);
    } else {
        console.error(`  ❌ Missing page: ${page}`);
        errors++;
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log('📋 VERIFICATION SUMMARY');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
    console.log('✅ Perfect! Everything is configured correctly.');
    console.log('\n🚀 Next steps:');
    console.log('   1. Run: npm run db:push');
    console.log('   2. Run: npm run dev');
    console.log('   3. Open: http://localhost:3000');
    console.log('   4. (Optional) Seed demo data: POST http://localhost:3000/api/seed');
} else {
    if (errors > 0) {
        console.error(`\n❌ Found ${errors} error(s) that need to be fixed.`);
    }
    if (warnings > 0) {
        console.warn(`\n⚠️  Found ${warnings} warning(s) (optional configurations).`);
    }

    console.log('\n📖 Check the following guides:');
    console.log('   - README.md for full documentation');
    console.log('   - QUICKSTART.md for setup instructions');

    if (errors > 0) {
        process.exit(1);
    }
}

console.log('\n🌾 Happy Farming!\n');

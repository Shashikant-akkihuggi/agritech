# Deployment Guide

Production deployment guide for Smart Agro Platform.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] API keys obtained (OpenWeather, AGMARKNET)
- [ ] JWT secret changed from default
- [ ] Build tested locally
- [ ] Database backup strategy in place

## Environment Variables

### Required
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="strong-random-secret-key"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
```

### Optional
```env
OPENWEATHER_API_KEY="your-api-key"
AGMARKNET_API_KEY="your-api-key"
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Login to Vercel
```bash
vercel login
```

3. Deploy
```bash
vercel --prod
```

4. Configure environment variables in Vercel dashboard

5. Setup PostgreSQL database (Vercel Postgres or external)

### Option 2: Docker

1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/smart_agro
      - JWT_SECRET=your-secret
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=smart_agro
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. Deploy
```bash
docker-compose up -d
```

### Option 3: Traditional VPS (Ubuntu)

1. Setup Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Setup PostgreSQL
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb smart_agro
```

3. Clone and setup
```bash
git clone <repository>
cd smart-agro-platform
npm install
npm run build
```

4. Setup PM2
```bash
npm install -g pm2
pm2 start npm --name "smart-agro" -- start
pm2 startup
pm2 save
```

5. Setup Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

6. Setup SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Database Setup

### Run Migrations
```bash
npm run db:push
npm run db:generate
```

### Seed Initial Data (Optional)
```bash
curl -X POST https://yourdomain.com/api/seed
```

## Post-Deployment

### 1. Health Check
```bash
curl https://yourdomain.com/api/health
```

### 2. Monitor Logs
```bash
# Vercel
vercel logs

# PM2
pm2 logs smart-agro

# Docker
docker-compose logs -f
```

### 3. Database Backup
```bash
# PostgreSQL backup
pg_dump -U user -d smart_agro > backup.sql

# Restore
psql -U user -d smart_agro < backup.sql
```

## Performance Optimization

### 1. Enable Caching
- Configure Redis for session storage
- Enable Next.js ISR for static pages

### 2. CDN Setup
- Use Vercel Edge Network
- Or configure Cloudflare

### 3. Database Optimization
- Add indexes on frequently queried fields
- Enable connection pooling
- Use read replicas for analytics

### 4. Monitoring
- Setup Sentry for error tracking
- Configure Vercel Analytics
- Use Prisma Pulse for database monitoring

## Security Checklist

- [ ] HTTPS enabled
- [ ] Strong JWT secret
- [ ] Database credentials secured
- [ ] API rate limiting enabled
- [ ] CORS configured properly
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

## Scaling Strategy

### Horizontal Scaling
- Deploy multiple instances behind load balancer
- Use managed database service (AWS RDS, Supabase)
- Implement Redis for session management

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Enable database connection pooling

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Check DATABASE_URL format
- Verify database is accessible
- Check firewall rules

### Performance Issues
- Enable Next.js production mode
- Check database query performance
- Monitor server resources

## Rollback Strategy

### Vercel
```bash
vercel rollback
```

### PM2
```bash
pm2 restart smart-agro
```

### Docker
```bash
docker-compose down
docker-compose up -d
```

## Support

For deployment issues:
- Check logs first
- Review environment variables
- Verify database connectivity
- Contact: devops@smartagro.com

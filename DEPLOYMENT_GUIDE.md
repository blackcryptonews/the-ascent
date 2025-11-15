# The Ascent - Production Deployment Guide

Complete step-by-step guide to deploy The Ascent to Vercel with a production database.

## Prerequisites

- [ ] GitHub account (for code hosting)
- [ ] Vercel account ([vercel.com](https://vercel.com))
- [ ] OpenAI API key ([platform.openai.com](https://platform.openai.com/api-keys))
- [ ] Production database (see options below)

## Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
cd the-ascent
git init
git add .
git commit -m "Initial commit - The Ascent"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/the-ascent.git
git push -u origin main
```

### 1.2 Verify Environment Variables

Make sure your `.env` file is NOT committed (it's in `.gitignore`). Only `.env.example` should be in the repo.

## Step 2: Choose Your Production Database

### Option A: Vercel Postgres (Recommended - Free Tier Available)

**Best for**: Quick setup, managed by Vercel
**Free Tier**: 256MB database, 60 hours compute/month

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose your region (closest to users)
5. Vercel will automatically set `DATABASE_URL` in your project

### Option B: Supabase (Free PostgreSQL)

**Best for**: Free tier with generous limits, includes auth
**Free Tier**: 500MB database, unlimited API requests

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the "Connection string" (Transaction mode)
5. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option C: Railway (Free $5 credit)

**Best for**: Simple PostgreSQL hosting
**Free Tier**: $5/month credit

1. Sign up at [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy `DATABASE_URL` from Variables tab

### Option D: Neon (Generous Free Tier)

**Best for**: Serverless Postgres, auto-scaling
**Free Tier**: 10GB storage, generous compute

1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework Preset: **Next.js** (auto-detected)
4. Root Directory: `./` (leave default)

### 3.2 Configure Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database (from Step 2)
DATABASE_URL="postgresql://user:password@host:5432/database"

# OpenAI API
OPENAI_API_KEY="sk-your-openai-api-key"

# NextAuth - CRITICAL!
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="generate-with-command-below"
```

#### Generate NEXTAUTH_SECRET:

Run this locally:
```bash
openssl rand -base64 32
```

Copy the output and paste as `NEXTAUTH_SECRET`.

### 3.3 Deploy

Click "Deploy" - Vercel will:
1. Install dependencies
2. Run `prisma generate`
3. Build Next.js app
4. Deploy to production

## Step 4: Initialize Production Database

After first deployment, you need to create database tables.

### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run database migration
vercel env pull .env.production
npx prisma db push
```

### Option 2: Using Database Migration Script

Create a one-time migration endpoint (delete after use):

```typescript
// app/api/setup-database/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // This will create all tables based on schema.prisma
    await prisma.$executeRawUnsafe(`
      -- Prisma will handle this automatically
      -- Just accessing the database initializes it
    `)

    return NextResponse.json({ success: true, message: 'Database initialized' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

Visit: `https://your-app.vercel.app/api/setup-database` once, then delete the file.

## Step 5: Verify Deployment

### 5.1 Check Deployment Status

1. Vercel Dashboard → your project
2. Look for "Ready" status
3. Click on the deployment URL

### 5.2 Test Core Features

- [ ] Landing page loads
- [ ] Sign in works (create test account)
- [ ] Dashboard displays
- [ ] Daily questions generate
- [ ] Database saves data

### 5.3 Monitor Logs

Vercel Dashboard → your project → Logs

Watch for any errors in:
- Build logs
- Function logs (API routes)
- Edge logs

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain in Vercel

1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `theascent.app`)
3. Follow DNS configuration instructions

### 6.2 Update Environment Variables

Update `NEXTAUTH_URL` to your custom domain:
```bash
NEXTAUTH_URL="https://theascent.app"
```

## Step 7: Post-Deployment Tasks

### 7.1 Security Checklist

- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] `.env` file is in `.gitignore`
- [ ] API keys are not exposed in client code
- [ ] Database uses strong password
- [ ] HTTPS is enforced (automatic with Vercel)

### 7.2 Performance Optimization

- [ ] Enable Vercel Analytics (free)
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure caching strategies
- [ ] Enable Image Optimization (automatic with Next.js)

### 7.3 Database Maintenance

- [ ] Set up automatic backups
- [ ] Monitor database size
- [ ] Create indexes for slow queries (if needed)

## Troubleshooting

### Build Failures

**Issue**: Prisma generate fails
**Solution**: Ensure `DATABASE_URL` is set in environment variables

**Issue**: Module not found errors
**Solution**: Run `npm install` locally, commit `package-lock.json`

### Runtime Errors

**Issue**: Database connection fails
**Solution**:
- Check `DATABASE_URL` format
- Verify database allows connections from Vercel IPs
- For PostgreSQL, ensure SSL is enabled in connection string

**Issue**: NextAuth errors
**Solution**:
- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set
- Ensure it's using HTTPS in production

### Performance Issues

**Issue**: Slow API responses
**Solution**:
- Add database indexes
- Enable Edge runtime for API routes
- Use Vercel Edge Config for frequently accessed data

## Cost Estimates (Free Tiers)

| Service | Free Tier | Estimated Cost After |
|---------|-----------|---------------------|
| Vercel Hosting | Unlimited | $20/month (Pro) |
| Vercel Postgres | 256MB | $10/month for 1GB |
| Supabase | 500MB | Free forever (with limits) |
| OpenAI API | $5 credit | ~$0.002/1K tokens |
| **Total** | **$0/month** | **~$30/month** (if exceeding free tiers) |

## Scaling Considerations

### When to Upgrade

- **Database**: When storage exceeds free tier (256MB-500MB)
- **Hosting**: When bandwidth/compute exceeds limits
- **OpenAI**: When free credit runs out (~2,500 questions)

### Optimization Tips

1. **Database**: Archive old data, compress JSON fields
2. **API**: Cache frequently accessed data
3. **OpenAI**: Use GPT-3.5 instead of GPT-4, implement request queuing

## Support & Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)

## Quick Deploy Checklist

Use this before each deployment:

- [ ] Code pushed to GitHub
- [ ] Environment variables set in Vercel
- [ ] Database created and accessible
- [ ] `NEXTAUTH_SECRET` generated
- [ ] `NEXTAUTH_URL` set to production URL
- [ ] OpenAI API key valid
- [ ] Build succeeds locally (`npm run build`)
- [ ] Database migrated (`prisma db push`)
- [ ] Test deployment in preview mode first

---

**Ready to deploy?** Start with Step 1 above! 🚀

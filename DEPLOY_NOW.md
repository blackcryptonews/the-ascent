# 🚀 Deploy The Ascent - Step-by-Step Guide

Your app is ready to deploy! Follow these steps to get The Ascent live.

## ✅ Pre-Deployment Checklist (COMPLETED)

- ✓ Git repository initialized
- ✓ Initial commit created (58 files, e5478d5)
- ✓ Production build tested and passing
- ✓ .env file protected in .gitignore
- ✓ TypeScript errors fixed
- ✓ ESLint configured

## 📋 Quick Deployment Steps

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `the-ascent` (or your preferred name)
3. Description: "Personal transformation app with AI coaching"
4. **Important**: Choose **Private** if you want to keep your code private
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Push to GitHub

After creating the repository, run these commands:

```bash
cd "C:\Users\black\OneDrive\Desktop\giant-within"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/the-ascent.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository**:
   - Click "Import Git Repository"
   - Select your GitHub account
   - Find and select "the-ascent" repository
   - Click "Import"

3. **Configure Project**:
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (leave as default)
   - Build Command: Leave default
   - Output Directory: Leave default

4. **Environment Variables** - Click "Environment Variables" and add these:

   ```
   DATABASE_URL
   postgresql://user:password@host:5432/database
   (You'll get this from your database provider - see Step 4)

   NEXTAUTH_URL
   https://your-app-name.vercel.app
   (Vercel will show you this URL)

   NEXTAUTH_SECRET
   (Generate with: openssl rand -base64 32)
   Or use: https://generate-secret.vercel.app/32

   OPENAI_API_KEY
   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
   ```

5. **Click "Deploy"**

### Step 4: Set Up Production Database

#### Option A: Vercel Postgres (Recommended - Easiest)

1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a name and region
6. Click "Create"
7. Vercel will automatically add `POSTGRES_URL` environment variable
8. Update `DATABASE_URL` environment variable to use `POSTGRES_URL`

#### Option B: Supabase (Free Tier Available)

1. Go to https://supabase.com
2. Create new project
3. Go to Project Settings > Database
4. Copy the connection string (Session mode)
5. Add it as `DATABASE_URL` in Vercel environment variables

### Step 5: Initialize Database Schema

After deploying and setting up the database:

1. Go to Vercel project dashboard
2. Click "Settings" > "Functions"
3. Or use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Run Prisma migration
vercel env pull .env.production
npx prisma db push --schema=./prisma/schema.prisma
```

Or use the Vercel dashboard > Settings > Environment Variables to run:
```bash
npx prisma db push
```

### Step 6: Update Prisma Schema for Production

The schema needs to be updated for PostgreSQL in production:

1. Go to Vercel > Settings > Environment Variables
2. Make sure `DATABASE_URL` is set to your PostgreSQL connection string
3. Redeploy the app (Vercel will run `prisma generate`)

### Step 7: Verify Deployment

1. Visit your deployed URL: `https://your-app-name.vercel.app`
2. Test the following:
   - Landing page loads
   - Sign in works
   - Dashboard displays
   - Can create a habit
   - Daily question generates

### Step 8: Custom Domain (Optional)

1. Go to Vercel project > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable with new domain

## 🔐 Security Checklist

- [ ] Changed NEXTAUTH_SECRET from default
- [ ] OpenAI API key is in environment variables (not in code)
- [ ] Database credentials are secure
- [ ] .env file is NOT committed to Git
- [ ] Production database has backups enabled

## 📊 Post-Deployment Monitoring

1. **Check Vercel Logs**: Project > Logs tab
2. **Monitor OpenAI Usage**: https://platform.openai.com/usage
3. **Set Up Alerts**: Vercel > Project Settings > Notifications

## 🐛 Troubleshooting

### Build Failed
- Check Vercel logs for specific errors
- Ensure all environment variables are set
- Verify DATABASE_URL is a PostgreSQL connection string

### Database Connection Error
- Verify DATABASE_URL format: `postgresql://user:password@host:5432/database`
- Check database is accessible from Vercel's region
- Run `npx prisma db push` to create tables

### Authentication Not Working
- Verify NEXTAUTH_URL matches your deployment URL
- Ensure NEXTAUTH_SECRET is set and not the default
- Check that the URL includes https://

### OpenAI API Errors
- Verify API key is correct
- Check usage limits: https://platform.openai.com/usage
- Ensure you have credits remaining

## 📝 Environment Variables Summary

| Variable | Example | Where to Get |
|----------|---------|--------------|
| `DATABASE_URL` | `postgresql://...` | Vercel Postgres or Supabase |
| `NEXTAUTH_URL` | `https://app.vercel.app` | Your Vercel deployment URL |
| `NEXTAUTH_SECRET` | `random-32-char-string` | Generate with OpenSSL |
| `OPENAI_API_KEY` | `sk-proj-...` | https://platform.openai.com/api-keys |

## 🎉 Success!

Once deployed, your app will be live at your Vercel URL. Share it with users and start transforming lives!

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

---

Built with ❤️ - The Ascent v1.0.0

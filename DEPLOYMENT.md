# Deploying The Ascent to Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **OpenAI API Key**: Get from [platform.openai.com](https://platform.openai.com/api-keys)
3. **Production Database**: For production, use a hosted PostgreSQL (see options below)

## Quick Deploy Steps

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd the-ascent
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add NEXTAUTH_SECRET
   vercel env add DATABASE_URL
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL` - Your production database URL
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://the-ascent.vercel.app`)

4. **Deploy**: Click "Deploy"

## Database Options for Production

### Option 1: Vercel Postgres (Easiest)
```bash
vercel postgres create
```
- Built-in integration
- Automatic connection
- Free tier: 256 MB storage

### Option 2: Supabase (Recommended)
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings > Database
4. Add to Vercel: `DATABASE_URL="postgresql://..."`

### Option 3: Railway
1. Sign up at [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string
4. Add to Vercel environment variables

### Option 4: Neon (Serverless Postgres)
1. Sign up at [neon.tech](https://neon.tech)
2. Create database
3. Get connection string
4. Add to Vercel

## Update Database Schema

After setting up production database:

```bash
# Update DATABASE_URL in .env to production database
npx prisma db push

# Or use migrations for production
npx prisma migrate deploy
```

## Environment Variables Summary

Required for production:

```
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Authentication
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# OpenAI
OPENAI_API_KEY="sk-proj-your-key-here"
```

## Post-Deployment

1. **Test the deployment**:
   - Visit your Vercel URL
   - Sign in/create account
   - Test daily questions
   - Create a habit and run transformation exercise

2. **Monitor**:
   - Check Vercel logs for errors
   - Monitor OpenAI API usage
   - Track database connections

3. **Custom Domain** (Optional):
   - Go to Vercel project settings
   - Add custom domain
   - Update `NEXTAUTH_URL` to custom domain

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify `DATABASE_URL` format
- Ensure database accepts connections from Vercel IPs
- Check if `prisma generate` ran successfully

### Authentication Not Working
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure callbacks are configured correctly

### OpenAI API Errors
- Verify API key is valid
- Check rate limits (free tier: 3 req/min)
- Monitor API usage on OpenAI dashboard

## Cost Estimates

### Vercel
- **Hobby (Free)**: Perfect for personal use
- **Pro ($20/month)**: Better performance, more bandwidth

### Database
- **Vercel Postgres Free**: 256 MB (good for MVP)
- **Supabase Free**: 500 MB + 2GB bandwidth
- **Railway**: $5/month for 512 MB
- **Neon Free**: 512 MB

### OpenAI
- **Free Tier**: $5 credit (expires after 3 months)
- **Pay-as-you-go**: ~$0.002 per 1K tokens
- **Estimated cost**: $1-5/month for personal use

## Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Never commit `.env` to git
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up proper CORS if needed
- [ ] Monitor API keys for unusual activity
- [ ] Use database connection pooling
- [ ] Enable rate limiting for API routes

## Performance Optimization

1. **Enable Edge Functions** (optional):
   - Add `export const runtime = 'edge'` to API routes
   - Faster response times globally

2. **Database Connection Pooling**:
   - Use connection pooling for Prisma
   - Add `?connection_limit=10` to `DATABASE_URL`

3. **Caching**:
   - Consider Redis for caching (Upstash free tier)
   - Cache AI responses for common questions

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **NextAuth Docs**: [next-auth.js.org](https://next-auth.js.org)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)

---

**Ready to deploy?** Run `vercel` in your terminal! 🚀

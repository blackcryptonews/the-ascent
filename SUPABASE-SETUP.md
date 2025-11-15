# Supabase Setup Guide for The Ascent

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: the-ascent
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is perfect to start!
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql` from this repo
4. Paste into the SQL editor
5. Click **"Run"** or press `Ctrl/Cmd + Enter`
6. You should see "Success. No rows returned" - that's perfect!

This creates all your tables:
- ✅ users
- ✅ goals
- ✅ onboarding_data
- ✅ custom_goals
- ✅ affirmations_log
- ✅ journal_entries
- ✅ transformation_log
- ✅ streaks

## Step 3: Get Your API Credentials

1. Go to **Project Settings** (gear icon, bottom left)
2. Click **API** in the sidebar
3. You'll see:
   - **Project URL**: Copy this
   - **Project API keys > anon public**: Copy this

## Step 4: Update Your .env File

1. Open `.env` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-very-long-anon-key-here"
```

3. Save the file
4. Restart your dev server (`Ctrl+C` then `npm run dev`)

## Step 5: Test the Connection

1. Open your app at [http://localhost:3006](http://localhost:3006)
2. Go through the onboarding flow
3. Your data should now be saved to Supabase!
4. Check your Supabase dashboard:
   - Go to **Table Editor**
   - Select `users` table
   - You should see your user data!

## Features Now Enabled

### ✅ Persistent Data
- Goals saved across devices
- Onboarding responses stored
- Custom goals supported
- Journal entries preserved

### ✅ Real-time Sync
- Changes appear instantly
- Multi-device support
- No data loss

### ✅ Secure & Scalable
- Row-level security enabled
- Users can only see their own data
- Production-ready from day one

## Supabase Free Tier Limits

Perfect for personal use and MVPs:
- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **API Requests**: Unlimited
- **Auth Users**: Unlimited

This is more than enough for thousands of users!

## Optional: Enable Authentication

If you want full authentication (instead of demo mode):

1. Go to **Authentication** in Supabase dashboard
2. Enable **Email** provider
3. Configure email templates
4. Update NextAuth to use Supabase as the provider

## Troubleshooting

### "Cannot connect to Supabase"
- Check your `.env` file has correct URL and key
- Restart your dev server
- Make sure there are no extra spaces in the values

### "Row Level Security" errors
- The schema automatically sets up RLS
- Make sure you ran the full `supabase-schema.sql`
- Check that policies were created (Table Editor > Policies tab)

### Data not showing up
- Check the Table Editor in Supabase dashboard
- Verify the SQL schema ran successfully
- Look at browser console for error messages

## Next Steps

1. ✅ Complete Supabase setup
2. 🔄 Test creating custom goals
3. 🔄 Verify data persistence
4. 🚀 Deploy to production with Vercel
5. 🎉 Share with users!

---

Need help? Check [Supabase Docs](https://supabase.com/docs) or open an issue!

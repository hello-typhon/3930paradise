# Deployment Guide - 3930 Paradise

## ⚠️ Important: GitHub Pages Limitation

**GitHub Pages CANNOT host this application** because it only supports static HTML/CSS/JS files.

This app requires server-side features:
- ❌ API Routes (`/api/events`, `/api/auth`, etc.)
- ❌ Database (Prisma + SQLite/PostgreSQL)
- ❌ Admin Authentication (sessions)
- ❌ File Uploads (UploadThing callbacks)
- ❌ CAPTCHA Verification (server-side)
- ❌ Background Video Management

## ✅ Recommended: Deploy to Vercel (FREE)

Vercel is made by the Next.js team and supports all features with zero configuration.

### Quick Deploy to Vercel

1. **Push to GitHub** (if not already done):
```bash
git remote add origin https://github.com/yourusername/3930paradise.com.git
git branch -M main
git push -u origin main
```

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Add Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add these variables:

```env
# Database (use Vercel Postgres for production)
DATABASE_URL=your_postgres_connection_string

# UploadThing
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza19saXZlX2M4MjMzMzg1MThkMmQzMDNlZWM1OWZlNDIyNmE4YzE4ODY0MGVhNWNjOTdlZWE1NDNiNzBiNmRkYzg5YjdjZjMiLCJhcHBJZCI6Iml3dGNwMTE1aGQiLCJyZWdpb25zIjpbInNlYTEiXX0=

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdpQfcrAAAAAFouAW1h33JC1fc7dbN4Y4x4Vhbu
RECAPTCHA_SECRET_KEY=6LdpQfcrAAAAAAea9cDKZymZx_49MiCRYnTLO6Ja

# Session Secret (generate new one for production)
SESSION_SECRET=your_production_secret_here
```

4. **Set up Production Database**:

**Option A: Vercel Postgres (Recommended)**
```bash
# In Vercel Dashboard:
# 1. Go to Storage tab
# 2. Create new Postgres database
# 3. Copy connection string
# 4. Update DATABASE_URL environment variable
```

**Option B: External Postgres**
- Use Neon, Supabase, Railway, or any Postgres provider
- Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
- Run migrations:
```bash
npx prisma migrate deploy
```

5. **Create Admin User** (after deployment):
```bash
# Connect to production database and run:
npx prisma studio

# Or use the create-admin script with production DATABASE_URL
```

### Vercel Features You Get (Free Tier):
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs
- ✅ Analytics
- ✅ Zero configuration
- ✅ Custom domain support (3930paradise.com)

### Custom Domain Setup (Optional)

1. In Vercel Dashboard → Domains
2. Add `3930paradise.com`
3. Update DNS records at your domain registrar:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Alternative: Deploy to Netlify

Similar to Vercel, supports all features:

1. Push to GitHub
2. Go to https://netlify.com
3. Import repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables (same as Vercel)
7. Deploy

## Alternative: Deploy to Railway

Great for apps with databases:

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Select repository
4. Railway auto-detects Next.js
5. Add Postgres database from Railway dashboard
6. Add environment variables
7. Deploy

## GitHub Pages (Static Export - LIMITED)

**⚠️ WARNING**: This removes ALL dynamic features:
- No admin portal
- No event submissions
- No authentication
- No database
- Read-only timeline only

**Only use this if you want a static archive of events.**

### Steps for Static Export (NOT RECOMMENDED):

1. Update `next.config.js`:
```js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
module.exports = nextConfig;
```

2. Build static site:
```bash
npm run build
```

3. Deploy `out/` folder to GitHub Pages

**This is NOT suitable for your use case.**

## Recommended Production Setup

**Best Option**: Vercel + Vercel Postgres
- Cost: $0/month (free tier)
- Deployment: Automatic on git push
- Database: Managed Postgres
- Domain: Custom domain support
- Time to deploy: ~5 minutes

### Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connected and migrated
- [ ] Admin user created via script
- [ ] reCAPTCHA keys working
- [ ] UploadThing configured
- [ ] Test event submission
- [ ] Test admin login
- [ ] Test background video upload
- [ ] Custom domain configured (optional)

## Monitoring & Maintenance

### Vercel Analytics
- Enable in Vercel dashboard
- Track visitors, performance
- Free tier included

### Database Backups
- Vercel Postgres: Automatic backups
- External Postgres: Configure backup schedule

### Updates
```bash
git push origin main
# Vercel auto-deploys
```

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

**TL;DR**: Use Vercel. It's free, works perfectly with Next.js, and takes 5 minutes to set up.

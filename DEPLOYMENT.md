# Digistore1 Frontend - Vercel Deployment Guide

## Prerequisites
- GitHub account with the repository: `https://github.com/raiddubai1/Digistore-Frontend.git`
- Vercel account (sign up at https://vercel.com)
- Backend already deployed at: `https://digistore1-backend.onrender.com`

## Deployment Steps

### 1. Sign in to Vercel
1. Go to https://vercel.com
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub" for easiest integration

### 2. Import Your Project
1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find and select `raiddubai1/Digistore-Frontend`
4. Click "Import"

### 3. Configure Project Settings
Vercel will auto-detect Next.js. Configure the following:

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as default)

**Build Command:** `npm run build` (auto-detected)

**Output Directory:** `.next` (auto-detected)

**Install Command:** `npm install` (auto-detected)

### 4. Environment Variables
Add the following environment variable:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://digistore1-backend.onrender.com/api` |

**How to add:**
1. In the "Environment Variables" section
2. Click "Add" or enter the key-value pair
3. Make sure it's available for "Production", "Preview", and "Development"

### 5. Deploy
1. Click "Deploy"
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://digistore-frontend-xxx.vercel.app`

### 6. Custom Domain (Optional)
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

## Post-Deployment Checklist

### ✅ Test Your Deployment
1. Visit your Vercel URL
2. Test the following:
   - [ ] Homepage loads correctly
   - [ ] Product listings display
   - [ ] User registration works
   - [ ] User login works
   - [ ] Add to cart functionality
   - [ ] Checkout process
   - [ ] Language switching
   - [ ] Mobile responsiveness

### ✅ Configure Backend CORS
Make sure your backend allows requests from your Vercel domain:

In your backend `.env` on Render, add:
```
CORS_ORIGIN=https://your-vercel-url.vercel.app
```

Or update the CORS configuration in your backend code to include your Vercel URL.

### ✅ Update Backend Environment Variables (if needed)
In Render dashboard for your backend:
1. Go to Environment
2. Add/Update:
   - `FRONTEND_URL=https://your-vercel-url.vercel.app`
   - `CORS_ORIGIN=https://your-vercel-url.vercel.app`

## Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every pull request

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend CORS settings
- Ensure backend is running on Render

### Images Not Loading
- Check `next.config.ts` has proper `remotePatterns` configuration
- Verify image URLs are accessible

## Useful Commands

### Local Development
```bash
npm run dev
```

### Build Locally (to test)
```bash
npm run build
npm start
```

### Check Environment Variables
```bash
# In Vercel CLI
vercel env ls
```

## Support Links
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Backend API: https://digistore1-backend.onrender.com/health

## Current Configuration
- **Frontend Repository:** https://github.com/raiddubai1/Digistore-Frontend.git
- **Backend API:** https://digistore1-backend.onrender.com/api
- **Framework:** Next.js 16.0.4
- **Node Version:** 20.x (Vercel default)


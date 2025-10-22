# Frontend Deployment Guide

## Error: "Unable to connect to server"

This error occurs when the frontend tries to connect to `http://localhost:3000` in production. You need to configure the correct backend URL.

---

## Deployment on Vercel (Recommended)

### Step 1: Deploy Backend First
Make sure your backend is deployed and running on Render.com (or another platform).
- Example URL: `https://tikoyangu-backend.onrender.com`

### Step 2: Configure Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | `TikoYangu` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-frontend.vercel.app` | Production |

**Important:** Replace the URLs with your actual backend and frontend URLs.

### Step 3: Redeploy

After setting environment variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button
4. Or push a new commit to trigger auto-deployment

---

## Deployment on Netlify

### Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_APP_NAME=TikoYangu
   NEXT_PUBLIC_APP_URL=https://your-frontend.netlify.app
   ```

3. Trigger a new deployment

---

## Update Backend CORS

After deploying frontend, update your backend to allow requests from the frontend domain:

**Backend: `src/main.ts`**

```typescript
app.enableCors({
  origin: [
    'http://localhost:3001', 
    'http://localhost:3000',
    'https://your-frontend.vercel.app', // Add your production frontend URL
    'https://your-frontend-preview.vercel.app' // Add preview URLs if needed
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```

Then redeploy the backend.

---

## Verification Steps

1. **Check environment variables are set:**
   - In Vercel: Settings → Environment Variables
   - Variables should show for Production environment

2. **Check build logs:**
   - Look for `NEXT_PUBLIC_API_URL` in the build output
   - It should show your production backend URL

3. **Test API connection:**
   - Open browser console on your deployed site
   - Check Network tab when logging in
   - Requests should go to your production backend URL, not localhost

4. **Check CORS:**
   - If you see CORS errors, update backend CORS configuration
   - Make sure frontend URL is in the allowed origins list

---

## Common Issues

### Issue 1: Still connecting to localhost after setting env vars
**Solution:** Redeploy after setting environment variables. Environment variables are only applied during build time for Next.js.

### Issue 2: CORS errors
**Solution:** Add your frontend URL to backend CORS origins in `src/main.ts`

### Issue 3: 404 errors on API calls
**Solution:** Verify `NEXT_PUBLIC_API_URL` doesn't have trailing slash
- ✅ Correct: `https://backend.com`
- ❌ Wrong: `https://backend.com/`

### Issue 4: Environment variables not showing in build
**Solution:** Make sure variable names start with `NEXT_PUBLIC_` prefix. Only these are exposed to the browser.

---

## Quick Setup Commands

### For Development
```bash
# Use .env.local (already configured)
npm run dev
```

### For Production Build (local testing)
```bash
# Create .env.production file
echo "NEXT_PUBLIC_API_URL=https://your-backend.onrender.com" > .env.production
echo "NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app" >> .env.production

# Build and test
npm run build
npm run start
```

---

## Environment Variable Priority

Next.js loads environment variables in this order (later overrides earlier):
1. `.env` - All environments
2. `.env.local` - All environments (gitignored, for secrets)
3. `.env.production` or `.env.development` - Specific environment
4. `.env.production.local` or `.env.development.local` - Specific environment (gitignored)

For deployment platforms, their environment variables override all local files.

---

## Security Notes

- ✅ `.env.local` is gitignored - safe for local secrets
- ✅ Use platform environment variables for production secrets
- ⚠️ `NEXT_PUBLIC_*` variables are exposed to the browser
- ❌ Never put sensitive keys in `NEXT_PUBLIC_*` variables
- ❌ Never commit `.env.local` or `.env.production.local` to git

---

## Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Backend URL noted (e.g., https://backend.onrender.com)
- [ ] Frontend environment variables set on Vercel/Netlify
- [ ] `NEXT_PUBLIC_API_URL` points to production backend
- [ ] Backend CORS updated with frontend URL
- [ ] Redeployed after setting environment variables
- [ ] Tested login/registration on production site
- [ ] API calls visible in browser Network tab
- [ ] No CORS errors in browser console

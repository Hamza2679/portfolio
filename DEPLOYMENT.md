# Deployment Guide - Portfolio with AI Chat

## ✅ Completed Steps

1. ✅ Backend deployed to Render: https://port-back-pa9x.onrender.com
2. ✅ Render configuration updated (`render.yaml`) - uses `OPENROUTER_API_KEY`
3. ✅ Frontend configured for production (`chat-widget.js`) - auto-detects production URL
4. ✅ Netlify configuration created (`netlify.toml`)

## 📋 Next Steps to Complete Deployment

### Step 1: Configure Render Environment Variables

In your Render dashboard (https://dashboard.render.com):

1. Go to your backend service (portfolio-chat-backend)
2. Navigate to **Environment** tab
3. Add these environment variables:
   - `OPENROUTER_API_KEY` = `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`
   - `FRONTEND_ORIGIN` = Leave empty for now (will set after Netlify deployment)
   - `PORT` = `3000` (optional, Render auto-assigns)
4. Click **Save Changes** - Render will auto-redeploy

### Step 2: Deploy Frontend to Netlify

#### Option A: Via Netlify Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Go to Netlify**: https://app.netlify.com
   - Sign up/Login (free tier is fine)

3. **Add New Site** → **Import an existing project**
   - Connect to GitHub
   - Select your `portfolio` repository
   - Select branch: `main`

4. **Configure build settings**:
   - **Build command**: Leave empty (static site)
   - **Publish directory**: `.` (root directory)
   - Click **Deploy site**

5. **Wait for deployment** (usually 1-2 minutes)

6. **Get your Netlify URL** (e.g., `https://your-site-name.netlify.app`)

#### Option B: Via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy site
netlify deploy --prod
```

### Step 3: Update CORS Settings in Render

After Netlify deployment, update Render backend:

1. Go to Render dashboard → Your backend service → **Environment** tab
2. Update `FRONTEND_ORIGIN` to your Netlify URL:
   - Example: `https://your-site-name.netlify.app`
   - **Important**: Include `https://` but no trailing slash
3. Click **Save Changes** - Render will redeploy

### Step 4: Test Everything

1. **Test Backend Health**: https://port-back-pa9x.onrender.com/api/health
   - Should return: `{"status":"ok","mock":false}`

2. **Test Frontend**:
   - Visit your Netlify URL
   - Open browser console (F12)
   - Click the chat widget
   - Send a test message
   - Check console for any errors

3. **Verify Chat Widget**:
   - Chat should connect to Render backend automatically
   - Messages should get AI responses
   - No CORS errors in console

## 🔧 Troubleshooting

### Chat Widget Not Working?

1. **Check Browser Console** (F12):
   - Look for CORS errors
   - Check if API URL is correct
   - Verify network requests

2. **Verify Backend is Running**:
   - Check Render dashboard for service status
   - Test health endpoint: https://port-back-pa9x.onrender.com/api/health

3. **Check CORS Settings**:
   - Ensure `FRONTEND_ORIGIN` in Render matches your Netlify URL exactly
   - Example: `https://your-site.netlify.app` (no trailing slash)

4. **Check Environment Variables**:
   - Verify `OPENROUTER_API_KEY` is set in Render
   - Check Render logs for errors

### Backend Not Responding?

1. **Check Render Logs**:
   - Go to Render dashboard → Your service → Logs
   - Look for startup errors

2. **Verify Dependencies**:
   - Ensure `package.json` has all dependencies
   - Check `node_modules` are installed

3. **Check Port**:
   - Render auto-assigns PORT, but verify it's not hardcoded

## 📝 Important Notes

- **Netlify URL**: Once deployed, your site will have a URL like `https://random-name.netlify.app`
- **Custom Domain**: You can add a custom domain in Netlify settings later
- **Environment Variables**: Netlify doesn't need env vars for this setup (API URL is hardcoded)
- **Auto-Deploy**: Both Render and Netlify can auto-deploy on git push if configured

## 🎉 Success Checklist

- [ ] Backend deployed to Render with correct env vars
- [ ] Frontend deployed to Netlify
- [ ] `FRONTEND_ORIGIN` set in Render to Netlify URL
- [ ] Health check works: https://port-back-pa9x.onrender.com/api/health
- [ ] Chat widget opens and sends messages
- [ ] AI responses work correctly
- [ ] No CORS errors in browser console
- [ ] Portfolio site loads correctly

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com
- Netlify Dashboard: https://app.netlify.com
- Backend Health: https://port-back-pa9x.onrender.com/api/health
- Backend API: https://port-back-pa9x.onrender.com/api/chat


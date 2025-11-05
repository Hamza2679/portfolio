# Troubleshooting Chat Widget - Server Error

## Quick Fixes

### If you're testing LOCALLY (localhost):

1. **Option A**: Make sure your backend is running locally on port 3000
   ```bash
   cd server
   npm start
   ```

2. **Option B**: If you want to use Render backend locally, temporarily enable CORS for all origins:
   - In Render dashboard → Environment → Add:
     - `CORS_ALLOW_DEV_ALL` = `1`
   - This allows all origins (use only for testing!)

### If you've deployed to Netlify:

1. **Get your Netlify URL** (e.g., `https://your-site.netlify.app`)

2. **Set CORS in Render**:
   - Go to Render dashboard → Your service → Environment
   - Add/Update: `FRONTEND_ORIGIN` = `https://your-site.netlify.app`
   - **Important**: Use exact URL format, no trailing slash
   - Save and wait for redeploy (1-2 minutes)

3. **Enable CORS Debugging** (temporarily):
   - In Render dashboard → Environment → Add:
     - `DEBUG_CORS` = `1`
   - Check Render logs to see what origin is being blocked

### Check Browser Console

1. Open your site in browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Try sending a message in chat
5. Look for error messages - they will now show more details

### Verify Backend is Working

Test the backend directly:
```bash
# Health check
curl https://port-back-pa9x.onrender.com/api/health

# Test chat endpoint (should fail CORS but show backend works)
curl -X POST https://port-back-pa9x.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

## Common Issues

### Issue: "CORS error" or "Not allowed by CORS"
**Solution**: Set `FRONTEND_ORIGIN` in Render to your Netlify URL

### Issue: "Network error" or "Could not connect"
**Solution**: 
- Check if backend URL is correct in `chat-widget.js`
- Verify Render service is running (check Render dashboard)
- Check browser console for actual error

### Issue: "Server error" (500)
**Solution**:
- Check Render logs for backend errors
- Verify `OPENROUTER_API_KEY` is set in Render
- Check if OpenRouter API key is valid

## Debugging Steps

1. **Check Render Logs**:
   - Go to Render dashboard → Your service → Logs
   - Look for CORS warnings or errors
   - Look for API errors

2. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Look for network errors
   - Check if API URL is correct
   - Look for CORS errors

3. **Test Backend Directly**:
   - Use curl or Postman to test backend
   - Verify health endpoint works
   - Check if chat endpoint responds

## Still Not Working?

1. **Enable Debug Mode**:
   - Set `DEBUG_CORS=1` in Render environment
   - Check logs to see what origin is being blocked

2. **Temporary Fix** (for testing only):
   - Set `CORS_ALLOW_DEV_ALL=1` in Render
   - This allows all origins (remove after testing!)

3. **Check API URL**:
   - Open browser console
   - Type: `window.CHAT_API_URL` or check Network tab
   - Verify it's pointing to `https://port-back-pa9x.onrender.com/api/chat`


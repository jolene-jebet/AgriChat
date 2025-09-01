# AgriChat Deployment Guide 🚀

## Quick Deployment Options

### 1. Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the entire `agrichat` folder
3. Your site will be live in seconds!

### 2. Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with zero configuration

### 3. GitHub Pages
1. Push code to GitHub repository
2. Go to repository Settings > Pages
3. Select source branch and deploy

### 4. Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Local Testing

### Start Development Server
```bash
cd agrichat
python3 -m http.server 8000
# Open http://localhost:8000
```

### VS Code Live Server
1. Install "Live Server" extension
2. Right-click index.html > "Open with Live Server"

## Production Checklist

- [ ] All files uploaded correctly
- [ ] HTTPS enabled (required for some features)
- [ ] API token configured (optional)
- [ ] Analytics added (optional)
- [ ] Custom domain configured (optional)

## Environment Variables (Optional)

Set these in your hosting platform:

- `HUGGINGFACE_API_TOKEN`: Default API token for all users
- `ANALYTICS_ID`: Google Analytics tracking ID
- `SENTRY_DSN`: Error tracking service

## Performance Optimization

- Enable gzip compression
- Set proper cache headers
- Use CDN for static assets
- Optimize images (if any)

## Security Headers

Add these headers for better security:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## Monitoring

- Set up uptime monitoring
- Monitor error rates
- Track user engagement
- Monitor API usage (if using real API)

---

**Your AgriChat is ready to help farmers worldwide! 🌱**

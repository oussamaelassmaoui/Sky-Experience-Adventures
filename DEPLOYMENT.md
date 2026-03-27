# Deployment Guide 🚀

## Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub: `imadev26/FrontendSky`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = Your backend API URL
5. Click "Deploy"

**Done! Your app will be live in ~2 minutes**

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import from Git"
3. Select `FrontendSky` repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Environment variables:
   - `NEXT_PUBLIC_API_URL` = Your backend URL
6. Deploy!

### Option 3: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

Add environment variable in Railway dashboard:
- `NEXT_PUBLIC_API_URL`

### Option 4: Docker

```bash
# Build
docker build -t skyexperience-frontend .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api.com/api \
  skyexperience-frontend
```

### Option 5: Traditional VPS (DigitalOcean, AWS, etc.)

```bash
# On your server
git clone https://github.com/imadev26/FrontendSky.git
cd FrontendSky

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your API URL

# Build
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start npm --name "skyexperience" -- start

# Or with systemd
sudo vim /etc/systemd/system/skyexperience.service
```

Example systemd service:
```ini
[Unit]
Description=SkyExperience Frontend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/FrontendSky
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production
Environment=NEXT_PUBLIC_API_URL=https://your-api.com/api

[Install]
WantedBy=multi-user.target
```

## Environment Variables

Required:
- `NEXT_PUBLIC_API_URL` - Your backend API endpoint

Example:
```env
NEXT_PUBLIC_API_URL=https://api.skyexperience.com/api
```

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Domain Settings → Add custom domain
2. Follow DNS configuration steps

### Cloudflare (Recommended for CDN)
1. Add your site to Cloudflare
2. Update nameservers
3. Enable:
   - Auto minification
   - Brotli compression
   - Caching

## SSL Certificate

Most platforms (Vercel, Netlify) provide automatic SSL.

For VPS:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Performance Optimization

### After Deployment

1. **Enable CDN** (Cloudflare recommended)
2. **Image Optimization**: Already handled by Next.js
3. **Caching**: Configure in your hosting platform
4. **Monitoring**: Add Google Analytics or similar

### Recommended Services

- **CDN**: Cloudflare (free)
- **Monitoring**: Vercel Analytics or Google Analytics
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot

## CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test # if you have tests
```

## Troubleshooting

### Build fails
- Check Node.js version (needs 20.x)
- Verify all dependencies installed
- Check `NEXT_PUBLIC_API_URL` is set

### API not connecting
- Verify API URL is correct
- Check CORS settings on backend
- Ensure backend is running

### Images not loading
- Check image paths in `public/images`
- Verify Cloudinary configuration if using

## Production Checklist

- [ ] Environment variables configured
- [ ] API URL points to production backend
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] CDN enabled
- [ ] Analytics added
- [ ] Error tracking setup
- [ ] Sitemap working (`/sitemap.xml`)
- [ ] Robots.txt configured (`/robots.txt`)
- [ ] Social media meta tags working
- [ ] Performance tested (Lighthouse score > 90)

## Support

Issues? Check:
1. [GitHub Issues](https://github.com/imadev26/FrontendSky/issues)
2. Documentation in README.md
3. Contact: imadev26@github

---

Happy Deploying! 🎈

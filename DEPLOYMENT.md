# 🚀 DeFi App Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account (https://vercel.com)
- WalletConnect Cloud account (https://cloud.walletconnect.com)
- GitHub repository

### Step 1: Prepare the Repository
1. Push your code to GitHub
2. Make sure all dependencies are properly listed in `package.json`

### Step 2: Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web` (for monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Environment Variables
Add these environment variables in Vercel dashboard:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NODE_ENV=production
VERCEL_URL=your_deployment_url.vercel.app
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your DeFi app will be live!

## 🔧 Configuration Files

### Vercel Configuration (`apps/web/vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"],
  "functions": {
    "src/app/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 🌐 Domain Configuration

### Custom Domain (Optional)
1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### HTTPS & SSL
- Vercel provides automatic HTTPS certificates
- All connections are secure by default

## 🔍 Monitoring & Analytics

### Vercel Analytics
1. Enable Analytics in Vercel dashboard
2. Monitor real user metrics
3. Track Core Web Vitals

### Error Monitoring
- Vercel provides built-in error tracking
- Check the "Functions" tab for API errors
- Monitor deployment logs

## 🚨 Production Considerations

### Security
- All API routes include proper CORS configuration
- Security headers are automatically applied
- Environment variables are encrypted

### Performance
- Automatic image optimization
- Global CDN distribution
- Edge functions for API routes

### Scaling
- Vercel automatically scales based on traffic
- No server management required
- Pay-as-you-go pricing

## 🔄 Updates & Maintenance

### Deploying Updates
1. Push changes to main branch
2. Vercel automatically redeploys
3. Preview deployments for pull requests

### Rollbacks
- Use Vercel's deployment history
- Roll back to previous versions instantly

## 📊 Available Endpoints

Your DeFi app will have these API endpoints:

- `GET /api/tokens` - Token list
- `GET /api/tokens/popular` - Popular tokens
- `GET /api/pools` - Staking/farming pools
- `GET /api/pools/stats/tvl` - TVL statistics
- `GET /api/pools/stats/apr` - APR statistics
- `GET /api/users/[address]/positions` - User positions
- `GET /api/users/[address]/portfolio` - User portfolio
- `GET /api/quotes` - Swap quotes
- `GET /api/stats/overview` - Platform statistics

## 🎯 Features Available

✅ **Trading**: Token swaps with live quotes
✅ **Staking**: Single-asset staking pools
✅ **Farming**: LP token farming
✅ **Portfolio**: Complete position tracking
✅ **Multi-chain**: Ethereum & BSC support
✅ **Wallet Integration**: MetaMask, WalletConnect

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check package.json dependencies
   - Ensure all workspace packages are listed
   - Verify TypeScript compilation

2. **API Errors**
   - Check Vercel function logs
   - Verify environment variables
   - Test API routes locally first

3. **Wallet Connection Issues**
   - Verify WalletConnect project ID
   - Check browser console for errors
   - Ensure HTTPS in production

### Support
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- WalletConnect Docs: https://docs.walletconnect.com/

---

🎉 **Your DeFi app is now ready for production deployment!**

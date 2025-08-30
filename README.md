# 🚀 DeFi App - Non-Custodial Trading, Staking & Farming

A comprehensive DeFi platform built with Next.js, featuring token trading, staking pools, and yield farming across multiple blockchains.

## 🌟 Features

### 💱 **Trading**
- Token swap interface with live quotes
- Multi-hop routing optimization
- Slippage protection and gas estimation
- Price impact calculations

### 🏦 **Staking**
- Single-asset staking pools
- Flexible lock periods with boost multipliers
- Real-time APR/APY calculations
- Reward claiming and compounding

### 🌾 **Farming**
- Liquidity pool farming
- Multiple reward tokens
- Auto-compounding vaults
- Farm performance analytics

### 📊 **Portfolio**
- Comprehensive position tracking
- Performance charts and analytics
- PnL calculations
- Cross-platform holdings

### 🔐 **Security**
- Non-custodial architecture
- Direct blockchain interactions
- Multi-signature admin controls
- Audited smart contracts

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **wagmi/viem** - Ethereum interactions
- **WalletConnect** - Multi-wallet support

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **TypeScript** - Full-stack type safety

### Smart Contracts
- **Solidity ^0.8.20** - Smart contract language
- **OpenZeppelin** - Battle-tested contracts
- **Hardhat** - Development framework

### Infrastructure
- **Vercel** - Deployment platform
- **Monorepo** - Turborepo workspace management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd defi-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your configuration
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
defi-app/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router pages & API routes
│   │   │   ├── components/  # React components
│   │   │   └── lib/         # Utilities & configurations
│   └── indexer/             # NestJS backend (converted to API routes)
├── packages/
│   ├── sdk/                 # Shared SDK with types & utilities
│   └── ui/                  # Shared UI components
├── contracts/               # Solidity smart contracts
│   ├── contracts/           # Contract source files
│   ├── scripts/             # Deployment scripts
│   └── test/                # Contract tests
└── turbo.json               # Monorepo configuration
```

## 🎯 Available Scripts

### Root Level
```bash
npm run build        # Build all packages and apps
npm run dev          # Start all development servers
npm run lint         # Run ESLint across all packages
npm run clean        # Clean build artifacts
```

### Frontend (apps/web)
```bash
cd apps/web
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Smart Contracts (contracts)
```bash
cd contracts
npm run compile      # Compile contracts
npm run test         # Run contract tests
npm run deploy       # Deploy contracts
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `apps/web`

2. **Configure environment variables**
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NODE_ENV=production
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `your-app.vercel.app`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔧 Configuration

### Environment Variables

Create `.env.local` in `apps/web/`:

```env
# WalletConnect (required)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# API Configuration (optional - defaults to local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Development
NODE_ENV=development

# Vercel (auto-populated in production)
VERCEL_URL=your_deployment_url.vercel.app
```

### WalletConnect Setup

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID
4. Add to your environment variables

## 📚 API Documentation

### Endpoints

- `GET /api/tokens` - Token list and search
- `GET /api/tokens/popular` - Popular tokens
- `GET /api/pools` - Staking and farming pools
- `GET /api/pools/stats/tvl` - TVL statistics
- `GET /api/pools/stats/apr` - APR statistics
- `GET /api/users/[address]/positions` - User positions
- `GET /api/users/[address]/portfolio` - User portfolio
- `GET /api/quotes` - Swap quotes
- `GET /api/stats/overview` - Platform statistics

## 🔒 Security

- **Non-custodial**: Users maintain control of their funds
- **Audit-ready**: Smart contracts follow best practices
- **Input validation**: All API inputs are validated
- **Rate limiting**: Automatic rate limiting on API routes
- **HTTPS only**: All connections are encrypted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Next.js Docs](https://nextjs.org/docs)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) - Secure smart contracts
- [wagmi](https://wagmi.sh/) - Ethereum React hooks
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

**Built with ❤️ for the DeFi community**

# DeFi Indexer API

A comprehensive REST API for DeFi data indexing and analytics.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# API will be available at http://localhost:3001/api
```

## 📚 API Endpoints

### Tokens

#### `GET /api/tokens`
Get list of supported tokens.

**Query Parameters:**
- `chainId` (optional): Filter by chain ID
- `search` (optional): Search by symbol or name

**Example:**
```bash
GET /api/tokens?chainId=56&search=USDT
```

#### `GET /api/tokens/popular`
Get popular tokens for a chain.

**Query Parameters:**
- `chainId`: Chain ID (required)

#### `GET /api/tokens/:address`
Get specific token details.

**Parameters:**
- `address`: Token contract address
- `chainId`: Chain ID (query parameter)

### Pools

#### `GET /api/pools`
Get list of staking and farming pools.

**Query Parameters:**
- `chainId` (optional): Filter by chain ID
- `type` (optional): Filter by pool type (`stake` or `farm`)

**Example:**
```bash
GET /api/pools?chainId=56&type=stake
```

#### `GET /api/pools/:id`
Get specific pool details.

#### `GET /api/pools/stats/tvl`
Get total value locked statistics.

#### `GET /api/pools/stats/apr`
Get average APR statistics.

### Users

#### `GET /api/users/:address/positions`
Get user's positions across all pools.

#### `GET /api/users/:address/portfolio`
Get user's complete portfolio summary.

#### `GET /api/users/:address/stats`
Get user's statistics and analytics.

### Quotes

#### `GET /api/quotes`
Get swap quote for token pair.

**Query Parameters:**
- `chainId`: Chain ID (required)
- `in`: Input token address (required)
- `out`: Output token address (required)
- `amount`: Input amount (required)
- `slippage`: Slippage tolerance (default: 0.5)

**Example:**
```bash
GET /api/quotes?chainId=56&in=0x55d398326f99059fF775485246999027B3197955&out=0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d&amount=100&slippage=0.5
```

### Stats

#### `GET /api/stats/overview`
Get platform overview statistics.

#### `GET /api/stats/tvl`
Get TVL statistics.

#### `GET /api/stats/volume`
Get trading volume statistics.

#### `GET /api/stats/pools`
Get pool statistics.

## 📊 Response Examples

### Token Response
```json
{
  "chainId": 56,
  "address": "0x55d398326f99059fF775485246999027B3197955",
  "symbol": "USDT",
  "decimals": 18,
  "name": "Tether USD"
}
```

### Pool Response
```json
{
  "id": "pool-1",
  "type": "stake",
  "chainId": 56,
  "token": { /* token object */ },
  "apr": 12.5,
  "apy": 13.1,
  "tvl": 2500000,
  "startTime": 1703126400,
  "endTime": 1705718400,
  "isLocked": false,
  "status": "active"
}
```

### Swap Quote Response
```json
{
  "route": [/* token objects */],
  "inAmount": "100",
  "outAmount": "95.25",
  "minReceived": "94.77",
  "priceImpact": 0.5,
  "feeBps": 30,
  "gasEstimate": "200000"
}
```

## 🔧 Configuration

Create a `.env` file in the indexer directory:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://username:password@localhost:5432/defi_indexer
REDIS_URL=redis://localhost:6379
BSC_RPC_URL=https://bsc-dataseed.binance.org/
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:cov
```

## 📝 Development

```bash
# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build
```

## 🔗 Integration

This API is designed to work seamlessly with the DeFi frontend application. All endpoints support CORS and return JSON responses with proper error handling.

For production deployment, consider:
- Rate limiting
- API authentication
- Database optimization
- Redis caching
- Monitoring and logging
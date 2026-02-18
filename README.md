# Crypto AI Terminal - Enhanced Features

## Overview
A professional crypto trading terminal with live price tracking, prediction markets, news aggregation, and whale liquidation monitoring.

## Features

### 1. 🔴 News Radar
Live cryptocurrency news aggregation from multiple sources with intelligent filtering.

**Features:**
- Aggregates news from CoinDesk, Cointelegraph, and CryptoSlate
- Prioritizes articles mentioning BTC, ETH, SOL keywords
- Color-coded priority system (red = high priority, blue = standard)
- Hover effects for better UX
- Auto-refresh on page load

### 2. 💰 Polshi Hub - Prediction Markets & Arbitrage Detection
Real-time prediction market integration with automated arbitrage detection.

**Features:**
- **Live Data Integration:**
  - Polymarket API integration
  - Kalshi API integration (with authentication)
  - Filters for YES/NO binary markets
  - Timeframes: 15-minute, 1-hour, 4-hour markets
  - Tracks BTC, ETH, and SOL price predictions

- **Arbitrage Detection Algorithm:**
  - Compares prices between Polymarket and Kalshi
  - Detects opportunities with >5% price discrepancy
  - Calculates discount percentage and profit multipliers
  - **Gold highlighting** for profitable arbitrage opportunities
  - Shows which platform to buy from and potential profit

- **Display Metrics:**
  - Real-time price in cents (¢)
  - Trading volume for each market
  - Discount percentage
  - Profit multiplier (e.g., 1.15x)
  - Buy recommendation

### 3. 🐋 Whale Liquidation Tracker
Real-time tracking of large liquidation events across major crypto exchanges.

**Features:**
- **Data Sources:**
  - Coinglass API integration (when API key provided)
  - Binance Futures API fallback
  - Live Binance WebSocket stream

- **Whale Definition:**
  - Default threshold: $500,000+ liquidations
  - Tracks top cryptocurrencies (BTC, ETH, SOL, etc.)

- **Display Information:**
  - Coin symbol
  - Liquidation amount (formatted in K/M)
  - Position direction (LONG/SHORT)
  - Liquidation price
  - Exchange name
  - Timestamp

- **Color Coding:**
  - 🔴 RED for liquidated LONG positions
  - 🟢 GREEN for liquidated SHORT positions

- **Filtering & Sorting:**
  - Filter by: ALL, LONG, or SHORT positions
  - Sort by: TIME (most recent) or SIZE (largest first)
  - Real-time updates every 30 seconds

## Setup

### Environment Variables
Create a `.env.local` file with the following variables:

```bash
# Kalshi API (required for Kalshi integration)
KALSHI_KEY_ID=your_kalshi_key_id
KALSHI_PRIVATE_KEY=your_kalshi_private_key

# Coinglass API (optional, for enhanced liquidation data)
COINGLASS_API_KEY=your_coinglass_api_key

# Alternative liquidation data source (optional)
COINAYZLE_URL=your_custom_liquidation_endpoint
```

### Installation
```bash
npm install
# or
yarn install
```

### Running the Application
```bash
npm run dev
# or
yarn dev
```

Navigate to `http://localhost:3000` to view the terminal.

## API Endpoints

### `/api/whale-liquidations`
Returns recent whale liquidations above the threshold.

**Response:**
```json
{
  "success": true,
  "threshold": 500000,
  "count": 20,
  "data": [
    {
      "id": "btc-1234567890",
      "symbol": "BTC",
      "amount": 1250000,
      "side": "long",
      "price": 42500,
      "exchange": "Binance",
      "timestamp": 1234567890000,
      "source": "binance"
    }
  ]
}
```

### `/api/liquidations`
Returns top coins by liquidation wick metric (for the legacy liquidations page).

## Technical Details

### Arbitrage Detection Algorithm
The arbitrage detection algorithm compares prices between Polymarket and Kalshi:

1. **Price Extraction:** Fetches YES/NO market prices from both platforms
2. **Spread Calculation:** Calculates absolute price difference
3. **Threshold Check:** Identifies opportunities with >5% spread
4. **Metrics Calculation:**
   - Discount percentage: `((sellPrice - buyPrice) / sellPrice) * 100`
   - Profit multiplier: `sellPrice / buyPrice`
5. **Visual Highlighting:** Applies gold border and glow effect to arbitrage rows

### Whale Liquidation Data Flow
1. Primary: Attempts to fetch from Coinglass API (requires API key)
2. Fallback: Fetches from Binance Futures public API
3. Mock Data: Generates realistic mock data for demonstration
4. Live Stream: WebSocket connection to Binance for real-time updates

## Technologies Used
- **Framework:** Next.js (React)
- **APIs:** Polymarket, Kalshi, Coinglass, Binance
- **WebSocket:** Binance Stream for real-time price and liquidation data
- **RSS Parsing:** Multiple crypto news feeds
- **Styling:** Inline CSS with dark theme

## Color Scheme
- Background: `#0b0e14` (Dark navy)
- Cards: `#151a23` (Slightly lighter)
- Borders: `#334155` (Slate)
- Primary: `#3b82f6` (Blue)
- Success: `#22c55e` (Green)
- Danger: `#ef4444` (Red)
- Warning: `#fbbf24` (Gold/Yellow)

## Future Enhancements
- Real-time WebSocket for Polymarket and Kalshi
- More granular arbitrage thresholds
- Historical liquidation charts
- Push notifications for whale liquidations
- Multi-exchange liquidation aggregation
- Advanced filtering by coin, exchange, and time range

## License
MIT

## Credits
Built for professional crypto traders seeking real-time market intelligence.

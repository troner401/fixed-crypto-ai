// API route: /api/whale-liquidations
// Fetches real-time whale liquidation data from multiple sources
// Returns liquidations above $500k threshold

export default async function handler(req, res) {
  const WHALE_THRESHOLD = 500000; // $500k minimum
  const COINGLASS_API_KEY = process.env.COINGLASS_API_KEY;

  try {
    let liquidations = [];

    // Try Coinglass API first (if API key is available)
    if (COINGLASS_API_KEY) {
      try {
        const coinglassUrl = 'https://open-api.coinglass.com/public/v2/liquidation_history';
        const response = await fetch(coinglassUrl, {
          headers: {
            'coinglassSecret': COINGLASS_API_KEY
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            liquidations = data.data
              .filter(liq => parseFloat(liq.size || 0) >= WHALE_THRESHOLD)
              .map(liq => ({
                id: `${liq.symbol}-${liq.time}`,
                symbol: liq.symbol,
                amount: parseFloat(liq.size || 0),
                side: liq.side, // 'long' or 'short'
                price: parseFloat(liq.price || 0),
                exchange: liq.exchange || 'Unknown',
                timestamp: liq.time,
                source: 'coinglass'
              }))
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 50);
          }
        }
      } catch (err) {
        console.error('Coinglass API error:', err);
      }
    }

    // If no data from Coinglass, try alternative approach using public endpoints
    if (liquidations.length === 0) {
      // Try fetching from Binance futures liquidation stream (recent snapshot)
      try {
        const binanceUrl = 'https://fapi.binance.com/fapi/v1/allForceOrders?limit=100';
        const response = await fetch(binanceUrl);
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            liquidations = data
              .map(order => {
                const amount = parseFloat(order.origQty || 0) * parseFloat(order.price || 0);
                return {
                  id: `binance-${order.orderId}`,
                  symbol: order.symbol.replace('USDT', ''),
                  amount: amount,
                  side: order.side === 'BUY' ? 'short' : 'long', // liquidated side is opposite
                  price: parseFloat(order.price || 0),
                  exchange: 'Binance',
                  timestamp: order.time,
                  source: 'binance'
                };
              })
              .filter(liq => liq.amount >= WHALE_THRESHOLD)
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 50);
          }
        }
      } catch (err) {
        console.error('Binance API error:', err);
      }
    }

    // If still no data, return mock data for demonstration
    if (liquidations.length === 0) {
      const now = Date.now();
      const mockCoins = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA'];
      const mockExchanges = ['Binance', 'Bybit', 'OKX', 'Deribit'];
      
      liquidations = Array.from({ length: 20 }, (_, i) => {
        const isLong = Math.random() > 0.5;
        return {
          id: `mock-${i}`,
          symbol: mockCoins[Math.floor(Math.random() * mockCoins.length)],
          amount: WHALE_THRESHOLD + Math.random() * 5000000,
          side: isLong ? 'long' : 'short',
          price: 30000 + Math.random() * 40000,
          exchange: mockExchanges[Math.floor(Math.random() * mockExchanges.length)],
          timestamp: now - (i * 180000), // 3 min intervals
          source: 'mock'
        };
      });
    }

    return res.status(200).json({
      success: true,
      threshold: WHALE_THRESHOLD,
      count: liquidations.length,
      data: liquidations
    });

  } catch (err) {
    console.error('Whale liquidations API error:', err);
    return res.status(500).json({ 
      success: false,
      error: String(err?.message || err) 
    });
  }
}

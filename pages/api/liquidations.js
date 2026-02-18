// API route: /api/liquidations
// Returns top coins sorted by a heuristic 'liquidation wick' metric.
// Behavior:
// - If `process.env.COINAYZLE_URL` is set, proxy that endpoint and return its JSON.
// - Otherwise, fetch market data from CoinGecko and compute a heuristic wick.

export default async function handler(req, res) {
  const COINAYZLE_URL = process.env.COINAYZLE_URL;

  try {
    if (COINAYZLE_URL) {
      const r = await fetch(COINAYZLE_URL);
      if (!r.ok) throw new Error(`coinayzle fetch failed: ${r.status}`);
      const body = await r.json();
      return res.status(200).json({ source: 'coinayzle', data: body });
    }

    // Fallback: use public CoinGecko markets endpoint and compute a simple wick metric.
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    const r = await fetch(url);
    if (!r.ok) throw new Error(`coingecko fetch failed: ${r.status}`);
    const markets = await r.json();

    // Compute heuristic: wick = (high_24h - low_24h) / max(1, current_price)
    // ai_score is an illustrative confidence number derived from wick and volume.
    const processed = markets
      .map((m) => {
        const high = m.high_24h ?? 0;
        const low = m.low_24h ?? 0;
        const current = m.current_price ?? 0;
        const wick = current > 0 ? (high - low) / Math.max(1, current) : 0;
        const volume = m.total_volume ?? 0;
        // ai_score in 0-100: scale wick and add small weight for volume
        const rawScore = wick * 100 + Math.log10(Math.max(1, volume)) * 2;
        const ai_score = Math.min(100, Math.max(0, Math.round(rawScore)));

        return {
          id: m.id,
          symbol: m.symbol,
          name: m.name,
          image: m.image,
          current_price: m.current_price,
          high_24h: m.high_24h ?? null,
          low_24h: m.low_24h ?? null,
          wick: Number(wick.toFixed(6)),
          wick_pct: Number((wick * 100).toFixed(2)),
          market_cap: m.market_cap ?? null,
          total_volume: volume,
          ai_score,
        };
      })
      .sort((a, b) => b.wick - a.wick)
      .slice(0, 30);

    return res.status(200).json({ source: 'coingecko_heuristic', data: processed });
  } catch (err) {
    return res.status(500).json({ error: String(err?.message ?? err) });
  }
}

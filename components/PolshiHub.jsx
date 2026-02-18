import React from "react";

export default function PolshiHub({ poly, kalshi }) {
  const intervals = ["15m", "1h", "4h"];
  const coins = ["BTC", "ETH", "SOL"];

  const getMarketData = (platformData, coin, time, platform) => {
    // Advanced searching for the exact timeframe + coin
    const match = platformData.find(m => {
        const t = (m.title || "").toLowerCase();
        const c = coin.toLowerCase();
        const fullCoin = coin === 'BTC' ? 'bitcoin' : coin === 'ETH' ? 'ethereum' : 'solana';
        const fullTime = time.replace('m', ' minute').replace('h', ' hour');
        
        return (t.includes(c) || t.includes(fullCoin)) && 
               (t.includes(time.replace('m', '')) || t.includes(fullTime));
    });

    if (!match) return { price: null, priceNum: null, vol: "0", rawVol: 0 };

    // DRILL: Check multiple platform price fields
    let pRaw = null;
    if (platform === 'poly') {
      // Polymarket: prices are in 0-1 range or 0-100 range
      pRaw = match.markets?.[0]?.outcomePrices?.[0] 
        ? parseFloat(match.markets[0].outcomePrices[0]) * 100 
        : match.price || match.yes_bid;
    } else {
      // Kalshi: prices are in cents (0-100)
      pRaw = match.yes_bid || match.price || match.last_price;
    }

    const priceNum = pRaw ? parseFloat(pRaw) : null;
    const price = priceNum ? `${priceNum.toFixed(1)}¢` : "N/A";
    
    // Volume: Handle Poly (USD) vs Kalshi (Contracts)
    const volVal = match.volume || match.markets?.[0]?.volume || 0;
    const vol = volVal > 0 ? `$${Math.round(volVal).toLocaleString()}` : "LOW VOL";
    
    return { price, priceNum, vol, rawVol: volVal };
  };

  // Arbitrage detection algorithm
  const detectArbitrage = (polyPrice, kalshiPrice) => {
    if (!polyPrice || !kalshiPrice) return null;
    
    const THRESHOLD = 5; // 5% difference threshold
    const spread = Math.abs(polyPrice - kalshiPrice);
    const spreadPct = (spread / Math.max(polyPrice, kalshiPrice)) * 100;
    
    if (spreadPct < THRESHOLD) return null;
    
    // Calculate arbitrage metrics
    const buyFrom = polyPrice < kalshiPrice ? 'poly' : 'kalshi';
    const sellTo = polyPrice < kalshiPrice ? 'kalshi' : 'poly';
    const buyPrice = Math.min(polyPrice, kalshiPrice);
    const sellPrice = Math.max(polyPrice, kalshiPrice);
    const discount = ((sellPrice - buyPrice) / sellPrice) * 100;
    const multiplier = sellPrice / buyPrice;
    const profitPct = ((multiplier - 1) * 100);
    
    return {
      exists: true,
      buyFrom,
      sellTo,
      buyPrice,
      sellPrice,
      spread,
      spreadPct,
      discount,
      multiplier,
      profitPct
    };
  };

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr', gap:20}}>
      <h2 style={{color:'#3b82f6', borderBottom:'1px solid #1e293b', paddingBottom:10, letterSpacing:'1px'}}>
        BINARY PRICE TARGETS (YES/NO)
        <span style={{marginLeft:15, fontSize:'0.7rem', color:'#fbbf24'}}>
          ⚡ Gold = Arbitrage Opportunity
        </span>
      </h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}}>
        {coins.map(coin => (
          <div key={coin} className="card" style={{borderTop: '3px solid #3b82f6'}}>
            <h3 style={{marginTop:0, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              {coin} 
              <span style={{fontSize:'0.65rem', color:'#64748b', fontWeight:'bold', background:'#1e293b', padding:'2px 6px', borderRadius:4}}>LIVE VOL</span>
            </h3>
            <table style={{width:'100%', fontSize:'0.8rem', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{color:'#64748b', textAlign:'left'}}>
                  <th style={{paddingBottom:10}}>TIME</th>
                  <th style={{paddingBottom:10}}>POLY</th>
                  <th style={{paddingBottom:10}}>KALSHI</th>
                  <th style={{paddingBottom:10}}>ARB</th>
                </tr>
              </thead>
              <tbody>
                {intervals.map(time => {
                  const pData = getMarketData(poly, coin, time, 'poly');
                  const kData = getMarketData(kalshi, coin, time, 'kalshi');
                  const arb = detectArbitrage(pData.priceNum, kData.priceNum);
                  
                  return (
                    <tr 
                      key={time} 
                      className={arb ? 'arb-gold' : ''} 
                      style={{
                        height:60, 
                        borderTop:'1px solid #1e293b',
                        position: 'relative'
                      }}
                    >
                      <td style={{fontWeight:'bold', color:'#94a3b8'}}>{time}</td>
                      <td style={{
                        background: arb && arb.buyFrom === 'poly' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                        padding: '8px',
                        borderRadius: '4px'
                      }}>
                        <div style={{
                          color: arb && arb.buyFrom === 'poly' ? '#22c55e' : '#4ade80', 
                          fontWeight:'bold', 
                          fontSize:'1.1rem'
                        }}>
                          {pData.price}
                        </div>
                        <div style={{fontSize:'0.6rem', color:'#64748b', marginTop:2}}>{pData.vol}</div>
                      </td>
                      <td style={{
                        background: arb && arb.buyFrom === 'kalshi' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                        padding: '8px',
                        borderRadius: '4px'
                      }}>
                        <div style={{
                          color: arb && arb.buyFrom === 'kalshi' ? '#22c55e' : '#ef4444', 
                          fontWeight:'bold', 
                          fontSize:'1.1rem'
                        }}>
                          {kData.price}
                        </div>
                        <div style={{fontSize:'0.6rem', color:'#64748b', marginTop:2}}>{kData.vol}</div>
                      </td>
                      <td>
                        {arb ? (
                          <div style={{fontSize:'0.65rem'}}>
                            <div style={{color:'#fbbf24', fontWeight:'bold'}}>
                              {arb.discount.toFixed(1)}% 💰
                            </div>
                            <div style={{color:'#22c55e', fontSize:'0.55rem', marginTop:2}}>
                              {arb.multiplier.toFixed(2)}x
                            </div>
                            <div style={{color:'#64748b', fontSize:'0.5rem', marginTop:1}}>
                              Buy {arb.buyFrom.toUpperCase()}
                            </div>
                          </div>
                        ) : (
                          <div style={{color:'#64748b', fontSize:'0.6rem'}}>
                            {pData.priceNum && kData.priceNum ? 'No arb' : '—'}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
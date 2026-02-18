import React, { useState, useEffect } from "react";

export default function Liquidations({ history }) {
  const [whaleLiquidations, setWhaleLiquidations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'long', 'short'
  const [sortBy, setSortBy] = useState('time'); // 'time' or 'size'
  const [threshold, setThreshold] = useState(500000);

  // Fetch whale liquidations from API
  useEffect(() => {
    let mounted = true;
    
    const fetchWhaleLiquidations = async () => {
      try {
        const response = await fetch('/api/whale-liquidations');
        if (!response.ok) throw new Error('Failed to fetch liquidations');
        
        const data = await response.json();
        if (mounted && data.success) {
          setWhaleLiquidations(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching whale liquidations:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchWhaleLiquidations();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchWhaleLiquidations, 30000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Filter and sort liquidations
  const filteredLiquidations = whaleLiquidations
    .filter(liq => {
      if (filter === 'all') return true;
      return liq.side.toLowerCase() === filter;
    })
    .filter(liq => liq.amount >= threshold)
    .sort((a, b) => {
      if (sortBy === 'size') {
        return b.amount - a.amount;
      }
      return b.timestamp - a.timestamp;
    });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottom: '1px solid #1e293b',
        paddingBottom: 10
      }}>
        <h2 style={{color:'#3b82f6', margin: 0, letterSpacing:'1px'}}>
          🐋 WHALE LIQUIDATION TRACKER
        </h2>
        <div style={{fontSize:'0.75rem', color:'#64748b'}}>
          Min: ${(threshold / 1000).toFixed(0)}K
        </div>
      </div>

      {/* Filters and Controls */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 20,
        flexWrap: 'wrap'
      }}>
        <div style={{display: 'flex', gap: 5}}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: filter === 'all' ? '#3b82f6' : '#1e293b',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          >
            ALL
          </button>
          <button
            onClick={() => setFilter('long')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: filter === 'long' ? '#ef4444' : '#1e293b',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          >
            LONG
          </button>
          <button
            onClick={() => setFilter('short')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: filter === 'short' ? '#22c55e' : '#1e293b',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          >
            SHORT
          </button>
        </div>

        <div style={{display: 'flex', gap: 5}}>
          <button
            onClick={() => setSortBy('time')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: sortBy === 'time' ? '#3b82f6' : '#1e293b',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          >
            ⏰ TIME
          </button>
          <button
            onClick={() => setSortBy('size')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: sortBy === 'size' ? '#3b82f6' : '#1e293b',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          >
            💰 SIZE
          </button>
        </div>
      </div>

      {/* Whale Liquidations Table */}
      <div className="card" style={{background:'#0f172a', border:'1px solid #3b82f6', marginBottom: 20}}>
        <h3 style={{padding:'0 20px', fontSize:'1.2rem', margin: '10px 0'}}>
          Whale Liquidations (${(threshold/1000).toFixed(0)}K+)
        </h3>
        
        {loading ? (
          <p style={{padding:20, color:'#64748b'}}>Loading whale liquidations...</p>
        ) : filteredLiquidations.length === 0 ? (
          <p style={{padding:20, color:'#64748b'}}>No whale liquidations found matching the current filters.</p>
        ) : (
          <div style={{maxHeight: '400px', overflowY: 'auto'}}>
            {filteredLiquidations.map((liq, i) => (
              <div 
                key={liq.id || i} 
                style={{
                  display:'flex', 
                  justifyContent:'space-between', 
                  alignItems: 'center',
                  padding:'15px 20px', 
                  borderBottom:'1px solid #1e293b',
                  background: i % 2 === 0 ? 'rgba(15, 23, 42, 0.5)' : 'transparent'
                }}
              >
                <span style={{
                  color:'#fb923c', 
                  fontWeight:'bold', 
                  width:'80px',
                  fontSize: '1rem'
                }}>
                  {liq.symbol}
                </span>
                
                <span style={{
                  color: liq.side.toLowerCase() === 'long' ? '#ef4444' : '#22c55e',
                  fontWeight:'bold',
                  width:'80px',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  background: liq.side.toLowerCase() === 'long' 
                    ? 'rgba(239, 68, 68, 0.1)' 
                    : 'rgba(34, 197, 94, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {liq.side.toUpperCase()}
                </span>
                
                <span style={{
                  color:'#fbbf24', 
                  fontWeight:'bold',
                  width:'120px',
                  textAlign: 'right',
                  fontSize: '0.95rem'
                }}>
                  {formatAmount(liq.amount)}
                </span>
                
                <span style={{
                  color:'#64748b',
                  width:'100px',
                  textAlign: 'center',
                  fontSize: '0.75rem'
                }}>
                  ${(liq.price || 0).toLocaleString()}
                </span>
                
                <span style={{
                  color:'#94a3b8',
                  width:'100px',
                  textAlign: 'center',
                  fontSize: '0.75rem'
                }}>
                  {liq.exchange}
                </span>
                
                <span style={{
                  color:'#94a3b8', 
                  fontSize:'0.75rem',
                  width:'100px',
                  textAlign: 'right'
                }}>
                  {formatTime(liq.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Binance Feed (Original) */}
      <div className="card" style={{background:'#0f172a', border:'1px solid #64748b'}}>
        <h3 style={{padding:'0 20px', fontSize:'1rem', margin: '10px 0', color: '#64748b'}}>
          Live Binance Liquidation Feed
        </h3>
        {history.length === 0 ? (
          <p style={{padding:20, color:'#64748b'}}>Listening for movements on Binance...</p>
        ) : (
          <div style={{maxHeight: '200px', overflowY: 'auto'}}>
            {history.map((l, i) => (
              <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 20px', borderBottom:'1px solid #1e293b'}}>
                <span style={{color:'#fb923c', fontWeight:'bold', width:'80px'}}>{l.symbol}</span>
                <span style={{color:'#64748b', fontSize: '0.8rem'}}>Qty: {parseFloat(l.qty).toFixed(3)}</span>
                <span style={{color:'#ef4444', fontWeight:'bold', fontSize: '0.85rem'}}>${parseFloat(l.price).toLocaleString()}</span>
                <span style={{color:'#94a3b8', fontSize:'0.75rem'}}>{l.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
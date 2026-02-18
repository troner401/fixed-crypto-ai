import React from "react";

export default function MetalsLiquidations({ history, whaleMovements }) {
  return (
    <div>
      <div className="card" style={{background:'#0f172a', border:'1px solid #fbbf24', marginBottom: 20}}>
        <h1 style={{padding:'0 20px', fontSize:'1.5rem', color:'#fbbf24'}}>🐋 Whale Movements (Gold & Silver)</h1>
        <div style={{padding:'0 20px', fontSize:'0.75rem', color:'#64748b', marginBottom: 10}}>
          ⚠️ Simulated data for demonstration purposes
        </div>
        {whaleMovements.length === 0 ? (
          <p style={{padding:20, color:'#64748b'}}>Monitoring large precious metals trades...</p>
        ) : (
          whaleMovements.map((w, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'15px 20px', borderBottom:'1px solid #1e293b'}}>
              <span style={{color:'#fbbf24', fontWeight:'bold', width:'80px'}}>{w.metal}</span>
              <span style={{color:'#64748b'}}>Volume: {parseFloat(w.volume).toFixed(2)} oz</span>
              <span style={{color:'#4ade80', fontWeight:'bold'}}>${parseFloat(w.price).toLocaleString()}</span>
              <span style={{color:'#94a3b8', fontSize:'0.8rem'}}>{w.time}</span>
            </div>
          ))
        )}
      </div>

      <div className="card" style={{background:'#0f172a', border:'1px solid #ef4444'}}>
        <h1 style={{padding:'0 20px', fontSize:'1.5rem', color:'#ef4444'}}>⚡ Liquidation Feed (Gold & Silver)</h1>
        <div style={{padding:'0 20px', fontSize:'0.75rem', color:'#64748b', marginBottom: 10}}>
          ⚠️ Simulated data for demonstration purposes
        </div>
        {history.length === 0 ? (
          <p style={{padding:20, color:'#64748b'}}>Listening for liquidations in precious metals markets...</p>
        ) : (
          history.map((l, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'15px 20px', borderBottom:'1px solid #1e293b'}}>
              <span style={{color:'#fb923c', fontWeight:'bold', width:'80px'}}>{l.metal}</span>
              <span style={{color:'#64748b'}}>Qty: {parseFloat(l.qty).toFixed(3)} oz</span>
              <span style={{color:'#ef4444', fontWeight:'bold'}}>${parseFloat(l.price).toLocaleString()}</span>
              <span style={{color:'#94a3b8', fontSize:'0.8rem'}}>{l.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

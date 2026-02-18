import React from "react";

export default function Liquidations({ history }) {
  return (
    <div className="card" style={{background:'#0f172a', border:'1px solid #3b82f6'}}>
      <h1 style={{padding:'0 20px', fontSize:'1.5rem'}}>Live Liquidation Feed</h1>
      {history.length === 0 ? (
        <p style={{padding:20, color:'#64748b'}}>Listening for whale movements on Binance...</p>
      ) : (
        history.map((l, i) => (
          <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'15px 20px', borderBottom:'1px solid #1e293b'}}>
            <span style={{color:'#fb923c', fontWeight:'bold', width:'80px'}}>{l.symbol}</span>
            <span style={{color:'#64748b'}}>Qty: {parseFloat(l.qty).toFixed(3)}</span>
            <span style={{color:'#ef4444', fontWeight:'bold'}}>${parseFloat(l.price).toLocaleString()}</span>
            <span style={{color:'#94a3b8', fontSize:'0.8rem'}}>{l.time}</span>
          </div>
        ))
      )}
    </div>
  );
}
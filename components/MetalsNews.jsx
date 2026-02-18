import React from "react";

export default function MetalsNews({ items }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(350px, 1fr))', gap:20}}>
      {items.map(item => (
        <a key={item.id} href={item.link} target="_blank" rel="noreferrer" style={{textDecoration:'none', color:'inherit'}}>
          <div className="card" style={{
            borderLeft: item.color==='red' ? '4px solid #ef4444' : item.color==='blue' ? '4px solid #3b82f6' : '4px solid #6b7280',
            minHeight: '140px'
          }}>
            <div style={{fontWeight:'bold', marginBottom:8}}>{item.title}</div>
            <div style={{fontSize:'0.85rem', color:'#94a3b8', marginBottom:10, lineHeight:'1.4'}}>
              {item.description || "Click to read the full report on this precious metals movement."}
            </div>
            <div style={{fontSize:'0.75rem', color:'#64748b', fontWeight:'bold'}}>{item.source.toUpperCase()}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

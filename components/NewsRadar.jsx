import React, { useMemo } from "react";

export default function NewsRadar({ items }) {
  // Memoize sorted items to avoid recalculating on every render
  const itemsWithPriority = useMemo(() => {
    return items.map(item => ({
      ...item,
      priority: item.color === 'red' ? 1 : 2
    })).sort((a, b) => a.priority - b.priority);
  }, [items]);

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
          LIVE CRYPTO NEWS
        </h2>
        <div style={{fontSize:'0.75rem', color:'#64748b'}}>
          <span style={{marginRight:15}}>
            <span style={{color:'#ef4444', fontWeight:'bold'}}>●</span> Priority
          </span>
          <span>
            <span style={{color:'#3b82f6', fontWeight:'bold'}}>●</span> Standard
          </span>
        </div>
      </div>
      
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(350px, 1fr))', gap:20}}>
        {itemsWithPriority.map(item => (
          <a 
            key={item.id} 
            href={item.link} 
            target="_blank" 
            rel="noreferrer noopener" 
            style={{
              textDecoration:'none', 
              color:'inherit',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div 
              className="card" 
              style={{
                borderLeft: item.color === 'red' ? '4px solid #ef4444' : '4px solid #3b82f6', 
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{
                  fontWeight:'bold', 
                  marginBottom:8,
                  lineHeight: '1.4',
                  color: '#e2e8f0'
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize:'0.85rem', 
                  color:'#94a3b8', 
                  marginBottom:10, 
                  lineHeight:'1.4'
                }}>
                  {item.description || "Click to read the full report on this market movement."}
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize:'0.75rem', 
                  color:'#64748b', 
                  fontWeight:'bold'
                }}>
                  {item.source.toUpperCase()}
                </div>
                {item.color === 'red' && (
                  <div style={{
                    fontSize:'0.65rem',
                    background:'rgba(239, 68, 68, 0.1)',
                    color:'#ef4444',
                    padding:'2px 8px',
                    borderRadius:'4px',
                    fontWeight:'bold'
                  }}>
                    HIGH PRIORITY
                  </div>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
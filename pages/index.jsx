import React, { useState, useEffect } from "react";
import Head from "next/head";
import Parser from "rss-parser";
import { signKalshi } from "./polshi"; 
import NewsRadar from "../components/NewsRadar";
import PolshiHub from "../components/PolshiHub";
import Liquidations from "../components/Liquidations";
import MetalsNews from "../components/MetalsNews";
import MetalsLiquidations from "../components/MetalsLiquidations";

const FEEDS = ["https://www.coindesk.com/arc/outboundfeeds/rss/", "https://cointelegraph.com/rss", "https://cryptoslate.com/feed/"];
const KEYWORDS = ["bitcoin", "btc", "ethereum", "eth", "solana", "sol"];

const METALS_FEEDS = ["https://www.kitco.com/rss/", "https://www.mining.com/feed/"];
const METALS_KEYWORDS = ["gold", "silver", "xau", "xag", "precious metals", "bullion"];
const HIGH_IMPORTANCE_METALS_KEYWORDS = ["gold", "silver", "xau", "xag"]; // Primary metals for importance detection
const URGENCY_WORDS = ["surge", "crash", "record", "breaking", "alert", "major"];

export default function Dashboard({ items, metalsItems }) {
  const [activeTab, setActiveTab] = useState("news");
  const [prices, setPrices] = useState({ BTC:{v:"0.0", c:"#fff", a:false}, ETH:{v:"0.0", c:"#fff", a:false}, SOL:{v:"0.0", c:"#fff", a:false}, XAU:{v:"0.0", c:"#fff", a:false}, XAG:{v:"0.0", c:"#fff", a:false} });
  const [poly, setPoly] = useState([]);
  const [kalshi, setKalshi] = useState([]);
  const [liqHistory, setLiqHistory] = useState([]);
  const [metalsLiqHistory, setMetalsLiqHistory] = useState([]);
  const [metalsWhaleMovements, setMetalsWhaleMovements] = useState([]);

  // 1. LIVE BINANCE PRICES & RECONNECTING WEBSOCKET
  useEffect(() => {
    let ws;
    const connect = () => {
      ws = new WebSocket('wss://stream.binance.us:9443/ws/btcusdt@trade/ethusdt@trade/solusdt@trade/!forceOrder@arr');
      
      ws.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.e === "forceOrder") {
          const s = d.o.s.replace('USDT','');
          setLiqHistory(prev => [{symbol:s, price:d.o.p, qty:d.o.q, time:new Date().toLocaleTimeString()}, ...prev].slice(0,10));
          return;
        }
        const ticker = d.s.replace('USDT','');
        const val = parseFloat(d.p).toFixed(2);
        setPrices(prev => ({
          ...prev, 
          [ticker]: { v: val, c: val > prev[ticker].v ? '#4ade80' : '#f87171', a: false }
        }));
      };
      
      ws.onclose = () => setTimeout(connect, 2000); 
    };

    connect();
    return () => ws.close();
  }, []);

  // 1b. METALS PRICES & LIQUIDATIONS (Simulated)
  useEffect(() => {
    // Fetch initial metals prices from a public API
    const fetchMetalsPrices = async () => {
      try {
        // Using metals-api.com or similar service for gold/silver prices
        const response = await fetch('https://api.metals.live/v1/spot');
        const data = await response.json();
        if (data && data.length > 0) {
          data.forEach(metal => {
            if (metal.symbol === 'gold') {
              setPrices(prev => ({...prev, XAU: { v: metal.price.toFixed(2), c: '#fbbf24', a: false }}));
            } else if (metal.symbol === 'silver') {
              setPrices(prev => ({...prev, XAG: { v: metal.price.toFixed(2), c: '#94a3b8', a: false }}));
            }
          });
        }
      } catch (e) {
        // Fallback to static prices if API fails
        setPrices(prev => ({
          ...prev, 
          XAU: { v: "2045.50", c: '#fbbf24', a: false },
          XAG: { v: "23.85", c: '#94a3b8', a: false }
        }));
      }
    };

    fetchMetalsPrices();
    const interval = setInterval(fetchMetalsPrices, 30000); // Update every 30 seconds

    // Simulate whale movements and liquidations for metals
    const simulateMetalsActivity = () => {
      const metals = ['GOLD', 'SILVER'];
      const isWhale = Math.random() > 0.5;
      const metal = metals[Math.floor(Math.random() * metals.length)];
      const price = metal === 'GOLD' ? 2040 + Math.random() * 20 : 23 + Math.random() * 2;
      const volume = 100 + Math.random() * 900;
      
      if (isWhale) {
        setMetalsWhaleMovements(prev => [{
          metal,
          price: price.toFixed(2),
          volume: volume.toFixed(2),
          time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 10));
      } else {
        setMetalsLiqHistory(prev => [{
          metal,
          price: price.toFixed(2),
          qty: (volume / 10).toFixed(3),
          time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 10));
      }
    };

    const activityInterval = setInterval(simulateMetalsActivity, 15000); // Every 15 seconds

    return () => {
      clearInterval(interval);
      clearInterval(activityInterval);
    };
  }, []);

  // 2. FETCH POLSHI DATA WITH VOLUME
  useEffect(() => {
    if (activeTab === 'polshi') {
      fetch(`https://corsproxy.io/?` + encodeURIComponent(`https://gamma-api.polymarket.com/events?limit=50&active=true&closed=false&tag_id=11`))
        .then(r => r.json()).then(data => {
            const mapped = (data || []).map(e => ({ ...e, volume: e.markets?.[0]?.volume || 0 }));
            setPoly(mapped);
        });
      
      fetch(`https://corsproxy.io/?` + encodeURIComponent(`https://api.elections.kalshi.com/trade-api/v2/markets?limit=100&status=open`), { 
          headers: signKalshi('GET', '/trade-api/v2/markets') 
      })
        .then(r => r.json()).then(d => {
            const timedMarkets = (d.markets || []).filter(m => 
              m.series_ticker?.match(/KX(BTC|ETH|SOL)(15M|1H|4H)/i) || 
              m.title.match(/15 minute|1 hour|4 hour/i)
            );
            setKalshi(timedMarkets);
        });
    }
  }, [activeTab]);

  return (
    <div style={{display:'flex', height:'100vh', background:'#0b0e14', color:'#fff', overflow:'hidden'}}>
      <Head><title>Crypto Terminal | Pro</title></Head>
      <style jsx global>{`
        .sidebar { width: 260px; background: #0f131a; padding: 20px; border-right: 1px solid #1e293b; flex-shrink: 0; }
        .nav-btn { width: 100%; padding: 12px; margin-bottom: 5px; border-radius: 6px; background: transparent; color: #94a3b8; text-align: left; cursor: pointer; border: none; font-weight: bold; }
        .nav-btn.active { background: #1e293b; color: #3b82f6; border-left: 3px solid #3b82f6; }
        .ticker { background: #151a23; padding: 15px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 20px; font-family: monospace; }
        .main-content { flex: 1; overflow-y: auto; padding: 40px; }
        .card { background: #151a23; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 20px; position: relative; }
        .arb-gold { border: 2px solid #fbbf24 !important; box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
      `}</style>

      <div className="sidebar">
        <h2 style={{color:'#3b82f6', marginBottom:20}}>TERMINAL</h2>
        <div className="ticker">
          {Object.entries(prices).map(([k,p]) => (
            <div key={k} style={{display:'flex', justifyContent:'space-between', marginBottom:5}}>
              <span>{k}</span><span style={{color:p.c}}>${p.v}</span>
            </div>
          ))}
        </div>
        <button className={`nav-btn ${activeTab==='news'?'active':''}`} onClick={()=>setActiveTab('news')}>📰 News Radar</button>
        <button className={`nav-btn ${activeTab==='polshi'?'active':''}`} onClick={()=>setActiveTab('polshi')}>💰 Polshi Hub</button>
        <button className={`nav-btn ${activeTab==='liq'?'active':''}`} onClick={()=>setActiveTab('liq')}>🌊 Liquidations</button>
        <button className={`nav-btn ${activeTab==='metals'?'active':''}`} onClick={()=>setActiveTab('metals')}>🥇 Metals</button>
      </div>

      <div className="main-content">
        {activeTab === 'news' && <NewsRadar items={items} />}
        {activeTab === 'polshi' && <PolshiHub poly={poly} kalshi={kalshi} />}
        {activeTab === 'liq' && <Liquidations history={liqHistory} />}
        {activeTab === 'metals' && (
          <>
            <h2 style={{color:'#fbbf24', borderBottom:'1px solid #1e293b', paddingBottom:10, letterSpacing:'1px', marginBottom:20}}>PRECIOUS METALS INTELLIGENCE</h2>
            <MetalsNews items={metalsItems} />
            <div style={{marginTop: 30}}>
              <MetalsLiquidations history={metalsLiqHistory} whaleMovements={metalsWhaleMovements} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const parser = new (require('rss-parser'))();
  const all = [];
  const metalsAll = [];
  
  // Fetch crypto news
  for (const url of FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      feed.items.forEach(i => {
        const score = KEYWORDS.some(k => i.title.toLowerCase().includes(k)) ? 5 : 1;
        const summary = i.contentSnippet ? i.contentSnippet.split('.').slice(0, 2).join('.') + '.' : "Market analysis inside.";
        all.push({ id: i.link, title: i.title, link: i.link, source: feed.title, description: summary, color: score >= 4 ? 'red' : 'blue' });
      });
    } catch(e){}
  }

  // Fetch metals news
  for (const url of METALS_FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      feed.items.forEach(i => {
        const title = i.title.toLowerCase();
        // Check for high-importance: primary metals keywords + urgency words
        const highImportance = HIGH_IMPORTANCE_METALS_KEYWORDS.some(k => title.includes(k)) && 
                             URGENCY_WORDS.some(w => title.includes(w));
        
        // Check for medium importance (contains any metals keywords)
        const mediumImportance = METALS_KEYWORDS.some(k => title.includes(k));
        
        const color = highImportance ? 'red' : mediumImportance ? 'blue' : 'gray';
        
        // Better summary handling: limit by character count instead of sentence parsing
        let summary = "Read about this precious metals market movement.";
        if (i.contentSnippet) {
          summary = i.contentSnippet.length > 200 
            ? i.contentSnippet.substring(0, 200) + '...' 
            : i.contentSnippet;
        }
        
        metalsAll.push({ 
          id: i.link, 
          title: i.title, 
          link: i.link, 
          source: feed.title, 
          description: summary, 
          color 
        });
      });
    } catch(e){}
  }
  
  return { props: { items: all.slice(0,60), metalsItems: metalsAll.slice(0,60) } };
}
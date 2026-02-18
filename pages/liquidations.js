// pages/liquidations.js

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LiquidationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/liquidations");
        if (!res.ok) throw new Error(`API ${res.status}`);
        const body = await res.json();
        if (!mounted) return;
        setRows(body.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050816",
        color: "white",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>🧨 Liquidation Alerts</h1>
          <p style={{ color: "#9ca3af", marginTop: 6, marginBottom: 0, maxWidth: 720 }}>
            Top 30 coins by a heuristic "liquidation wick" metric (high - low relative to price).
            This route proxies to `COINAYZLE_URL` when configured, otherwise falls back to a CoinGecko-based heuristic.
          </p>
        </div>

        <nav style={{ display: "flex", gap: 8 }}>
          <Link href="/" style={{ padding: "8px 12px", backgroundColor: "#111827", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
            ← Home
          </Link>
          <Link href="/calendar" style={{ padding: "8px 12px", backgroundColor: "#111827", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
            📅 Calendar
          </Link>
        </nav>
      </header>

      <main>
        {loading && <p style={{ color: "#9ca3af" }}>Loading liquidation data…</p>}
        {error && (
          <p style={{ color: "#ff6b6b" }}>Failed to load data: {error}</p>
        )}

        {!loading && !error && (
          <div style={{ display: "grid", gap: 12, maxWidth: 980 }}>
            {rows.map((r, i) => (
              <article key={r.id || i} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, borderRadius: 10, backgroundColor: "#07102a", border: "1px solid #0b1220" }}>
                <img src={r.image} alt={r.symbol} width={48} height={48} style={{ borderRadius: 8 }} />

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: 16 }}>{r.name} <span style={{ color: "#9ca3af", fontWeight: 600, marginLeft: 8 }}>{r.symbol?.toUpperCase()}</span></strong>
                      <div style={{ color: "#9ca3af", fontSize: 13 }}>{r.current_price ? `$${Number(r.current_price).toLocaleString()}` : "—"}</div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#9ca3af", fontSize: 13 }}>Wick</div>
                      <div style={{ fontWeight: 700, color: r.wick_pct > 20 ? "#ff4d4f" : r.wick_pct > 10 ? "#ffa500" : "#7dd3fc" }}>{r.wick_pct}%</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ color: "#9ca3af", fontSize: 13 }}>24h High / Low: {r.high_24h ? `$${Number(r.high_24h).toLocaleString()}` : '—'} / {r.low_24h ? `$${Number(r.low_24h).toLocaleString()}` : '—'}</div>

                    <div style={{ minWidth: 160 }}>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>AI Confidence</div>
                      <div style={{ height: 8, background: "#0b1220", borderRadius: 8, overflow: "hidden" }}>
                        <div style={{ width: `${r.ai_score}%`, height: "100%", background: r.ai_score > 70 ? "#22c55e" : r.ai_score > 40 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

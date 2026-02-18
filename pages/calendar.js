// pages/calendar.js

const EVENTS = [
  // ----- EXAMPLES: EDIT THESE HOWEVER YOU WANT -----
  {
    date: "2025-11-14",
    time: "07:30 UTC",
    title: "US CPI Release",
    description: "Monthly US Consumer Price Index. Big impact on macro + BTC.",
    category: "Macro",
    importance: "very", // very | high | medium | low
  },
  {
    date: "2025-11-15",
    time: "18:00 UTC",
    title: "BTC Options Expiry",
    description: "Major BTC options expiry on Deribit.",
    category: "Derivatives",
    importance: "high",
  },
  {
    date: "2025-11-16",
    time: "12:00 UTC",
    title: "SOL Token Unlock",
    description: "Large ecosystem unlock → watch for volatility.",
    category: "Token Unlock",
    importance: "medium",
  },
  {
    date: "2025-11-18",
    time: "20:00 UTC",
    title: "New Exchange Listing: MEME/USDT",
    description: "Tier-1 CEX listing for a meme coin.",
    category: "Listing",
    importance: "low",
  },
];

const IMPORTANCE_STYLES = {
  very: {
    label: "Very Important",
    borderColor: "#ff4d4f", // red
  },
  high: {
    label: "Important",
    borderColor: "#ffa500", // orange
  },
  medium: {
    label: "Semi Important",
    borderColor: "#1d9bf0", // blue
  },
  low: {
    label: "Normal",
    borderColor: "#9ca3af", // gray
  },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function CalendarPage() {
  // sort events by date/time
  const sorted = [...EVENTS].sort(
    (a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
  );

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
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
        📅 Crypto Events Calendar
      </h1>

      <p style={{ color: "#9ca3af", marginBottom: "16px", maxWidth: "600px" }}>
        Manual calendar for the biggest upcoming crypto + macro events. Red =
        huge, orange = important, blue = semi, gray = normal.
      </p>

      {/* Legend */}
      <div style={{ marginBottom: "20px", fontSize: "14px" }}>
        <span style={{ marginRight: "16px" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              backgroundColor: "#ff4d4f",
              marginRight: "6px",
            }}
          />
          Very Important
        </span>
        <span style={{ marginRight: "16px" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              backgroundColor: "#ffa500",
              marginRight: "6px",
            }}
          />
          Important
        </span>
        <span style={{ marginRight: "16px" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              backgroundColor: "#1d9bf0",
              marginRight: "6px",
            }}
          />
          Semi
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              backgroundColor: "#9ca3af",
              marginRight: "6px",
            }}
          />
          Normal
        </span>
      </div>

      {/* Events list */}
      <div
        style={{
          display: "grid",
          gap: "16px",
          maxWidth: "800px",
        }}
      >
        {sorted.map((event, i) => {
          const styleInfo =
            IMPORTANCE_STYLES[event.importance] || IMPORTANCE_STYLES.low;

          return (
            <div
              key={i}
              style={{
                border: `2px solid ${styleInfo.borderColor}`,
                borderRadius: "10px",
                padding: "16px",
                backgroundColor: "#0b1020",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "#9ca3af",
                }}
              >
                <span>{formatDate(event.date)}</span>
                <span>{event.time}</span>
              </div>

              <h2 style={{ fontSize: "18px", marginBottom: "4px" }}>
                {event.title}
              </h2>

              <p style={{ fontSize: "14px", color: "#d1d5db" }}>
                {event.description}
              </p>

              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#9ca3af",
                }}
              >
                <span>Category: {event.category}</span>
                <span>{styleInfo.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { StatsData } from "../../shared/types";

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    window.blink?.getStats().then(setStats);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = stats?.days.find(d => d.date === today);

  return (
    <div style={container}>
      <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Stats</h1>

      <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <div style={card}>
          <div style={cardValue}>{todayEntry?.breaksTaken ?? 0}</div>
          <div style={cardLabel}>Breaks today</div>
        </div>
        <div style={card}>
          <div style={cardValue}>{todayEntry?.focusMinutes ?? 0}</div>
          <div style={cardLabel}>Focus min today</div>
        </div>
        <div style={card}>
          <div style={cardValue}>{stats?.currentStreak ?? 0}</div>
          <div style={cardLabel}>Day streak</div>
        </div>
      </div>

      <Link to="/" style={linkStyle}>Back to Settings</Link>
    </div>
  );
}

const container: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  background: "rgba(20, 24, 36, 0.96)",
  color: "#E6ECFF",
  fontFamily: "Inter, system-ui",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 32
};

const card: React.CSSProperties = {
  background: "#1F2937",
  border: "1px solid #4B5563",
  borderRadius: 12,
  padding: "20px 24px",
  textAlign: "center",
  minWidth: 120
};

const cardValue: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 600
};

const cardLabel: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.7,
  marginTop: 4
};

const linkStyle: React.CSSProperties = {
  marginTop: 24,
  color: "#7C8DFF",
  fontSize: 14,
  textDecoration: "none"
};

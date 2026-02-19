import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Toggle from "../components/Toggle";

export default function Settings() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [weekdayOnly, setWeekdayOnly] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.blink?.getSettings().then(s => {
      setWorkMinutes(s.workMinutes);
      setBreakMinutes(s.breakMinutes);
      setWeekdayOnly(s.weekdayOnly);
    });
  }, []);

  const handleSave = async () => {
    await window.blink?.saveSettings({ workMinutes, breakMinutes, weekdayOnly });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div style={container}>
      <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Settings</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
        <label style={labelStyle}>
          Work interval (minutes)
          <input
            type="number"
            min={1}
            value={workMinutes}
            onChange={e => setWorkMinutes(Number(e.target.value))}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Break interval (minutes)
          <input
            type="number"
            min={1}
            value={breakMinutes}
            onChange={e => setBreakMinutes(Number(e.target.value))}
            style={inputStyle}
          />
        </label>

        <Toggle
          label="Weekdays only"
          value={weekdayOnly}
          onChange={setWeekdayOnly}
        />
      </div>

      <button onClick={handleSave} style={buttonStyle}>
        {saved ? "Saved!" : "Save"}
      </button>

      <Link to="/stats" style={linkStyle}>View Stats</Link>
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

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontSize: 14
};

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 16,
  borderRadius: 8,
  border: "1px solid #4B5563",
  background: "#1F2937",
  color: "#E6ECFF",
  width: 120
};

const buttonStyle: React.CSSProperties = {
  marginTop: 24,
  padding: "10px 32px",
  fontSize: 14,
  borderRadius: 999,
  border: "1px solid #4B5563",
  background: "transparent",
  color: "#E6ECFF",
  cursor: "pointer"
};

const linkStyle: React.CSSProperties = {
  marginTop: 16,
  color: "#7C8DFF",
  fontSize: 14,
  textDecoration: "none"
};

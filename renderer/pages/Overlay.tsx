import { useEffect, useState, useRef } from "react";

export default function Overlay() {
  const [remaining, setRemaining] = useState(0);
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    window.blink?.onTimerTick(({ remainingSec }) => setRemaining(remainingSec));
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const startHold = () => {
    setHolding(true);
    holdTimer.current = setTimeout(() => window.blink?.skipBreak(), 2000);
  };

  const cancelHold = () => {
    setHolding(false);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "rgba(20, 24, 36, 0.96)",
        color: "#E6ECFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui"
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 600 }}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
      <div style={{ marginTop: 12, opacity: 0.8 }}>
        Look 20 feet away for 20 seconds
      </div>

      <button
        style={{
          marginTop: 32,
          padding: "10px 18px",
          fontSize: 14,
          borderRadius: 999,
          border: "1px solid #4B5563",
          background: holding ? "#374151" : "transparent",
          color: "#E6ECFF",
          cursor: "pointer"
        }}
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
      >
        {holding ? "Hold..." : "Hold 2s to Skip (Emergency)"}
      </button>
    </div>
  );
}

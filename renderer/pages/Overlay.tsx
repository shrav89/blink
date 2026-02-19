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
    <div>
      <h1>{minutes}:{seconds.toString().padStart(2, "0")}</h1>
      <p>Take a break</p>
      <button
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
      >
        {holding ? "Hold..." : "Hold 2s to Skip (Emergency)"}
      </button>
    </div>
  );
}

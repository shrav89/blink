import { HashRouter, Routes, Route } from "react-router-dom";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import Overlay from "./pages/Overlay";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Settings />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/overlay" element={<Overlay />} />
      </Routes>
    </HashRouter>
  );
}

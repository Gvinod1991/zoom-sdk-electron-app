import { BrowserRouter, Routes, Route } from "react-router-dom";
import Zoom from "./Zoom";
import Leave from "./Leave";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Zoom />} />
        <Route path="/leave" element={<Leave />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Routes, Route } from "react-router-dom";
import { SimulatorPage } from "./pages/SimulatorPage";
import { DriversPage } from "./pages/DriversPage";

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<SimulatorPage />} />
      <Route path="/drivers" element={<DriversPage />} />
    </Routes>
  );
}

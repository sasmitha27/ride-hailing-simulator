import { Routes, Route } from "react-router-dom";
import { SimulatorPage } from "./pages/SimulatorPage";
import { DriversPage } from "./pages/DriversPage";
import { CustomersPage } from "./pages/CustomersPage";
import { RidesPage } from "./pages/RidesPage";

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<SimulatorPage />} />
      <Route path="/drivers" element={<DriversPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/rides" element={<RidesPage />} />
    </Routes>
  );
}

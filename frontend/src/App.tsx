import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SimulatorPage } from "./pages/SimulatorPage";
import { DriversPage } from "./pages/DriversPage";
import { CustomersPage } from "./pages/CustomersPage";
import { RidesPage } from "./pages/RidesPage";

export default function App(): JSX.Element {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: "0.875rem", maxWidth: "360px" },
          success: { iconTheme: { primary: "#0e7a63", secondary: "#fff" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } }
        }}
      />
      <Routes>
        <Route path="/" element={<SimulatorPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/rides" element={<RidesPage />} />
      </Routes>
    </>
  );
}

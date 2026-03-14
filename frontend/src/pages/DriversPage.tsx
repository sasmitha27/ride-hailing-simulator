import { useState } from "react";
import NavBar from "../components/NavBar";
import { DriverForm } from "../components/DriverForm";
import { SimulationMap } from "../map/SimulationMap";
import { addDriver, fetchSimulationState } from "../simulation/api";
import { Driver } from "../simulation/types";
import { useEffect } from "react";

type Coordinates = { lat: number; lng: number };
type SelectionMode = "driver" | "pickup" | "destination" | null;

export function DriversPage(): JSX.Element {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [uiMessage, setUiMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);
  const [pendingDriverLocation, setPendingDriverLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    fetchSimulationState()
      .then((s) => setDrivers(s.drivers))
      .catch(console.error);
  }, []);

  const handleMapPick = (coords: Coordinates) => {
    if (selectionMode === "driver") {
      setPendingDriverLocation(coords);
      setSelectionMode(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] via-[#e0f2fe] to-[#ecfeff] px-4 py-6 text-ink">
      <div className="mx-auto max-w-7xl space-y-4">

        <header className="rounded-2xl bg-sea p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-2 text-sea font-extrabold text-xl shadow-sm">H</div>
              <div className="text-white text-2xl font-bold">hailrider</div>
            </div>
            <NavBar />
          </div>
        </header>

        {/* Page heading */}
        <div>
          <h2 className="text-2xl font-bold text-ink">Drivers</h2>
          <p className="text-sm text-slate-500">Manage available drivers on the platform.</p>
        </div>

        {selectionMode === "driver" && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            Click anywhere on the map to set the driver's starting location.
          </div>
        )}

        {uiMessage && (
          <div className={`rounded-xl border px-4 py-2 text-sm ${uiMessage.startsWith("Failed") ? "border-red-300 bg-red-50 text-red-700" : "border-green-300 bg-green-50 text-green-700"}`}>
            {uiMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Map */}
          <SimulationMap
            drivers={drivers}
            activeRequests={[]}
            selectionMode={selectionMode}
            pendingDriverLocation={pendingDriverLocation}
            pendingPickupLocation={null}
            pendingDestinationLocation={null}
            onMapPick={handleMapPick}
          />

          <div className="space-y-4">
            {/* Add driver form */}
            <DriverForm
              selectedLocation={pendingDriverLocation}
              onPickLocation={() => setSelectionMode("driver")}
              isSubmitting={isAdding}
              onSubmit={async (payload) => {
                setIsAdding(true);
                setUiMessage("");
                try {
                  await addDriver(payload);
                  const latest = await fetchSimulationState();
                  setDrivers(latest.drivers);
                  setPendingDriverLocation(null);
                  setUiMessage("Driver added successfully.");
                } catch {
                  setUiMessage("Failed to add driver. Ensure backend is running on http://localhost:4000.");
                } finally {
                  setIsAdding(false);
                }
              }}
            />

            {/* Driver list */}
            <div className="rounded-xl border border-slate-300/60 bg-white/80 p-4 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-ink">All Drivers</h3>
              {drivers.length === 0 && <p className="text-sm text-slate-500">No drivers yet.</p>}
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {drivers.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-md border bg-slate-50 px-3 py-2 text-sm">
                    <div>
                      <p className="font-semibold text-ink">{d.name}</p>
                      <p className="text-xs text-slate-500">
                        {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)} · ★ {d.rating}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${d.status === "available" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

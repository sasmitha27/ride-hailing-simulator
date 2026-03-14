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
  const [showAddModal, setShowAddModal] = useState(false);

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

  const availableDrivers = drivers.filter((driver) => driver.status === "available").length;
  const averageRating = drivers.length === 0 ? 0 : drivers.reduce((sum, driver) => sum + driver.rating, 0) / drivers.length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.35),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(191,219,254,0.45),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#edf7ff_100%)] px-4 py-6 text-ink">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[28px] bg-slate-900 p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-2 text-sea font-extrabold text-xl shadow-sm">H</div>
              <div className="text-white text-2xl font-bold">hailrider</div>
            </div>
            <NavBar />
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_45px_rgba(148,163,184,0.18)] backdrop-blur">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Fleet management</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Drivers</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Manage driver availability, monitor live map positions, and add new drivers with a cleaner workflow.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="min-w-[140px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total drivers</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{drivers.length}</p>
                </div>
                <div className="min-w-[140px] rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">Available now</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-900">{availableDrivers}</p>
                </div>
                <div className="min-w-[140px] rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-700">Avg. rating</p>
                  <p className="mt-2 text-2xl font-semibold text-amber-900">{averageRating.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>

          
        </section>

        {selectionMode === "driver" && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 shadow-sm">
            Map selection mode is active. Click anywhere on the map to set the driver&apos;s starting location.
          </div>
        )}

        {uiMessage && (
          <div className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${uiMessage.startsWith("Failed") ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
            {uiMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_380px]">
          <section className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.18)] backdrop-blur">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live map</p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-950">Driver locations</h3>
                  <p className="mt-1 text-sm text-slate-500">Track the current fleet and assign precise spawn points for new drivers.</p>
                </div>
                <div className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
                  Colombo district view
                </div>
              </div>

              <SimulationMap
                drivers={drivers}
                activeRequests={[]}
                selectionMode={selectionMode}
                pendingDriverLocation={pendingDriverLocation}
                pendingPickupLocation={null}
                pendingDestinationLocation={null}
                onMapPick={handleMapPick}
              />
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.18)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Action panel</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Add driver</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Launch a focused popup form instead of editing details directly in the sidebar.</p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {pendingDriverLocation
                  ? `Selected map point: ${pendingDriverLocation.lat.toFixed(4)}, ${pendingDriverLocation.lng.toFixed(4)}`
                  : "No map point selected yet. You can choose the location from inside the popup form."}
              </div>

              <button
                className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                onClick={() => setShowAddModal(true)}
              >
                Open Add Driver Form
              </button>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.18)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Fleet overview</p>
                  <h3 className="mt-1 text-2xl font-semibold text-slate-950">All Drivers</h3>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{drivers.length} total</div>
              </div>

              {drivers.length === 0 && <p className="text-sm text-slate-500">No drivers yet.</p>}
              <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {drivers.map((d) => (
                  <div key={d.id} className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-4 text-sm transition hover:border-blue-200 hover:bg-white hover:shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                            {d.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{d.name}</p>
                            <p className="text-xs text-slate-500">Driver #{d.id}</p>
                          </div>
                        </div>

                        <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                          <div className="rounded-xl bg-white px-3 py-2">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Location</p>
                            <p className="mt-1 font-medium text-slate-700">{d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}</p>
                          </div>
                          <div className="rounded-xl bg-white px-3 py-2">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Rating</p>
                            <p className="mt-1 font-medium text-slate-700">★ {d.rating.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>

                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${d.status === "available" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {d.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <div className="relative w-full max-w-xl">
              <button
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>

              <DriverForm
                selectedLocation={pendingDriverLocation}
                onPickLocation={() => {
                  setSelectionMode("driver");
                  setShowAddModal(false);
                  setTimeout(() => setShowAddModal(true), 300);
                }}
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
                    setShowAddModal(false);
                  } catch {
                    setUiMessage("Failed to add driver. Ensure backend is running on http://localhost:4000.");
                  } finally {
                    setIsAdding(false);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

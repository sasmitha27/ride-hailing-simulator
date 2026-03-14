import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { fetchCustomers } from "../simulation/api";

export function CustomersPage(): JSX.Element {
  const [customers, setCustomers] = useState<Array<{ id: number; name: string; latitude: number; longitude: number }>>([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers).catch(console.error);
  }, []);

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

        <div>
          <h2 className="text-2xl font-bold text-ink">Customers</h2>
          <p className="text-sm text-slate-500">List of seeded customers and their approximate locations.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-xl border border-slate-300/60 bg-white/80 p-4 shadow-sm">
            {/* Colombo district bounds */}
            <MapContainer
              center={[6.9271, 79.8612]}
              zoom={13}
              minZoom={13}
              maxZoom={13}
              zoomControl={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              boxZoom={false}
              touchZoom={false}
              keyboard={false}
              maxBounds={[[6.821, 79.829], [6.993, 79.968]]}
              maxBoundsViscosity={1.0}
              className="h-[460px] w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {customers.map((c) => (
                <Marker key={c.id} position={[c.latitude, c.longitude]} />
              ))}
            </MapContainer>
            <div className="border-t bg-white/90 px-3 py-2 text-xs text-slate-700">Colombo district view</div>
          </div>

          <div className="rounded-xl border border-slate-300/60 bg-white/80 p-4 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-ink">All Customers</h3>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {customers.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-md border bg-slate-50 px-3 py-2 text-sm">
                  <div>
                    <p className="font-semibold text-ink">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

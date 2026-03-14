import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { fetchRides } from "../simulation/api";
import { RideSummary } from "../simulation/types";

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "-";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function formatDistanceKm(distanceKm: number): string {
  return `${distanceKm.toFixed(2)} km`;
}

export function RidesPage(): JSX.Element {
  const [rides, setRides] = useState<RideSummary[]>([]);

  useEffect(() => {
    fetchRides().then(setRides).catch(console.error);

    const id = setInterval(() => {
      fetchRides().then(setRides).catch(console.error);
    }, 4000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] via-[#e0f2fe] to-[#ecfeff] px-4 py-6 text-ink">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-2xl bg-sea p-5 text-white shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-2 text-sea font-extrabold text-xl shadow-sm">H</div>
              <div className="text-white text-2xl font-bold">hailrider</div>
            </div>
            <NavBar />
          </div>
        </header>

        <div>
          <h2 className="text-2xl font-bold text-ink">Rides</h2>
          <p className="text-sm text-slate-500">Live and completed rides with rider/customer and timing details.</p>
        </div>

        <div className="rounded-xl border border-slate-300/60 bg-white/85 p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-3">Ride</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Rider</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Destination</th>
                  <th className="px-3 py-3">Distance</th>
                  <th className="px-3 py-3">Trip Duration</th>
                  <th className="px-3 py-3">Driver Arrival</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride.id} className="border-b last:border-b-0">
                    <td className="px-3 py-3 font-semibold text-slate-900">#{ride.id}</td>
                    <td className="px-3 py-3 capitalize text-slate-700">{ride.status.replace(/_/g, " ")}</td>
                    <td className="px-3 py-3 text-slate-700">{ride.rider.name}</td>
                    <td className="px-3 py-3 text-slate-700">{ride.customer.name}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {ride.destination.lat.toFixed(4)}, {ride.destination.lng.toFixed(4)}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{formatDistanceKm(ride.distanceKm)}</td>
                    <td className="px-3 py-3 text-slate-700">{formatDuration(ride.tripDurationSeconds)}</td>
                    <td className="px-3 py-3 text-slate-700">{formatDuration(ride.arrivalToCustomerSeconds)}</td>
                  </tr>
                ))}
                {rides.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-slate-500">
                      No rides yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

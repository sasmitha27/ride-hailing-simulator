import { Driver, Ride, RideRequest } from "../simulation/types";

interface StatsPanelProps {
  drivers: Driver[];
  requests: RideRequest[];
  rides: Ride[];
  currentEta: number | null;
}

export function StatsPanel({ drivers, requests, rides, currentEta }: StatsPanelProps): JSX.Element {
  const available = drivers.filter((d) => d.status === "available").length;
  const busy = drivers.length - available;

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-300/60 bg-white/80 p-4 shadow-sm backdrop-blur md:grid-cols-4">
      <Stat title="Available Drivers" value={String(available)} />
      <Stat title="Busy Drivers" value={String(busy)} />
      <Stat title="Waiting Requests" value={String(requests.filter((r) => r.status === "waiting").length)} />
      <Stat title="Completed Rides" value={String(rides.filter((r) => r.status === "completed").length)} />
      <Stat title="Latest ETA" value={currentEta === null ? "--" : `${currentEta.toFixed(1)} min`} />
      <Stat title="Priority Waiting" value={String(requests.filter((r) => r.priority && r.status === "waiting").length)} />
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }): JSX.Element {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="text-xl font-bold text-ink">{value}</p>
    </div>
  );
}

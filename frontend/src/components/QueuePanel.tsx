import { RideRequest } from "../simulation/types";

interface QueuePanelProps {
  queue: RideRequest[];
}

export function QueuePanel({ queue }: QueuePanelProps): JSX.Element {
  return (
    <div className="rounded-xl border border-slate-300/60 bg-white/80 p-4 shadow-sm backdrop-blur">
      <h3 className="mb-3 text-lg font-semibold text-ink">Ride Request Queue</h3>
      <div className="grid gap-2 text-sm sm:grid-cols-2 xl:grid-cols-3">
        {queue.length === 0 && <p className="text-slate-500">Queue is empty</p>}
        {queue.map((request, index) => (
          <div key={request.id} className="rounded-md border p-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">#{request.id}</span>
              <span className={`rounded px-2 py-0.5 text-xs ${request.priority ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>
                {request.priority ? "PRIORITY" : "FIFO"}
              </span>
            </div>
            <p className="text-slate-600">Queue position: {index + 1}</p>
            <p className="text-slate-600">Status: {request.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

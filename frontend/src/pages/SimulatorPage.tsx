import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { QueuePanel } from "../components/QueuePanel";
import { RequestForm } from "../components/RequestForm";
import { StatsPanel } from "../components/StatsPanel";
import { SimulationMap } from "../map/SimulationMap";
import NavBar from "../components/NavBar";
import { addRideRequest, fetchSimulationState, resetSimulation } from "../simulation/api";
import { getSocket } from "../simulation/socket";
import { MatchingInsight, SimulationState } from "../simulation/types";

type Coordinates = {
  lat: number;
  lng: number;
};

type SelectionMode = "pickup" | "destination" | null;

const emptyState: SimulationState = {
  drivers: [],
  requests: [],
  rides: [],
  queue: []
};

export function SimulatorPage(): JSX.Element {
  const [state, setState] = useState<SimulationState>(emptyState);
  const [latestEta, setLatestEta] = useState<number | null>(null);
  const [matchingInsight, setMatchingInsight] = useState<MatchingInsight | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [isAddingRequest, setIsAddingRequest] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);
  const [pendingPickupLocation, setPendingPickupLocation] = useState<Coordinates | null>(null);
  const [pendingDestinationLocation, setPendingDestinationLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    fetchSimulationState()
      .then((snapshot) => {
        setState(snapshot);
        setConnectionError(false);
      })
      .catch(() => setConnectionError(true));

    const socket = getSocket();

    socket.on("simulation:state", (snapshot: SimulationState) => {
      setState(snapshot);
      setConnectionError(false);
    });

    socket.on("queue:updated", (queue) => {
      setState((prev) => ({ ...prev, queue }));
    });

    socket.on("ride:assigned", (payload) => {
      setLatestEta(payload.etaMinutes);
      setMatchingInsight({
        requestId: payload.ride.requestId,
        driverId: payload.ride.driver.id,
        driverName: payload.ride.driver.name,
        etaMinutes: payload.etaMinutes,
        routeDistanceKm: payload.routeDistanceKm,
        routePath: payload.routePath,
        routeCoordinates: payload.routeCoordinates,
        availableDrivers: payload.algorithm.availableDrivers,
        candidatesInRadius: payload.algorithm.candidatesInRadius
      });
      fetchSimulationState().then(setState).catch(console.error);
    });

    socket.on("driver:moved", (payload) => {
      setState((prev) => ({
        ...prev,
        drivers: prev.drivers.map((driver) => driver.id === payload.driverId
          ? { ...driver, latitude: payload.latitude, longitude: payload.longitude }
          : driver)
      }));
    });

    socket.on("ride:picked_up", () => {
      fetchSimulationState().then(setState).catch(console.error);
    });

    socket.on("ride:completed", () => {
      fetchSimulationState().then(setState).catch(console.error);
    });

    return () => {
      socket.off("simulation:state");
      socket.off("queue:updated");
      socket.off("ride:assigned");
      socket.off("driver:moved");
      socket.off("ride:picked_up");
      socket.off("ride:completed");
    };
  }, []);

  const activeRequests = useMemo(
    () => state.requests.filter((r) => ["waiting", "matched", "picked_up"].includes(r.status)),
    [state.requests]
  );

  const handleMapPick = (coords: Coordinates): void => {
    if (selectionMode === "pickup") {
      setPendingPickupLocation(coords);
      setSelectionMode(null);
      toast.success(`Pickup location set: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      return;
    }

    if (selectionMode === "destination") {
      setPendingDestinationLocation(coords);
      setSelectionMode(null);
      toast.success(`Destination set: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] via-[#e0f2fe] to-[#ecfeff] px-4 py-6 text-ink">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="rounded-2xl bg-sea p-5 text-white shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-2 text-sea font-extrabold text-xl shadow-sm">H</div>
              <div className="text-white text-2xl font-bold">hailrider</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm("Clear all ride requests and ride history, then make every driver available?")) return;
                  setIsResetting(true);
                  try {
                    await resetSimulation();
                    setState(await fetchSimulationState());
                    setLatestEta(null);
                    setMatchingInsight(null);
                    setPendingPickupLocation(null);
                    setPendingDestinationLocation(null);
                    toast.success("Simulation cleared. Drivers are ready for a new demonstration.");
                  } catch {
                    toast.error("Could not reset the simulation. Check that the backend is running.");
                  } finally {
                    setIsResetting(false);
                  }
                }}
                disabled={isResetting}
                className="rounded-md border border-white/30 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResetting ? "Clearing…" : "Clear demo"}
              </button>
              <NavBar />
            </div>
          </div>
        </header>

        <StatsPanel drivers={state.drivers} requests={state.requests} rides={state.rides} currentEta={latestEta} />

        {selectionMode && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            Map selection active: {selectionMode}. Click once on the map to capture coordinates.
          </div>
        )}

        {connectionError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            The simulator API is unavailable. Start the backend on port 4000, then refresh this page.
          </div>
        )}


        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <SimulationMap
            drivers={state.drivers}
            activeRequests={activeRequests}
            selectionMode={selectionMode}
            pendingDriverLocation={null}
            pendingPickupLocation={pendingPickupLocation}
            pendingDestinationLocation={pendingDestinationLocation}
            highlightedRoute={matchingInsight?.routeCoordinates}
            onMapPick={handleMapPick}
          />

          <div className="space-y-4">
            <div id="customers">
              <RequestForm
              pickupLocation={pendingPickupLocation}
              destinationLocation={pendingDestinationLocation}
              onPickPickup={() => {
                setSelectionMode("pickup");
                toast("Click on the map to pick the passenger location.", { icon: "📍" });
              }}
              onPickDestination={() => {
                setSelectionMode("destination");
                toast("Click on the map to pick the destination.", { icon: "🏁" });
              }}
              isSubmitting={isAddingRequest}
              onSubmit={async (payload) => {
                setIsAddingRequest(true);

                const loadingId = toast.loading("Submitting ride request...");

                try {
                  await addRideRequest(payload);
                  const latest = await fetchSimulationState();
                  setState(latest);
                  setPendingPickupLocation(null);
                  setPendingDestinationLocation(null);
                  toast.success("Ride request added successfully! A driver will be matched shortly.", { id: loadingId });
                } catch (error) {
                  let message = "Failed to add ride request. Ensure the simulator API is running.";
                  if (axios.isAxiosError(error)) {
                    const backendMessage = (error.response?.data as { message?: string } | undefined)?.message;
                    if (backendMessage) message = backendMessage;
                  }
                  toast.error(message, { id: loadingId, duration: 6000 });
                } finally {
                  setIsAddingRequest(false);
                }
              }}
              />
            </div>
          </div>
        </div>

        <QueuePanel queue={state.queue} />

        <section className="rounded-xl border border-blue-200 bg-white/90 p-4 shadow-sm" aria-live="polite">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Algorithm trace</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">Latest greedy driver match</h3>
              <p className="mt-1 text-sm text-slate-600">
                {matchingInsight
                  ? `Request #${matchingInsight.requestId} matched with ${matchingInsight.driverName} (#${matchingInsight.driverId}).`
                  : "Add a request to see Dijkstra routing and the greedy selection result."}
              </p>
            </div>
            {matchingInsight && (
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                <TraceValue label="Candidates" value={`${matchingInsight.candidatesInRadius}/${matchingInsight.availableDrivers}`} />
                <TraceValue label="Route" value={`${matchingInsight.routeDistanceKm.toFixed(2)} km`} />
                <TraceValue label="ETA" value={`${matchingInsight.etaMinutes.toFixed(1)} min`} />
                <TraceValue label="Dijkstra path" value={matchingInsight.routePath.join(" → ") || "Direct"} />
              </div>
            )}
          </div>
          <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
            Priority queue chooses the next request; Dijkstra finds each candidate route; greedy selection chooses the minimum ETA (rating breaks ties).
          </p>
        </section>
      </div>
    </div>
  );
}

function TraceValue({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="min-w-[110px] rounded-lg bg-blue-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">{label}</p>
      <p className="mt-0.5 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

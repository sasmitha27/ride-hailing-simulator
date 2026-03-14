import { useEffect, useMemo, useState } from "react";
import { QueuePanel } from "../components/QueuePanel";
import { RequestForm } from "../components/RequestForm";
import { StatsPanel } from "../components/StatsPanel";
import { SimulationMap } from "../map/SimulationMap";
import NavBar from "../components/NavBar";
import { addRideRequest, fetchSimulationState, triggerQueueProcessing } from "../simulation/api";
import { getSocket } from "../simulation/socket";
import { SimulationState } from "../simulation/types";

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
  const [uiMessage, setUiMessage] = useState<string>("");
  const [isAddingRequest, setIsAddingRequest] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);
  const [pendingPickupLocation, setPendingPickupLocation] = useState<Coordinates | null>(null);
  const [pendingDestinationLocation, setPendingDestinationLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    fetchSimulationState().then(setState).catch(console.error);

    const socket = getSocket();

    socket.on("simulation:state", (snapshot: SimulationState) => {
      setState(snapshot);
    });

    socket.on("queue:updated", (queue) => {
      setState((prev) => ({ ...prev, queue }));
    });

    socket.on("ride:assigned", (payload) => {
      setLatestEta(payload.etaMinutes);
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
      return;
    }

    if (selectionMode === "destination") {
      setPendingDestinationLocation(coords);
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

        <StatsPanel drivers={state.drivers} requests={state.requests} rides={state.rides} currentEta={latestEta} />

        {selectionMode && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            Map selection active: {selectionMode}. Click once on the map to capture coordinates.
          </div>
        )}

        {uiMessage && (
          <div className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700">
            {uiMessage}
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
            onMapPick={handleMapPick}
          />

          <div className="space-y-4">
            <div id="customers">
              <RequestForm
              pickupLocation={pendingPickupLocation}
              destinationLocation={pendingDestinationLocation}
              onPickPickup={() => setSelectionMode("pickup")}
              onPickDestination={() => setSelectionMode("destination")}
              isSubmitting={isAddingRequest}
              onSubmit={async (payload) => {
                setIsAddingRequest(true);
                setUiMessage("");

                try {
                  await addRideRequest(payload);
                  await triggerQueueProcessing();
                  const latest = await fetchSimulationState();
                  setState(latest);
                  setPendingPickupLocation(null);
                  setPendingDestinationLocation(null);
                  setUiMessage("Ride request added successfully.");
                } catch (_error) {
                  setUiMessage("Failed to add ride request. Ensure backend API is running and reachable on http://localhost:4000.");
                } finally {
                  setIsAddingRequest(false);
                }
              }}
              />
            </div>

            <QueuePanel queue={state.queue} />
          </div>
        </div>


      </div>
    </div>
  );
}

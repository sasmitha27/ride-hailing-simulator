import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

type Coordinates = {
  lat: number;
  lng: number;
};

interface RequestFormProps {
  pickupLocation: Coordinates | null;
  destinationLocation: Coordinates | null;
  onPickPickup: () => void;
  onPickDestination: () => void;
  isSubmitting?: boolean;
  onSubmit: (payload: {
    passengerLat: number;
    passengerLng: number;
    destinationLat: number;
    destinationLng: number;
    priority: boolean;
  }) => Promise<void>;
}

export function RequestForm({
  pickupLocation,
  destinationLocation,
  onPickPickup,
  onPickDestination,
  isSubmitting = false,
  onSubmit
}: RequestFormProps): JSX.Element {
  const [priority, setPriority] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!pickupLocation) {
      toast.error("Please pick a passenger location from the map first.");
      return;
    }

    if (!destinationLocation) {
      toast.error("Please pick a destination from the map first.");
      return;
    }

    await onSubmit({
      passengerLat: pickupLocation.lat,
      passengerLng: pickupLocation.lng,
      destinationLat: destinationLocation.lat,
      destinationLng: destinationLocation.lng,
      priority
    });
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-300/60 bg-white/80 p-4 shadow-sm backdrop-blur">
      <h3 className="mb-3 text-lg font-semibold text-ink">Add Ride Request</h3>
      <div className="grid grid-cols-2 gap-2">
        <button className="col-span-2 rounded-md border border-mint/50 bg-mint/10 p-2 text-sm font-semibold text-[#0e7a63] hover:bg-mint/20" type="button" onClick={onPickPickup}>
          Pick Passenger Location From Map
        </button>
        <p className="col-span-2 rounded-md border bg-slate-50 p-2 text-sm text-slate-700">
          {pickupLocation
            ? `Pickup: ${pickupLocation.lat.toFixed(4)}, ${pickupLocation.lng.toFixed(4)}`
            : "Pickup location not selected"}
        </p>

        <button className="col-span-2 rounded-md border border-red-300 bg-red-50 p-2 text-sm font-semibold text-red-700 hover:bg-red-100" type="button" onClick={onPickDestination}>
          Pick Destination From Map
        </button>
        <p className="col-span-2 rounded-md border bg-slate-50 p-2 text-sm text-slate-700">
          {destinationLocation
            ? `Destination: ${destinationLocation.lat.toFixed(4)}, ${destinationLocation.lng.toFixed(4)}`
            : "Destination location not selected"}
        </p>

        <label className="col-span-2 flex items-center gap-2 rounded-md border p-2 text-sm">
          <input type="checkbox" checked={priority} onChange={(e) => setPriority(e.target.checked)} />
          Emergency / VIP priority request
        </label>
      </div>
      <button
        className="mt-3 w-full rounded-md bg-mint px-3 py-2 text-sm font-semibold text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={!pickupLocation || !destinationLocation || isSubmitting}
      >
        {isSubmitting ? "Adding Request..." : "Add Request"}
      </button>
    </form>
  );
}

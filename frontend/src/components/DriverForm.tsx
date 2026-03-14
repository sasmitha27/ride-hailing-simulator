import { FormEvent, useState } from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

interface DriverFormProps {
  selectedLocation: Coordinates | null;
  onPickLocation: () => void;
  isSubmitting?: boolean;
  onSubmit: (payload: {
    name: string;
    latitude: number;
    longitude: number;
    rating: number;
  }) => Promise<void>;
}

export function DriverForm({ selectedLocation, onPickLocation, isSubmitting = false, onSubmit }: DriverFormProps): JSX.Element {
  const [name, setName] = useState("New Driver");
  const [rating, setRating] = useState(4.5);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedLocation) {
      return;
    }

    await onSubmit({
      name,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      rating
    });
  };

  return (
    <form onSubmit={submit} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Add Driver</h3>
        <p className="mt-1 text-sm text-slate-500">Create a new driver profile and place them directly on the map.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="driver-name">
          Driver Name
          </label>
          <input
            id="driver-name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter driver name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="driver-location">
          Driver Starting Location
          </label>
          <button
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            type="button"
            onClick={onPickLocation}
          >
            Choose Starting Location on Map
          </button>
          <p id="driver-location" className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {selectedLocation
              ? `Selected coordinates: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
              : "No location selected yet. Click the button above to place the driver on the map."}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="driver-rating">
          Driver Rating
          </label>
          <input
            id="driver-rating"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            type="number"
            step="0.1"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            placeholder="Enter rating between 1 and 5"
          />
          <p className="mt-2 text-xs text-slate-500">Use a value from 1.0 to 5.0 to indicate driver quality.</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          type="submit"
          disabled={!selectedLocation || isSubmitting}
        >
          {isSubmitting ? "Adding Driver..." : "Save Driver"}
        </button>
      </div>
    </form>
  );
}

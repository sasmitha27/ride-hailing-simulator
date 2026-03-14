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
    <form onSubmit={submit} className="rounded-xl border border-slate-300/60 bg-white/80 p-4 shadow-sm backdrop-blur">
      <h3 className="mb-3 text-lg font-semibold text-ink">Add Driver</h3>
      <div className="grid grid-cols-2 gap-2">
        <input className="col-span-2 rounded-md border p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Driver name" />
        <button className="col-span-2 rounded-md border border-sea/50 bg-sea/5 p-2 text-sm font-semibold text-sea hover:bg-sea/10" type="button" onClick={onPickLocation}>
          Pick Driver Location From Map
        </button>
        <p className="col-span-2 rounded-md border bg-slate-50 p-2 text-sm text-slate-700">
          {selectedLocation
            ? `Selected: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
            : "No location selected yet"}
        </p>
        <input className="col-span-2 rounded-md border p-2" type="number" step="0.1" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} placeholder="Rating" />
      </div>
      <button
        className="mt-3 w-full rounded-md bg-sea px-3 py-2 text-sm font-semibold text-white hover:bg-ink disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={!selectedLocation || isSubmitting}
      >
        {isSubmitting ? "Adding Driver..." : "Add Driver"}
      </button>
    </form>
  );
}

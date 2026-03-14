import { DivIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Fragment } from "react";
import { Driver, RideRequest } from "../simulation/types";

type Coordinates = {
  lat: number;
  lng: number;
};

type SelectionMode = "driver" | "pickup" | "destination" | null;

interface SimulationMapProps {
  drivers: Driver[];
  activeRequests: RideRequest[];
  selectionMode: SelectionMode;
  pendingDriverLocation: Coordinates | null;
  pendingPickupLocation: Coordinates | null;
  pendingDestinationLocation: Coordinates | null;
  onMapPick: (coords: Coordinates) => void;
}

const carIcon = new DivIcon({
  className: "car-icon",
  html: '<div style="background:#0b61ff;color:white;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;">C</div>',
  iconSize: [20, 20]
});

const pickupIcon = new DivIcon({
  className: "pickup-icon",
  html: '<div style="background:#00a86b;width:16px;height:16px;border-radius:50%;box-shadow:0 0 0 4px rgba(0,168,107,0.2);"></div>',
  iconSize: [16, 16]
});

const destinationIcon = new DivIcon({
  className: "destination-icon",
  html: '<div style="background:#d62828;width:16px;height:16px;border-radius:4px;transform:rotate(45deg);"></div>',
  iconSize: [16, 16]
});

const pendingDriverIcon = new DivIcon({
  className: "pending-driver-icon",
  html: '<div style="background:#0b61ff;color:white;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;border:2px solid #fff;">NEW</div>',
  iconSize: [22, 22]
});

export function SimulationMap({
  drivers,
  activeRequests,
  selectionMode,
  pendingDriverLocation,
  pendingPickupLocation,
  pendingDestinationLocation,
  onMapPick
}: SimulationMapProps): JSX.Element {
  // Colombo district approximate bounding box
  const colomboBounds: [[number, number], [number, number]] = [
    [6.821, 79.829], // south-west
    [6.993, 79.968]  // north-east
  ];

  return (
    <div className="h-[460px] overflow-hidden rounded-xl border border-slate-300/60 shadow-sm">
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
        maxBounds={colomboBounds}
        maxBoundsViscosity={1.0}
        className="h-full w-full"
      >
        <MapClickHandler onMapPick={onMapPick} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {drivers.map((driver) => (
          <Marker key={driver.id} position={[driver.latitude, driver.longitude]} icon={carIcon}>
            <Popup>
              Driver #{driver.id}: {driver.name}<br />
              Status: {driver.status}
            </Popup>
          </Marker>
        ))}

        {activeRequests.map((request) => (
          <Fragment key={request.id}>
            <Marker key={`p-${request.id}`} position={[request.passengerLat, request.passengerLng]} icon={pickupIcon}>
              <Popup>Pickup #{request.id}</Popup>
            </Marker>
            <Marker key={`d-${request.id}`} position={[request.destinationLat, request.destinationLng]} icon={destinationIcon}>
              <Popup>Destination #{request.id}</Popup>
            </Marker>
          </Fragment>
        ))}

        {pendingDriverLocation && (
          <Marker position={[pendingDriverLocation.lat, pendingDriverLocation.lng]} icon={pendingDriverIcon}>
            <Popup>Selected Driver Spawn Point</Popup>
          </Marker>
        )}

        {pendingPickupLocation && (
          <Marker position={[pendingPickupLocation.lat, pendingPickupLocation.lng]} icon={pickupIcon}>
            <Popup>Selected Pickup Point</Popup>
          </Marker>
        )}

        {pendingDestinationLocation && (
          <Marker position={[pendingDestinationLocation.lat, pendingDestinationLocation.lng]} icon={destinationIcon}>
            <Popup>Selected Destination Point</Popup>
          </Marker>
        )}
      </MapContainer>

      <div className="border-t bg-white/90 px-3 py-2 text-xs text-slate-700">
        {selectionMode === "driver" && "Click on the map to set the new driver location."}
        {selectionMode === "pickup" && "Click on the map to set passenger pickup location."}
        {selectionMode === "destination" && "Click on the map to set destination location."}
        {!selectionMode && "Tip: Use the form buttons to pick driver, pickup, or destination from the map."}
      </div>
    </div>
  );
}

function MapClickHandler({ onMapPick }: { onMapPick: (coords: Coordinates) => void }): null {
  useMapEvents({
    click(event) {
      onMapPick({ lat: event.latlng.lat, lng: event.latlng.lng });
    }
  });

  return null;
}

export type DriverStatus = "available" | "busy";
export type RequestStatus = "waiting" | "matched" | "picked_up" | "completed" | "cancelled";

export interface Driver {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  status: DriverStatus;
  rating: number;
}

export interface RideRequest {
  id: number;
  passengerLat: number;
  passengerLng: number;
  destinationLat: number;
  destinationLng: number;
  priority: boolean;
  status: RequestStatus;
  createdAt: string;
}

export interface Ride {
  id: number;
  driverId: number;
  requestId: number;
  startTime: string | null;
  endTime: string | null;
  distance: number;
  status: string;
  driver: Driver;
  request: RideRequest;
}

export interface SimulationState {
  drivers: Driver[];
  requests: RideRequest[];
  rides: Ride[];
  queue: RideRequest[];
}

export interface RideSummary {
  id: number;
  status: string;
  rider: {
    id: number;
    name: string;
  };
  customer: {
    id: number | null;
    name: string;
  };
  pickup: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  tripDurationSeconds: number | null;
  arrivalToCustomerSeconds: number | null;
  requestedAt: string;
  tripStartedAt: string | null;
  tripEndedAt: string | null;
}

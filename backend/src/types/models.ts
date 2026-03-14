export type Coordinates = {
  lat: number;
  lng: number;
};

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
  createdAt: Date;
}

export interface Ride {
  id: number;
  driverId: number;
  requestId: number;
  startTime: Date | null;
  endTime: Date | null;
  distance: number;
  status: string;
}

export interface DriverScore {
  driver: Driver;
  routeDistanceKm: number;
  etaMinutes: number;
  score: number;
  routePath: string[];
}

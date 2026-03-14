import axios from "axios";
import { RideSummary, SimulationState } from "./types";

const API_BASE = "http://localhost:4000";

export async function fetchSimulationState(): Promise<SimulationState> {
  const response = await axios.get<SimulationState>(`${API_BASE}/simulation/state`);
  return response.data;
}

export async function addDriver(payload: {
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
}): Promise<void> {
  await axios.post(`${API_BASE}/drivers`, payload);
}

export async function addRideRequest(payload: {
  passengerLat: number;
  passengerLng: number;
  destinationLat: number;
  destinationLng: number;
  priority: boolean;
}): Promise<void> {
  await axios.post(`${API_BASE}/requests`, payload);
}

export async function triggerQueueProcessing(): Promise<void> {
  await axios.post(`${API_BASE}/simulation/process`);
}

export async function fetchCustomers(): Promise<Array<{ id: number; name: string; latitude: number; longitude: number }>> {
  const res = await axios.get(`${API_BASE}/customers`);
  return res.data;
}

export async function fetchRides(): Promise<RideSummary[]> {
  const res = await axios.get<RideSummary[]>(`${API_BASE}/rides`);
  return res.data;
}

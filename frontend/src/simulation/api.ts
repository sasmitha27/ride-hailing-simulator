import axios from "axios";
import { SimulationState } from "./types";

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

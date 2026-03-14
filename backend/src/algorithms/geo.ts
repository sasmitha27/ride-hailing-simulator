import { Coordinates } from "../types/models";

const EARTH_RADIUS_KM = 6371;

export function haversineDistanceKm(a: Coordinates, b: Coordinates): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const sa = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));

  return EARTH_RADIUS_KM * c;
}

export function etaMinutes(distanceKm: number, averageSpeedKmh: number): number {
  if (averageSpeedKmh <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  const hours = distanceKm / averageSpeedKmh;
  return hours * 60;
}

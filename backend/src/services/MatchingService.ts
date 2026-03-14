import { Driver, DriverScore, RideRequest } from "../types/models";
import { dijkstra } from "../algorithms/dijkstra";
import { buildCityGraph, nearestGraphNode } from "../algorithms/cityGraph";
import { etaMinutes, haversineDistanceKm } from "../algorithms/geo";

const cityGraph = buildCityGraph();

export class MatchingService {
  constructor(
    private readonly averageSpeedKmh: number,
    private readonly searchRadiusKm: number
  ) {}

  findNearbyDrivers(drivers: Driver[], request: RideRequest): Driver[] {
    return drivers.filter((driver) => {
      const crowFlightDistance = haversineDistanceKm(
        { lat: driver.latitude, lng: driver.longitude },
        { lat: request.passengerLat, lng: request.passengerLng }
      );

      return crowFlightDistance <= this.searchRadiusKm;
    });
  }

  scoreDrivers(drivers: Driver[], request: RideRequest): DriverScore[] {
    const passengerNode = nearestGraphNode({ lat: request.passengerLat, lng: request.passengerLng });

    return drivers
      .map((driver) => {
        const driverNode = nearestGraphNode({ lat: driver.latitude, lng: driver.longitude });
        const pathResult = dijkstra(cityGraph, driverNode, passengerNode);

        if (!Number.isFinite(pathResult.distance)) {
          return null;
        }

        const routeDistanceKm = pathResult.distance;
        const arrivalMinutes = etaMinutes(routeDistanceKm, this.averageSpeedKmh);
        const score = routeDistanceKm + arrivalMinutes;

        return {
          driver,
          routeDistanceKm,
          etaMinutes: arrivalMinutes,
          score,
          routePath: pathResult.path
        } as DriverScore;
      })
      .filter((entry): entry is DriverScore => !!entry)
      .sort((a, b) => a.score - b.score);
  }

  greedyMatch(drivers: Driver[], request: RideRequest): DriverScore | null {
    const nearby = this.findNearbyDrivers(drivers, request);
    if (nearby.length === 0) {
      return null;
    }

    const scored = this.scoreDrivers(nearby, request);
    if (scored.length === 0) {
      return null;
    }

    // Greedy choice: pick the locally optimal candidate with minimum score.
    return scored[0];
  }
}

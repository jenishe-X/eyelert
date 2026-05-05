import type { NavStepMessage } from "../../../shared/protocol";
import type { Coordinate, RestArea } from "./restAreas";

function haversineMeters(a: Coordinate, b: Coordinate): number {
  const toRad = (deg: number): number => (deg * Math.PI) / 180;
  const r = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return r * c;
}

export function findNearestRestArea(origin: Coordinate, restAreas: RestArea[]): RestArea | null {
  if (!restAreas.length) return null;
  return restAreas.reduce((best, candidate) => {
    const dBest = haversineMeters(origin, best.location);
    const dCandidate = haversineMeters(origin, candidate.location);
    return dCandidate < dBest ? candidate : best;
  });
}

export function buildSimpleRouteSteps(
  sessionId: string,
  target: RestArea,
  distanceM: number
): NavStepMessage[] {
  const now = Date.now();
  return [
    {
      type: "NAV_STEP",
      ts: now,
      sessionId,
      stepId: "s1",
      action: "CONTINUE",
      distanceM: Math.max(50, Math.round(distanceM)),
      etaSec: Math.round(distanceM / 10),
      phrase: `Proceed for ${Math.round(distanceM)} meters toward ${target.name}.`,
    },
    {
      type: "NAV_STEP",
      ts: now + 1000,
      sessionId,
      stepId: "s2",
      action: "ARRIVE",
      distanceM: 0,
      etaSec: 0,
      phrase: `Rest area ahead: ${target.name}.`,
    },
  ];
}

export { haversineMeters };

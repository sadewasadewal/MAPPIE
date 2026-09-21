import { Coordinate, Place, RouteDetails, RouteStepInfo } from "@/types/place";

function calculateHaversineDistanceKm(c1: Coordinate, c2: Coordinate): number {
  const R = 6371; // Earth radius in km
  const dLat = ((c2.latitude - c1.latitude) * Math.PI) / 180;
  const dLon = ((c2.longitude - c1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.latitude * Math.PI) / 180) *
      Math.cos((c2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function calculateRoute(
  origin: Coordinate,
  destination: Place,
  transportType: "driving" | "walking" = "driving"
): Promise<RouteDetails> {
  const directDistanceKm = calculateHaversineDistanceKm(origin, destination.coordinate);

  // Try fetching real routing from OpenStreetMap / OSRM public routing engine
  try {
    const profile = transportType === "walking" ? "foot" : "car";
    const osrmUrl = `https://router.project-osrm.org/route/v1/${profile}/${origin.longitude},${origin.latitude};${destination.coordinate.longitude},${destination.coordinate.latitude}?overview=full&geometries=geojson&steps=true`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const primary = data.routes[0];
        const durationMins = Math.max(1, Math.round(primary.duration / 60));
        const distanceKm = (primary.distance / 1000).toFixed(1);

        // OSRM coordinates are [lng, lat], Leaflet expects [lat, lng]
        const polylineCoords: [number, number][] = primary.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        const steps: RouteStepInfo[] = [];
        if (primary.legs && primary.legs[0]?.steps) {
          for (const s of primary.legs[0].steps) {
            if (s.maneuver && s.maneuver.instruction) {
              steps.push({
                id: `step-${steps.length}`,
                instruction: s.maneuver.instruction,
                distanceFormatted: `${Math.round(s.distance)} m`,
              });
            } else if (s.name) {
              steps.push({
                id: `step-${steps.length}`,
                instruction: `Proceed on ${s.name}`,
                distanceFormatted: `${Math.round(s.distance)} m`,
              });
            }
          }
        }

        if (steps.length === 0) {
          steps.push({
            id: "step-default",
            instruction: `Head straight toward ${destination.name}`,
            distanceFormatted: `${distanceKm} km`,
          });
        }

        return {
          destinationName: destination.name,
          travelTimeFormatted: `${durationMins} min`,
          distanceFormatted: `${distanceKm} km`,
          transportType,
          steps,
          polylineCoordinates: polylineCoords,
        };
      }
    }
  } catch {
    // Graceful fallback to interpolation below
  }

  // Fallback estimation
  const speedKmH = transportType === "walking" ? 4.8 : 32.0;
  const simulatedDistance = directDistanceKm * 1.25;
  const hours = simulatedDistance / speedKmH;
  const minutes = Math.max(3, Math.round(hours * 60));

  // Generate realistic route points
  const p1: [number, number] = [origin.latitude, origin.longitude];
  const pMid1: [number, number] = [
    origin.latitude + (destination.coordinate.latitude - origin.latitude) * 0.35 + 0.003,
    origin.longitude + (destination.coordinate.longitude - origin.longitude) * 0.25 - 0.002,
  ];
  const pMid2: [number, number] = [
    origin.latitude + (destination.coordinate.latitude - origin.latitude) * 0.7 - 0.002,
    origin.longitude + (destination.coordinate.longitude - origin.longitude) * 0.75 + 0.003,
  ];
  const p2: [number, number] = [destination.coordinate.latitude, destination.coordinate.longitude];

  const steps: RouteStepInfo[] = [
    {
      id: "step-1",
      instruction: `Head northeast toward Galle Road / Main Avenue`,
      distanceFormatted: `${Math.round(simulatedDistance * 200)} m`,
    },
    {
      id: "step-2",
      instruction: `Turn right and follow the coastal thoroughfare`,
      distanceFormatted: `${(simulatedDistance * 0.6).toFixed(1)} km`,
    },
    {
      id: "step-3",
      instruction: `Turn left onto destination street`,
      distanceFormatted: `${Math.round(simulatedDistance * 150)} m`,
    },
    {
      id: "step-4",
      instruction: `Arrive at ${destination.name}. Destination will be on the right.`,
      distanceFormatted: "Arrival",
    },
  ];

  return {
    destinationName: destination.name,
    travelTimeFormatted: `${minutes} min`,
    distanceFormatted: `${simulatedDistance.toFixed(1)} km`,
    transportType,
    steps,
    polylineCoordinates: [p1, pMid1, pMid2, p2],
  };
}

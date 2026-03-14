/**
 * CHALLENGE 1: Single Technician — Shortest Route
 *
 * A technician starts at a known GPS location and must visit every broken
 * box exactly once. Your goal is to find the shortest possible total travel
 * distance.
 *
 * Scoring:
 *   - Correctness  — every box visited exactly once, distance is accurate.
 *   - Route quality — your total distance is compared against other teams;
 *                     shorter routes score higher on the load tests.
 *
 * Do NOT modify any interface or the pre-implemented helper methods.
 * Implement every method marked with TODO.
 */

export interface Location {
    latitude: number;   // decimal degrees
    longitude: number;  // decimal degrees
}

export interface Box {
    id: string;
    name: string;
    location: Location;
}

export interface Technician {
    id: string;
    name: string;
    startLocation: Location;
}

export interface RouteResult {
    technicianId: string;
    /** Ordered list of box IDs. Every box must appear exactly once. */
    route: string[];
    /** Total travel distance in km. Does NOT include a return leg to start. */
    totalDistanceKm: number;
}

export class RouteOptimizer {

    // ── Pre-implemented helper — do not modify ────────────────────────────────

    /**
     * Returns the great-circle distance in kilometres between two GPS
     * coordinates using the Haversine formula (Earth radius = 6 371 km).
     */
    haversineDistance(loc1: Location, loc2: Location): number {
        const R = 6371;
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const dLat = toRad(loc2.latitude  - loc1.latitude);
        const dLng = toRad(loc2.longitude - loc1.longitude);
        const lat1 = toRad(loc1.latitude);
        const lat2 = toRad(loc2.latitude);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ── Your implementation below ─────────────────────────────────────────────

    calculateRouteDistance(
        technician: Technician,
        boxes: Box[],
        routeIds: string[]
    ): number | null {
        if (routeIds.length === 0) {
            return 0;
        }

        const boxById = new Map<string, Box>(boxes.map(b => [b.id, b]));

        let totalDistance = 0;
        let currentLocation = technician.startLocation;

        for (const boxId of routeIds) {
            const box = boxById.get(boxId);
            if (!box) {
                return null;
            }

            totalDistance += this.haversineDistance(currentLocation, box.location);
            currentLocation = box.location;
        }

        return totalDistance;
    }

    findShortestRoute(technician: Technician, boxes: Box[]): RouteResult {
        if (boxes.length === 0) {
            return {
                technicianId: technician.id,
                route: [],
                totalDistanceKm: 0,
            };
        }

        const remaining = [...boxes];
        const route: string[] = [];
        let currentLocation = technician.startLocation;
        let totalDistance = 0;

        while (remaining.length > 0) {
            let nearestIndex = 0;
            let nearestDistance = this.haversineDistance(currentLocation, remaining[0].location);

            for (let i = 1; i < remaining.length; i++) {
                const dist = this.haversineDistance(currentLocation, remaining[i].location);
                if (dist < nearestDistance || (dist === nearestDistance && remaining[i].id < remaining[nearestIndex].id)) {
                    nearestDistance = dist;
                    nearestIndex = i;
                }
            }

            const next = remaining.splice(nearestIndex, 1)[0];
            route.push(next.id);
            totalDistance += nearestDistance;
            currentLocation = next.location;
        }

        return {
            technicianId: technician.id,
            route,
            totalDistanceKm: totalDistance,
        };
    }
}

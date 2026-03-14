/**
 * CHALLENGE 2: Single Technician — Maximum Boxes in a Working Day
 *
 * A technician has a fixed number of working minutes today. Each box has a
 * GPS location and a repair time. Travelling between locations also burns
 * time. Your goal: choose WHICH boxes to visit and in WHAT ORDER to maximise
 * the number of boxes fixed before time runs out.
 *
 * The key insight — the closest box is NOT always the best choice:
 *   A nearby box with a long fix time can consume all remaining budget,
 *   whereas skipping it might let you fix two or three faster boxes instead.
 *   Your algorithm must weigh travel time against fix time to make the right call.
 *
 * Do NOT modify any interface or the pre-implemented helper methods.
 * Implement every method marked with TODO.
 */

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Box {
    id: string;
    name: string;
    location: Location;
    /** Minutes needed to fully repair this box once the technician arrives. */
    fixTimeMinutes: number;
}

export interface Technician {
    id: string;
    name: string;
    startLocation: Location;
    speedKmh: number;
    workingMinutes: number;
}

export interface DayPlanResult {
    technicianId: string;
    /** Ordered list of box IDs visited today. Every box must be fully completed. */
    plannedRoute: string[];
    /** Total minutes used (travel + all fix times). Must be ≤ workingMinutes. */
    totalTimeUsedMinutes: number;
    /** Equal to plannedRoute.length. */
    boxesFixed: number;
    /** Every box NOT in plannedRoute. */
    skippedBoxIds: string[];
}

export class DayPlanner {

    // ── Pre-implemented helpers — do not modify ───────────────────────────────

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

    /**
     * Returns the travel time in minutes between two locations at a given speed.
     *   travelTimeMinutes = (distanceKm / speedKmh) × 60
     */
    travelTimeMinutes(loc1: Location, loc2: Location, speedKmh: number): number {
        return (this.haversineDistance(loc1, loc2) / speedKmh) * 60;
    }

    // ── Your implementation below ─────────────────────────────────────────────

    calculateRouteDuration(
        technician: Technician,
        boxes: Box[],
        routeIds: string[]
    ): number | null {
        // TODO: implement this method
         if (routeIds.length === 0) {
            return 0;
        }

        const boxById = new Map<string, Box>(boxes.map(b => [b.id, b]));

        let totalDuration = 0;

        let currentLocation = technician.startLocation;

        for (const boxId of routeIds) {
            const box = boxById.get(boxId);
            if (!box) {
                return null;
            }

            const addedCost = this.travelTimeMinutes(currentLocation,box.location,technician.speedKmh) + box.fixTimeMinutes;
            
            totalDuration += addedCost;

            currentLocation = box.location;
        }

        return totalDuration;

    }

    planDay(technician: Technician, boxes: Box[]): DayPlanResult {
        if (boxes.length === 0) {
            return {
                technicianId: technician.id,
                plannedRoute: [],
                totalTimeUsedMinutes: 0,
                boxesFixed: 0,
                skippedBoxIds: [],
            };
        }

        const remaining = [...boxes];
        const route: string[] = [];
        let currentLocation = technician.startLocation;
        let remainingTime = technician.workingMinutes;

        while (remainingTime > 0 && remaining.length > 0) {
            let bestIndex = -1;
            let bestCost = Infinity; 

            // Find the box that fits and has the lowest cost
            for (let i = 0; i < remaining.length; i++) {
                const travelTime = this.travelTimeMinutes(
                    currentLocation,
                    remaining[i].location,
                    technician.speedKmh
                );
                const totalCost = travelTime + remaining[i].fixTimeMinutes;

                // Consider boxes that can fit in remaining time
                if (totalCost <= remainingTime) {
                    // Pick box with lowest cost &  break ties by ID
                    if ( totalCost < bestCost || (totalCost === bestCost && (bestIndex === -1 || remaining[i].id < remaining[bestIndex].id))
                    ) {
                        bestCost = totalCost;
                        bestIndex = i;
                    }
                }
            }

            // If no box was chosen, exit the loop
            if (bestIndex === -1) break;

            // Add the selected box to the route
            const next = remaining.splice(bestIndex, 1)[0];
            route.push(next.id);
            remainingTime -= bestCost;
            currentLocation = next.location;
        }

        return {
            technicianId: technician.id,
            plannedRoute: route,
            totalTimeUsedMinutes: technician.workingMinutes - remainingTime,
            boxesFixed: route.length,
            skippedBoxIds: remaining.map(box => box.id),
        };
    }
}

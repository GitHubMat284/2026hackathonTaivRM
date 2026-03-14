/**
 * CHALLENGE 3: Minimum Technicians — Fix All Boxes Within a Deadline
 *
 * All boxes must be repaired within deadlineMinutes. All technicians start
 * from the SAME location. Each box is assigned to exactly one technician
 * (no overlapping). Your goal: find the MINIMUM number of technicians needed
 * so that every technician finishes all their assigned boxes on time.
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
    /** Minutes needed to fully repair this box. */
    fixTimeMinutes: number;
}

export interface TechnicianAssignment {
    /** Label for this technician, e.g. "Technician 1", "Technician 2", … */
    technicianLabel: string;
    /** Ordered list of box IDs this technician will visit and fix. */
    assignedBoxIds: string[];
    /** Total time used (travel + fix). Must be ≤ deadlineMinutes. */
    totalTimeMinutes: number;
}

export interface TeamSizeResult {
    /** Minimum number of technicians needed. Equals assignments.length. */
    techniciansNeeded: number;
    /** One entry per technician. No box ID appears in more than one entry. */
    assignments: TechnicianAssignment[];
    /** True when all boxes are assigned and every technician finishes on time. */
    feasible: boolean;
}

export class TeamSizer {

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

    calculateAssignmentDuration(
        startLocation: Location,
        speedKmh: number,
        boxes: Box[],
        routeIds: string[]
    ): number | null {
        // TODO: implement this method
         if (routeIds.length === 0) {
                    return 0;
                }
        
                const boxById = new Map<string, Box>(boxes.map(b => [b.id, b]));
        
                let totalDuration = 0;
        
                let currentLocation = startLocation;
        
                for (const boxId of routeIds) {
                    const box = boxById.get(boxId);
                    if (!box) {
                        return null;
                    }
        
                    const addedCost = this.travelTimeMinutes(currentLocation,box.location,speedKmh) + box.fixTimeMinutes;
        
                    totalDuration += addedCost;
        
                    currentLocation = box.location;
                }
        
                return totalDuration;
    }

    tryAssign(
        startLocation: Location,
        speedKmh: number,
        boxes: Box[],
        numTechnicians: number,
        deadlineMinutes: number
    ): TechnicianAssignment[] | null {
        // TODO: implement this method
        throw new Error('Not implemented');
    }

    findMinimumTeamSize(
        startLocation: Location,
        speedKmh: number,
        boxes: Box[],
        deadlineMinutes: number
    ): TeamSizeResult {
        // TODO: implement this method
        throw new Error('Not implemented');
    }
}

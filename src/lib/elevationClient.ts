/**
 * @fileoverview Elevation data fetching using Open-Elevation API.
 */

export interface ElevationPoint {
    lat: number;
    lon: number;
    elevation: number;
}

/**
 * Fetch elevation data for a grid of points using Open-Elevation API.
 * @param centerLat - Center latitude
 * @param centerLon - Center longitude
 * @param radius - Radius in meters
 * @param gridSize - Number of points per side (default: 20x20 grid)
 * @returns Promise resolving to array of elevation points
 */
export async function fetchElevationGrid(
    centerLat: number,
    centerLon: number,
    radius: number = 500,
    gridSize: number = 20
): Promise<ElevationPoint[]> {
    console.log(`[Elevation] Fetching ${gridSize}x${gridSize} elevation grid`);
    console.log(`[Elevation] Center: lat=${centerLat}, lon=${centerLon}, radius=${radius}m`);

    // Calculate bounding box (simple lat/lon approximation)
    const latDelta = (radius / 111320); // meters to degrees lat (approx)
    const lonDelta = (radius / (111320 * Math.cos(centerLat * Math.PI / 180))); // meters to degrees lon

    console.log(`[Elevation] Grid bounds: lat[${(centerLat - latDelta).toFixed(6)}, ${(centerLat + latDelta).toFixed(6)}], lon[${(centerLon - lonDelta).toFixed(6)}, ${(centerLon + lonDelta).toFixed(6)}]`);

    const points: { latitude: number; longitude: number }[] = [];

    // Generate grid of points
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const latFrac = (i / (gridSize - 1)) * 2 - 1; // -1 to 1
            const lonFrac = (j / (gridSize - 1)) * 2 - 1; // -1 to 1

            points.push({
                latitude: centerLat + latFrac * latDelta,
                longitude: centerLon + lonFrac * lonDelta
            });
        }
    }

    try {
        // Use allorigins proxy with POST data
        const apiUrl = 'https://api.open-elevation.com/api/v1/lookup';

        // For POST requests, we need to use a different approach
        // Let's try direct fetch first (open-elevation might support CORS)
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ locations: points })
        });

        if (!response.ok) {
            throw new Error(`Elevation API failed: ${response.status}`);
        }

        const data = await response.json();

        const elevationPoints: ElevationPoint[] = data.results.map((result: any) => ({
            lat: result.latitude,
            lon: result.longitude,
            elevation: result.elevation || 0
        }));

        console.log(`[Elevation] Fetched ${elevationPoints.length} points`);
        return elevationPoints;
    } catch (error) {
        console.error('[Elevation] Fetch failed:', error);
        // Return flat terrain as fallback
        return points.map(p => ({
            lat: p.latitude,
            lon: p.longitude,
            elevation: 0
        }));
    }
}

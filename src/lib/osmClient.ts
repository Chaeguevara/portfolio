/**
 * @fileoverview Client-side OSM data fetching utilities.
 * Provides geocoding and building data retrieval from OpenStreetMap.
 */

import type { FeatureCollection, Feature } from 'geojson';

/**
 * Geocode an address or place name to coordinates using Nominatim.
 * Uses allorigins CORS proxy for browser access.
 * @param query - Address or place name to geocode.
 * @returns Promise resolving to {lat, lon} coordinates.
 */
export async function geocode(query: string): Promise<{ lat: number; lon: number }> {
    console.log(`[OSMClient] Geocoding: ${query}`);
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(nominatimUrl)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.status}`);
        }

        const wrapper = await response.json();
        const data = JSON.parse(wrapper.contents);

        if (!data || data.length === 0) {
            throw new Error(`No results found for: ${query}`);
        }

        const result = data[0];
        console.log(`[OSMClient] Geocoded to: ${result.lat}, ${result.lon}`);

        return {
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon)
        };
    } catch (error) {
        console.error('[OSMClient] Geocoding error:', error);
        throw error;
    }
}

/**
 * Fetch buildings within a radius from OSM using Overpass API.
 * @param lat - Latitude of center point.
 * @param lon - Longitude of center point.
 * @param radius - Radius in meters (default: 500m).
 * @returns Promise resolving to GeoJSON FeatureCollection.
 */
export async function fetchBuildingsInRadius(
    lat: number,
    lon: number,
    radius: number = 500
): Promise<FeatureCollection> {
    console.log(`[OSMClient] Fetching buildings around ${lat}, ${lon} (radius: ${radius}m)`);

    // Overpass QL query for buildings
    const query = `
    [out:json][timeout:25];
    (
      way["building"](around:${radius},${lat},${lon});
      relation["building"](around:${radius},${lat},${lon});
    );
    out geom;
  `;

    // Use GET with encoded query through allorigins proxy
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(overpassUrl)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Overpass API failed: ${response.status}`);
        }

        const wrapper = await response.json();
        const data = JSON.parse(wrapper.contents);
        console.log(`[OSMClient] Fetched ${data.elements?.length || 0} buildings`);

        // Convert OSM JSON to GeoJSON
        return osmToGeoJSON(data);
    } catch (error) {
        console.error('[OSMClient] Fetch buildings error:', error);
        throw error;
    }
}

/**
 * Convert OSM Overpass JSON to GeoJSON FeatureCollection.
 * @param osmData - Raw OSM JSON from Overpass API.
 * @returns GeoJSON FeatureCollection.
 */
interface OsmElement {
    type: string;
    id?: number;
    geometry?: { lon: number; lat: number }[];
    tags?: Record<string, string>;
}

function osmToGeoJSON(osmData: { elements?: OsmElement[] }): FeatureCollection {
    const features: Feature[] = [];

    for (const element of osmData.elements || []) {
        if (element.type !== 'way' && element.type !== 'relation') continue;
        if (!element.geometry) continue;

        // Extract coordinates
        const coordinates = element.geometry.map((node) => [node.lon, node.lat]);

        // Close the polygon if not already closed
        if (coordinates.length > 0) {
            const first = coordinates[0];
            const last = coordinates[coordinates.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
                coordinates.push([...first]);
            }
        }

        // Extract building height (default to 10m if not specified)
        const tags = element.tags || {};
        let height = 10; // Default height in meters

        if (tags.height) {
            // Priority 1: Use explicit height if available
            height = parseFloat(tags.height);
        } else if (tags['building:levels']) {
            // Priority 2: Calculate from building stories (4m per level)
            height = parseFloat(tags['building:levels']) * 4;
        }

        const feature: Feature = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [coordinates]
            },
            properties: {
                osmId: element.id,
                building: tags.building || 'yes',
                height: height,
                name: tags.name || undefined,
                addr_street: tags['addr:street'] || undefined,
                addr_housenumber: tags['addr:housenumber'] || undefined
            }
        };

        features.push(feature);
    }

    return {
        type: 'FeatureCollection',
        features
    };
}

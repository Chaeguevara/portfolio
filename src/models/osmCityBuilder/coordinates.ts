/**
 * @fileoverview Coordinate conversion utilities for OSM City Builder.
 */

import * as THREE from 'three';
import type { Feature } from 'geojson';

/**
 * Convert lat/lon coordinates to scene coordinates.
 * Simple equirectangular projection centered at origin.
 */
export function latLonToScene(
    lat: number,
    lon: number,
    centerLat: number,
    centerLon: number
): { x: number; z: number } {
    const scale = 100000; // Scale factor for meters to scene units
    const x = (lon - centerLon) * Math.cos(centerLat * Math.PI / 180) * scale;
    const z = -(lat - centerLat) * scale; // Negative Z for north
    return { x, z };
}

/**
 * Extract footprint points from a GeoJSON feature.
 */
export function getFootprintPoints(
    feature: Feature,
    centerLat: number,
    centerLon: number
): THREE.Vector2[] {
    if (feature.geometry.type !== 'Polygon') return [];

    const coords = feature.geometry.coordinates[0] as [number, number][];
    const points: THREE.Vector2[] = [];

    for (let i = 0; i < coords.length - 1; i++) {
        const [lon, lat] = coords[i];
        const { x, z } = latLonToScene(lat, lon, centerLat, centerLon);
        points.push(new THREE.Vector2(x, z));
    }

    return points;
}

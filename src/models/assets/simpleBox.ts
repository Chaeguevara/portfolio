/**
 * @fileoverview Skeleton model generator for a bicycle.
 * Provides a scene graph hierarchy with placeholder or procedural geometry.
 */

import * as THREE from 'three';

/**
 * Creates a bicycle skeleton using a Scene Graph hierarchy.
 * 
 * Hierarchy:
 * - bicycleGroup
 *   └── frameGroup
 *       ├── backWheelGroup
 *       │   └── (Mesh: Wheel, Spokes)
 *       ├── steerGroup
 *       │   ├── frontWheelGroup
 *       │   └── handlebarsGroup
 *       └── seatGroup
 *           └── (Mesh: Seat)
 * 
 * @returns An object containing the root group and references to its movable parts.
 */
export const createBicycleSkeleton = () => {
    const bicycleGroup = new THREE.Group();
    bicycleGroup.name = 'bicycleGroup';

    // 1. Frame Group - Main body
    const frameGroup = new THREE.Group();
    frameGroup.name = 'frameGroup';
    bicycleGroup.add(frameGroup);

    // Frame Material

    const frameMaterial = new THREE.MeshBasicMaterial({ color: 0x88ccff });
    const thickness = 0.05;

    // Helper to create a tube between two points
    const createTube = (p1: THREE.Vector3, p2: THREE.Vector3, radi: number) => {
        const vector = new THREE.Vector3().subVectors(p2, p1);
        const length = vector.length();
        const geometry = new THREE.CylinderGeometry(radi, radi, length, 8);
        const mesh = new THREE.Mesh(geometry, frameMaterial);

        // Orient the cylinder (default Y-axis) to the vector
        const axis = new THREE.Vector3(0, 1, 0);
        mesh.quaternion.setFromUnitVectors(axis, vector.clone().normalize());

        // Position at midpoint
        const center = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        mesh.position.copy(center);

        return mesh;
    };

    // Hardpoints (match existing group positions)
    const rearDropout = new THREE.Vector3(-1.2, 0, 0); // Matches backWheelGroup
    const bb = new THREE.Vector3(0, -0.5, 0);
    const seatNode = new THREE.Vector3(-0.4, 0.5, 0); // Matches seatGroup

    // Derived Head Tube points (vertical for simplicity, could angle later)
    const headTubeTop = new THREE.Vector3(1.2, 0.2, 0);
    const headTubeBottom = new THREE.Vector3(1.2, -0.2, 0);

    // Generate Tubes
    const seatTube = createTube(bb, seatNode, thickness);
    const downTube = createTube(bb, headTubeBottom, thickness); // Connect to lower head tube
    const topTube = createTube(seatNode, headTubeTop, thickness); // Connect to upper head tube
    const headTube = createTube(headTubeBottom, headTubeTop, thickness * 1.5); // Thicker head tube

    // Stays (connect to rear dropout)
    const chainStay = createTube(bb, rearDropout, thickness * 0.8);
    const seatStay = createTube(seatNode, rearDropout, thickness * 0.8);

    frameGroup.add(seatTube);
    frameGroup.add(downTube);
    frameGroup.add(topTube);
    frameGroup.add(headTube);
    frameGroup.add(chainStay);
    frameGroup.add(seatStay);


    // 2. Back Wheel Group - Child of Frame (fixed relative to frame)
    const backWheelGroup = new THREE.Group();
    backWheelGroup.name = 'backWheelGroup';
    backWheelGroup.position.set(-1.2, 0, 0); // Position relative to frame center
    frameGroup.add(backWheelGroup);

    // TODO: Add Wheel Meshes
    // backWheelGroup.add(wheelMesh)


    // 3. Front Fork/Wheel Group - Child of Frame (but pivotable for steering)
    // Actually, usually Fork is child of Frame, and FrontWheel is child of Fork.
    // Let's make a SteerGroup (Fork + Bars + FrontWheel)
    const steerGroup = new THREE.Group();
    steerGroup.name = 'steerGroup';
    steerGroup.position.set(1.2, 0, 0); // Headtube position
    frameGroup.add(steerGroup);

    const frontWheelGroup = new THREE.Group();
    frontWheelGroup.name = 'frontWheelGroup';
    frontWheelGroup.position.set(0, -0.5, 0); // Relative to steer pivot? simplify for now
    // Actually simplicity: FrontWheel at (0,0,0) of SteerGroup if pivot is axle? 
    // Usually pivot is headtube.
    steerGroup.add(frontWheelGroup);

    // Handlebars child of SteerGroup
    const handlebarsGroup = new THREE.Group();
    handlebarsGroup.name = 'handlebarsGroup';
    handlebarsGroup.position.set(0, 0.5, 0); // Up from pivot
    steerGroup.add(handlebarsGroup);


    // 4. Seat Group
    const seatGroup = new THREE.Group();
    seatGroup.name = 'seatGroup';
    seatGroup.position.set(-0.4, 0.5, 0);
    frameGroup.add(seatGroup);


    // Debug Visuals (Placeholder until implementation)
    // Add axes to each significant group to verify hierarchy
    const axesSize = 0.5;
    bicycleGroup.add(new THREE.AxesHelper(axesSize + 0.5)); // Root (Largest)
    frameGroup.add(new THREE.AxesHelper(axesSize));
    backWheelGroup.add(new THREE.AxesHelper(axesSize));
    steerGroup.add(new THREE.AxesHelper(axesSize));


    return {
        group: bicycleGroup,
        parts: {
            frame: frameGroup,
            backWheel: backWheelGroup,
            steer: steerGroup,
            frontWheel: frontWheelGroup,
            handlebars: handlebarsGroup
        },
        dispose: () => {
            // Disposal logic
        }
    };
};

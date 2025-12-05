import * as THREE from 'three';

// Skeleton for the bicycle using Scene Graph hierarchy
// Hierarchy:
// bicycleGroup
// └── frameGroup
//     ├── backWheelGroup
//     │   └── (Mesh: Wheel, Spokes)
//     ├── frontWheelGroup (pivot for steering?)
//     │   └── (Mesh: Wheel, Spokes)
//     ├── handlebarsGroup (pivot for steering)
//     │   └── (Mesh: Bars)
//     └── seatGroup
//         └── (Mesh: Seat)

export const createBicycleSkeleton = () => {
    const bicycleGroup = new THREE.Group();
    bicycleGroup.name = 'bicycleGroup';

    // 1. Frame Group - Main body
    const frameGroup = new THREE.Group();
    frameGroup.name = 'frameGroup';
    bicycleGroup.add(frameGroup);

    // TODO: Add Frame Meshes here
    // const frameMesh = ...
    // frameGroup.add(frameMesh);
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x88ccff }));
    frameGroup.add(frameMesh);


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

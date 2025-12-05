import * as THREE from 'three';

type MaterialFactory = (color: number | string) => THREE.Material;

/**
 * Creates a procedural bicycle group.
 * @param createMat Function to create materials (e.g., toon material).
 * @returns The bicycle group and a cleanup function to dispose geometries.
 */
export const createBicycle = (createMat: MaterialFactory) => {
    const bikeGroup = new THREE.Group();
    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

    // Helper to track disposables
    const register = <T extends THREE.BufferGeometry | THREE.Material>(obj: T): T => {
        disposables.push(obj);
        return obj;
    };

    // 1. Wheels
    const wheelGeo = register(new THREE.TorusGeometry(0.7, 0.05, 8, 32));
    const wheelMat = register(createMat(0x333333)); // Dark rubber
    const rimGeo = register(new THREE.TorusGeometry(0.6, 0.02, 8, 32));
    const rimMat = register(createMat(0xeeeeee));   // Silver rim

    // Spokes
    const spokeGeo = register(new THREE.CylinderGeometry(0.6, 0.6, 0.02, 8));
    const spokeMat = register(createMat(0xdddddd));

    const createWheel = () => {
        const wheelGroup = new THREE.Group();
        wheelGroup.add(new THREE.Mesh(wheelGeo, wheelMat));
        wheelGroup.add(new THREE.Mesh(rimGeo, rimMat));

        const spokes = new THREE.Mesh(spokeGeo, spokeMat);
        spokes.rotation.x = Math.PI / 2;
        wheelGroup.add(spokes);

        return { group: wheelGroup, spokes };
    };

    // Back Wheel
    const backWheelObj = createWheel();
    const backWheel = backWheelObj.group;
    backWheel.position.set(-1.2, 0.7, 0);
    bikeGroup.add(backWheel);

    // Front Wheel
    const frontWheelObj = createWheel();
    const frontWheel = frontWheelObj.group;
    frontWheel.position.set(1.2, 0.7, 0);
    bikeGroup.add(frontWheel);


    // 2. Frame (Procedural tubes/cylinders)
    // Main color: Pastel Blue/Green
    const frameColor = 0x88ccff;
    const frameMat = register(createMat(frameColor));
    const frameThick = 0.08;

    const frameGroup = new THREE.Group();
    bikeGroup.add(frameGroup);

    // Coordinate points for frame
    const pPedal = new THREE.Vector3(0, 0.7, 0); // Bottom bracket
    const pSeat = new THREE.Vector3(-0.4, 1.5, 0); // Seat post top
    const pHandlePost = new THREE.Vector3(0.9, 1.6, 0); // Handlebar post top
    const pRearAxle = new THREE.Vector3(-1.2, 0.7, 0);
    const pFrontAxle = new THREE.Vector3(1.2, 0.7, 0);

    // Helper to draw a tube between two points
    const addFrameTube = (p1: THREE.Vector3, p2: THREE.Vector3, mat: THREE.Material, thick = frameThick) => {
        const dist = p1.distanceTo(p2);
        const geo = register(new THREE.CylinderGeometry(thick, thick, dist, 12));
        const mesh = new THREE.Mesh(geo, mat);
        // Position at midpoint
        mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
        // Look at p2
        mesh.lookAt(p2);
        // Rotate 90 deg so cylinder aligns with look vector (cylinder default is Y axis)
        mesh.rotateX(Math.PI / 2);
        frameGroup.add(mesh);
    };

    // Seat tube (Pedal -> Seat)
    addFrameTube(pPedal, pSeat, frameMat);
    // Down tube (Pedal -> HandlePost)
    addFrameTube(pPedal, pHandlePost, frameMat);
    // Top tube (Seat -> HandlePost)
    addFrameTube(pSeat, pHandlePost, frameMat);
    // Seat stays (Seat -> RearAxle)
    addFrameTube(pSeat, pRearAxle, frameMat, 0.06);
    // Chain stays (Pedal -> RearAxle)
    addFrameTube(pPedal, pRearAxle, frameMat, 0.06);

    // Fork (HandlePost -> FrontWheel)
    const forkMat = register(createMat(0xeeeeee)); // Chrome/Silver
    addFrameTube(pHandlePost, pFrontAxle, forkMat, 0.06);

    // 3. Components

    // Seat
    const seatGeo = register(new THREE.BoxGeometry(0.4, 0.1, 0.3));
    const seatMat = register(createMat(0x554433)); // Brown leather
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.copy(pSeat).add(new THREE.Vector3(0, 0.05, 0));
    bikeGroup.add(seat);

    // Handlebars
    const handleGeo = register(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8));
    const handleMat = register(createMat(0x888888));
    const handlebars = new THREE.Mesh(handleGeo, handleMat);
    handlebars.position.copy(pHandlePost);
    handlebars.rotation.z = Math.PI / 2; // Horizontal
    bikeGroup.add(handlebars);

    // Pedals & Crank
    const crankGeo = register(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16));
    const crankMesh = new THREE.Mesh(register(crankGeo), register(createMat(0x333333)));
    crankMesh.position.copy(pPedal);
    crankMesh.rotation.x = Math.PI / 2;
    bikeGroup.add(crankMesh);


    return {
        group: bikeGroup,
        // Expose parts for animation
        wheels: {
            back: backWheel,
            front: frontWheel,
            backSpokes: backWheelObj.spokes, // Spoke mesh for rotation
            frontSpokes: frontWheelObj.spokes
        },
        dispose: () => {
            disposables.forEach(d => d.dispose());
        }
    };
};

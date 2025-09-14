//https://threejs.org/manual/#en/scenegraph
import * as THREE from 'three';
import GUI from 'lil-gui';

const addItemsToScene = (scene:THREE.Scene, objects:Array<THREE.Object3D>) => {
  for (const obj of objects){
    scene.add(obj);
  }
};

const definePlanet = (
  sphereGeometry:THREE.SphereGeometry,
  color:number,
  emissive:number,
  scale: readonly [number, number, number]
):THREE.Mesh => {
  const planetMaterial = new THREE.MeshPhongMaterial({color, emissive });
  const planetMesh = new THREE.Mesh(sphereGeometry, planetMaterial);
  planetMesh.scale.set(scale[0], scale[1], scale[2]);
  return planetMesh;
};

const defineOrbit = (orbitXPosition:number):THREE.Object3D => {
  const orbitObj = new THREE.Object3D();
  orbitObj.position.x = orbitXPosition;
  return orbitObj;
};

const defineEarthSystem = (sphereGeometry:THREE.SphereGeometry,earthPosition:number) => {
  const earthOrbit = defineOrbit(earthPosition);
  earthOrbit.name = 'earthOrbit';
  const earthMesh = definePlanet(sphereGeometry, 0x2233FF, 0x112244, [1, 1, 1]);
  earthMesh.name = 'earthMesh';
  const moonOrbit = defineOrbit(1.5);
  moonOrbit.name = 'moonOrbit';
  const moonMesh = definePlanet(sphereGeometry, 0x888888, 0x222222, [0.5, 0.5, 0.5]);
  moonMesh.name = 'moonMesh';
  moonOrbit.add(moonMesh);
  earthOrbit.add(earthMesh);
  earthOrbit.add(moonOrbit);
  return earthOrbit;
};


const defineSphereGeometry = (radius:number, widthSegments:number, heightSegments:number):THREE.SphereGeometry => {
  const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  return sphereGeometry;
};

const setRenderer= (animate:XRFrameRequestCallback | null, container:HTMLElement):THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const { clientWidth, clientHeight } = container;
  renderer.setSize(clientWidth || window.innerWidth, clientHeight || window.innerHeight);
  if (animate) renderer.setAnimationLoop(animate);
  return renderer;
};

const setCamera = (container: HTMLElement):THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(
    45,
    (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight),
    1,
    500,
  );
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);
  return camera;
};

const addAxesToObjs = (gui:GUI, objects:Array<THREE.Object3D>):undefined => {
  objects.forEach((node)=>{
    const label = node.name || 'object';
    makeAxisGrid(gui, node, label, 10);
  });
};

const makeAxisGrid = (gui:GUI, node:THREE.Object3D, label:string, units:number):undefined =>{
  const helper = new AxisGridHelper(node,units);
  gui.add(helper,'visible').name(label);
};
class AxisGridHelper {
  grid: THREE.GridHelper | undefined = undefined;
  axes:THREE.AxesHelper | undefined = undefined;
  _visible:boolean = false;

  constructor(node:THREE.Object3D,units=10){
    const axes = new THREE.AxesHelper();
    const axesMat = (axes.material as THREE.Material | THREE.Material[]);
    if (Array.isArray(axesMat)) {
      axesMat.forEach(m => m.depthTest = false);
    } else {
      axesMat.depthTest = false;
    }
    axes.renderOrder = 2;
    node.add(axes);
    const grid = new THREE.GridHelper(units,units);
    const gridMat = (grid.material as THREE.Material | THREE.Material[]);
    if (Array.isArray(gridMat)) {
      gridMat.forEach(m => m.depthTest = false);
    } else {
      gridMat.depthTest = false;
    }
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
  }

  get visible() {
    return this._visible;
  }

  set visible(v) {
    this._visible = v;
    this.grid!.visible = v;
    this.axes!.visible = v;
  }

}

type Options = { mount?: HTMLElement; preview?: boolean };

const orbitObject = (scene:THREE.Scene, opts: Options = {}) =>{
  const container = opts.mount ?? document.getElementById("work") ?? document.body;
  // For previews, render once without animation loop or listeners
  let stopped = false;
  const renderer = setRenderer(opts.preview ? null : animate, container);
  container.appendChild(renderer.domElement);

  const gui = opts.preview ? null : new GUI();

  const camera = setCamera(container);

  const solarSystem = new THREE.Object3D();
  solarSystem.name = 'solarSystem';

  const sphereGeometry = defineSphereGeometry(1,6,6);
  const sunMesh = definePlanet(sphereGeometry, 0xFFFF00, 0xFFFF00, [5, 5, 5]);
  sunMesh.name = 'sun';

  const earthSystem = defineEarthSystem(sphereGeometry,10);
  const earthMesh = earthSystem.children[0];
  earthMesh.name = earthMesh.name || 'earth';
  const moonOrbit = earthSystem.children[1] as THREE.Object3D;
  moonOrbit.name = moonOrbit.name || 'moonOrbit';
  const moonMesh = (earthSystem.children[1] as THREE.Object3D).children[0] as THREE.Object3D;
  moonMesh.name = (moonMesh.name) || 'moon';

  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.PointLight(color,intensity);
  const lightHelper = new THREE.PointLightHelper(light, 0.5);

  solarSystem.add(sunMesh);
  solarSystem.add(earthSystem);
  addItemsToScene(scene, [light, lightHelper, solarSystem]);

  // GUI axis/grid toggles per node
  if (gui) {
    addAxesToObjs(gui, [solarSystem, sunMesh, earthSystem, earthMesh, moonOrbit, moonMesh]);
  }

  // Handle resize (skip for previews)
  function onWindowResize() {
    const { clientWidth, clientHeight } = container;
    const width = clientWidth || window.innerWidth;
    const height = clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  if (!opts.preview) window.addEventListener('resize', onWindowResize);

  function animate() {
    if (stopped) return;
    // Spins and orbits
    solarSystem.rotation.y += 0.005;   // solar system slow drift
    earthSystem.rotation.y += 0.01;    // earth orbits sun
    moonOrbit.rotation.y += 0.03;      // moon orbits earth
    (earthMesh as THREE.Object3D).rotation.y += 0.02; // earth spin
    sunMesh.rotation.y += 0.004;       // sun slow spin
    (moonMesh as THREE.Object3D).rotation.y += 0.02;  // moon spin

    renderer.render(scene, camera);
  }
  // initial kick; setAnimationLoop will take over for non-preview
  if (!opts.preview) {
    animate();
  } else {
    renderer.render(scene, camera);
  }

  // Cleanup disposer
  return () => {
    stopped = true;
    if (!opts.preview) window.removeEventListener('resize', onWindowResize);
    try { renderer.setAnimationLoop(null as unknown as XRFrameRequestCallback); } catch { /* noop */ }
    try { renderer.dispose(); } catch { /* noop */ }
    try { renderer.domElement.remove(); } catch { /* noop */ }
    try { gui?.destroy(); } catch { /* noop */ }
  };
};

export {orbitObject};

import * as THREE from "three";

type Options = { mount?: HTMLElement; preview?: boolean };

const drawLines = (scene: THREE.Scene, opts: Options = {}) => {
  const container = opts.mount ?? document.getElementById("work") ?? document.body;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const { clientWidth, clientHeight } = container;
  renderer.setSize(clientWidth || window.innerWidth, clientHeight || window.innerHeight);
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    45,
    (clientWidth || window.innerWidth) / (clientHeight || window.innerHeight),
    1,
    500,
  );
  camera.position.set(0, 0, opts.preview ? 60 : 100);
  camera.lookAt(0, 0, 0);

  const material = new THREE.LineBasicMaterial({color:0x0000ff});

  const points = [] as THREE.Vector3[];
  points.push(new THREE.Vector3(-10,0,0));
  points.push(new THREE.Vector3(0,10,0));
  points.push(new THREE.Vector3(10,0,0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry,material);

  scene.add(line);

  function onResize(){
    const { clientWidth, clientHeight } = container;
    const width = clientWidth || window.innerWidth;
    const height = clientHeight || window.innerHeight;
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  if (!opts.preview) window.addEventListener('resize', onResize);

  renderer.render(scene,camera);

  return () => {
    if (!opts.preview) window.removeEventListener('resize', onResize);
    try { renderer.dispose(); } catch { /* noop */ }
    try { renderer.domElement.remove(); } catch { /* noop */ }
    try { geometry.dispose(); } catch { /* noop */ }
    try { (material as THREE.Material).dispose(); } catch { /* noop */ }
  };
};

export {drawLines};

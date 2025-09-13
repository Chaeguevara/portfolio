import * as THREE from "three";

type Options = { mount?: HTMLElement; preview?: boolean };

const rotateBox = (scene:THREE.Scene, opts: Options = {}) =>{
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const container = opts.mount ?? document.getElementById("work") ?? document.body;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const { clientWidth, clientHeight } = container;
  renderer.setSize(clientWidth || window.innerWidth, clientHeight || window.innerHeight);
  renderer.setAnimationLoop(animate);

  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = opts.preview ? 3 : 5;

  function onResize(){
    const { clientWidth, clientHeight } = container;
    const width = clientWidth || window.innerWidth;
    const height = clientHeight || window.innerHeight;
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();
}

export {
  rotateBox
}

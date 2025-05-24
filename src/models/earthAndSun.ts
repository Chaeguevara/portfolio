//https://threejs.org/manual/#en/scenegraph
import * as THREE from 'three';

const defineEarthMesh = (sphereGeometry:THREE.SphereGeometry) => {
  const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthMesh.position.x = 10;
  return earthMesh;
};

const defineSunMesh = (sphereGeometry:THREE.SphereGeometry):THREE.Mesh =>{
  const sunMaterial = new THREE.MeshPhongMaterial({emissive:0xffff00});
  const sunMesh = new THREE.Mesh(sphereGeometry,sunMaterial);
  sunMesh.scale.set(5,5,5);
  return sunMesh;
};

const defineSphereGeometry = (radius:number, widthSegments:number, heightSegments:number):THREE.SphereGeometry => {
  const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  return sphereGeometry;
};

const setRenderer= (animate:XRFrameRequestCallback):THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  return renderer;
};

const setCamera = ():THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500,
  );
  camera.position.set(0, 100, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);
  return camera;
};

const orbitObject = (scene:THREE.Scene) =>{
  const renderer = setRenderer(animate);
  const doc = document.getElementById("work");
  doc?.appendChild(renderer.domElement);

  const camera = setCamera();
  const objects:THREE.Mesh[] = [];

  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = defineSphereGeometry(radius,widthSegments,heightSegments);
  const sunMesh = defineSunMesh(sphereGeometry);
  const earthMesh = defineEarthMesh(sphereGeometry);

  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.PointLight(color,intensity);

  scene.add(light);
  scene.add(sunMesh);
  scene.add(earthMesh);
  objects.push(sunMesh);
  objects.push(earthMesh);

  function animate() {
    objects.forEach((obj)=>{
      obj.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
  }
  animate();
};

export {orbitObject};

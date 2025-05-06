import * as THREE from "three";
import { Works } from "./data/works";

const createScene = (path:number) => () => {
  const scene = new THREE.Scene();
  const color = new THREE.Color().setRGB(0.5,1,0.5);
  scene.background = color
  const animate = Works[path]? Works[path].animation : null
  if (animate){
    animate(scene);
  }

};

export { createScene };

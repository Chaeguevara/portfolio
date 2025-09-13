import * as THREE from "three";
import { Works } from "./data/works";
import { AppConfig, resolveThreeBgFromCss } from "./config";

const createScene = (path:number) => () => {
  const scene = new THREE.Scene();
  const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
  scene.background = new THREE.Color(bg);
  const animate = Works[path]? Works[path].animation : null;
  if (animate){
    animate(scene);
  }
};

export { createScene };

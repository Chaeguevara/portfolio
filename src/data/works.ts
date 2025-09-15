import { drawLines,orbitObject,rotateBox, materialsShowcase, planBuilder } from "../models";
import { Scene } from "three";
type AnimOpts = { mount?: HTMLElement; preview?: boolean };
export const Works: Record<number,{
  title: string;
  body: string;
  animation:(scene:Scene, opts?: AnimOpts) => () => void;
}> = {
    1:{
    title:"helo world",
    body: "this is the new world",
    animation : (scene, opts) => rotateBox(scene, opts)
    },
    2:{
    title:"My next World",
    body: "Card is making a world ",
    animation : (scene, opts) => drawLines(scene, opts)
    },
    3:{
    title:"Orbig Galxy",
    body: "Orbiting Galaxy",
    animation : (scene, opts) => orbitObject(scene, opts)
    },
  4:{
    title:"Materials Gallery",
    body: "A quick tour of common Three.js materials",
    animation : (scene, opts) => materialsShowcase(scene, opts)
  },
    5:{
    title:"2D Plan Builder",
    body: "PoC: define room relations and see a 2D layout with optional arrows.",
    animation : (scene, opts) => planBuilder(scene, opts)
    },
};

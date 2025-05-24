import { drawLines,orbitObject,rotateBox,} from "../models";
import { Scene } from "three";
export const Works: Record<number,{
  title: string;
  body: string;
  animation:(scene:Scene) => void;
}> = {
    1:{
    title:"helo world",
    body: "this is the new world",
    animation : rotateBox
    },
    2:{
    title:"My next World",
    body: "Card is making a world ",
    animation : drawLines
    },
    3:{
    title:"Orbig Galxy",
    body: "Orbiting Galaxy",
    animation : orbitObject
    },
};

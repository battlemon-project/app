import { useRef, useEffect } from "react";
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import { Home } from './Models/Home'

export default function HomeScene() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  
  useEffect(() => {
    const engine = new BABYLON.Engine(canvasRef.current, true); // Generate the BABYLON 3D engine
  
    // Add your code here matching the playground format
    const createScene = function () {
      
      const scene = new BABYLON.Scene(engine);
      
      const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.1,
        700,
        new BABYLON.Vector3(0,0,0),
        scene
      )
    
      camera.inputs.clear();
    
      
      camera.attachControl(canvasRef.current, true);
      new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    
      Home(scene);
    
      return scene;
    };
    
    const scene = createScene(); //Call the createScene function
    
    engine.runRenderLoop(function () {
      scene.render();
    });
    
    window.addEventListener("resize", function () {
      engine.resize();
    });

  }, []);

  return (
    <canvas ref={canvasRef} className="vh-100 w-100 position-absolute top-0" id="homeCanvas" />
  )
}

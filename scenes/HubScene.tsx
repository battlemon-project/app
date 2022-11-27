import { useRef, useEffect } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import { LoadPlatforms } from './Models/Platforms'
import { Lemon } from './Models/Lemon'

export default function HubScene() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
    (loader as GLTFFileLoader).animationStartMode = GLTFLoaderAnimationStartMode.NONE;
  });
  
  useEffect(() => {
    const engine = new BABYLON.Engine(canvasRef.current, true);
    engine.displayLoadingUI();
  
    // Add your code here matching the playground format
    const createScene = function () {
      
      const scene = new BABYLON.Scene(engine);
      
      const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.1,
        800,
        new BABYLON.Vector3(0,0,0),
        scene
      )
    
      camera.lowerAlphaLimit = camera.alpha;
      camera.upperAlphaLimit = camera.alpha;
      camera.upperBetaLimit = camera.beta;
      camera.lowerBetaLimit = camera.beta;
      camera.wheelPrecision = 0.5;
      camera.lowerRadiusLimit = 300;
      camera.upperRadiusLimit = 1000;
    
      
      camera.attachControl(canvasRef.current, true);
      new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    


      LoadPlatforms(scene, canvasRef.current as HTMLCanvasElement);
      Lemon(scene)
      //LoadBackpack(scene)
    
      return scene;
    };
    
    const scene = createScene();
    scene.executeWhenReady(() => engine.hideLoadingUI()); 
    
    engine.runRenderLoop(function () {
      scene.render();
    });
    
    window.addEventListener("resize", function () {
      engine.resize();
    });

    return () => {
      engine.hideLoadingUI()
    }
  }, []);

  return (
    <canvas ref={canvasRef} className="vh-100 w-100 position-absolute top-0" id="renderCanvas" />
  )
}

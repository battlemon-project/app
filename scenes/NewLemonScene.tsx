import { useRef, useEffect } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import loadingScreen from './Models/SceneLoader'
import { NewLemon } from './Models/NewLemon'

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
        Math.PI / 2,
        Math.PI / 2.1,
        8,
        new BABYLON.Vector3(0,1,0),
        scene
      )
    
      camera.lowerBetaLimit = camera.beta;
      camera.upperBetaLimit = camera.beta;
      camera.wheelPrecision = 10;
      camera.lowerRadiusLimit = 3;
      camera.upperRadiusLimit = 9;
    
      
      camera.attachControl(canvasRef.current, true);
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
      light.intensity = 0.1
    
      var hdrTexture = new BABYLON.HDRCubeTexture("/glb/studio_country_hall_1k.hdr", scene, 15);
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 0.5;

      NewLemon(scene, null)
    
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

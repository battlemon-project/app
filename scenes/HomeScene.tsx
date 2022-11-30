import { useRef, useEffect } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import { Home } from './Models/Home'

export default function HomeScene() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  
  BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
    (loader as GLTFFileLoader).animationStartMode = GLTFLoaderAnimationStartMode.ALL;
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
        Math.PI / 2,
        0,
        new BABYLON.Vector3(0,5,90),
        scene
      )
    

      camera.fov = 0.5;
      camera.inputs.clear();
    
      
      camera.attachControl(canvasRef.current, true);
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(10,10,-10), scene);
      light.intensity = 0.1
      
      var hdrTexture = new BABYLON.HDRCubeTexture("/glb/clarens_midday_1k.hdr", scene, 23);
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 1.2;

      Home(scene);
    
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
    <canvas ref={canvasRef} className="vh-100 w-100 position-absolute top-0" id="homeCanvas" />
  )
}

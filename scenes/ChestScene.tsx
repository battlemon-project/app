import { useRef, useEffect } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import LoadingScreen from '../components/LoadingScreen'
import { Chest } from './Models/Chest'
import { Vector3 } from "@babylonjs/core";
import { useRouter } from 'next/router'

export default function HomeScene() {
  const FpsElement = typeof document !== 'undefined' && document.getElementById("fps");
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const router = useRouter();
  
  BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
    (loader as GLTFFileLoader).animationStartMode = GLTFLoaderAnimationStartMode.ALL;
  });

  useEffect(() => {
    const engine = new BABYLON.Engine(canvasRef.current, true);
    engine.loadingScreen = new LoadingScreen(canvasRef.current as HTMLCanvasElement)
    engine.displayLoadingUI();

    // Add your code here matching the playground format
    const createScene = function () {
      const scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.FreeCamera(
        "camera",
        new BABYLON.Vector3(125,24,-90),
        scene
      )

      camera.fov = 0.01;
      camera.setTarget(new Vector3(0,0.5,0))
      
      
      camera.attachControl(canvasRef.current, true);
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(10,10,-10), scene);
      light.intensity = 0.5
          
      var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(`${process.env.NEXT_PUBLIC_STATIC}/glb/environmentSpecular.env`, scene);
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 1;
      scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001);

      Chest(scene, router);
    
      return scene;
    };
    
    const scene = createScene();
    scene.executeWhenReady(() => engine.hideLoadingUI());   

    engine.runRenderLoop(function () {
      scene.render();
      if (FpsElement) FpsElement.innerHTML = engine.getFps().toFixed(2)
    });
    
    window.addEventListener("resize", function () {
      engine.resize();
    });

    return () => {
      engine.hideLoadingUI()
    }
  }, []);

  return (
      <canvas ref={canvasRef} style={{width: '100%', height: '500px', background: 'transparent'}} id="chestCanvas" />
  )
}

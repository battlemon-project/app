import { useRef, useEffect } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import { Home } from './Models/Home'
import { Vector3 } from "@babylonjs/core";
import loadingScreen from './Models/SceneLoader'
import { useRouter } from 'next/router'

export default function HomeScene() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const router = useRouter();
  
  BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
    (loader as GLTFFileLoader).animationStartMode = GLTFLoaderAnimationStartMode.ALL;
  });

  useEffect(() => {
    const engine = new BABYLON.Engine(canvasRef.current, true);
    engine.loadingScreen = new loadingScreen('test')
    engine.displayLoadingUI();

    // Add your code here matching the playground format
    const createScene = function () {
      const scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.FreeCamera(
        "camera",
        new BABYLON.Vector3(0,5,90),
        scene
      )

      camera.fov = 0.5;
      camera.setTarget(new Vector3(0,5,0))
      
      scene.beforeRender = function() {
        if (camera.rotation.x > 0.05) {
          camera.rotation.x = 0.05;
        } else if (camera.rotation.x < -0.05) {
          camera.rotation.x = -0.05;
        }
        
        const detaview = document.body.offsetWidth / 1200
        let angle = 0;
        if (detaview < 0.5) {
          angle = detaview/1.2
        } else if (detaview < 1) {
          angle = detaview/3.2
        } 
        if (camera.rotation.y > Math.PI + angle) {
          camera.rotation.y = Math.PI + angle;
        } else if (camera.rotation.y < Math.PI - angle) {
          camera.rotation.y = Math.PI - angle;
        }
      };

      console.log(camera.inputs)
      
      camera.attachControl(canvasRef.current, true);
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(10,10,-10), scene);
      light.intensity = 0.1
      
      var hdrTexture = new BABYLON.HDRCubeTexture("/glb/clarens_midday_1k.hdr", scene, 23);
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 1.2;

      Home(scene, router);
    
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

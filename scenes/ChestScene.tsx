import { useRef, useEffect } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import LoadingScreen from '../components/LoadingScreen';
import { Vector3 } from "@babylonjs/core";
import { useRouter } from 'next/router'
import { Chests } from "./Models/Chests";
import styles from './../styles/Shop.module.css';

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
        new BABYLON.Vector3(0,24,-220),
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

      BABYLON.SceneLoader.OnPluginActivatedObservable.add((loader) => {
        (loader as GLTFFileLoader).animationStartMode = GLTFLoaderAnimationStartMode.NONE;
      })

      Chests(scene, router);

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
      <div className="position-relative">
        <div className={`position-absolute w-100 d-flex ${styles.amount}`}>
          <div className={`text-white text-center fs-3 fw-semibold ${styles.amount__item} ${styles['amount__item--1']}`}>
            <div>0 / 2000</div>
            <button className="btn btn-lg btn-light px-4 mt-3">0.2ETH</button>
          </div>
          <div className={`text-white text-center fs-3 fw-semibold ${styles.amount__item} ${styles['amount__item--2']}`}>
            <div>0 / 1000</div>
            <button className="btn btn-lg btn-light px-4 mt-3">0.5ETH</button>
          </div>
          <div className={`text-white text-center fs-3 fw-semibold ${styles.amount__item} ${styles['amount__item--3']}`}>
            <div>0 / 500</div>
            <button className="btn btn-lg btn-light px-4 mt-3">1ETH</button>
          </div>
        </div>
        <canvas ref={canvasRef} style={{width: '100%', height: '500px', background: 'transparent'}} id="chestCanvas" />
      </div>
  )
}

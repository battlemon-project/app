import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  useRef,
} from 'react';
import * as BABYLON from '@babylonjs/core';
import {
  type GLTFFileLoader,
  GLTFLoaderAnimationStartMode,
} from '@babylonjs/loaders';
import LoadingScreen from '../components/LoadingScreen';
import { LemonGenerator } from './Models/LemonGenerator';
import { LemonType } from '../helpers/lemonStore';
import { Inventory } from '../components/HubLemon/Inventory';

type updateLemonType = (lemon: LemonType) => Promise<void>;
let updateSomeLemon: updateLemonType = async () => {};

export default function HubScene() {
  const FpsElement = document.getElementById('fps');
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
      (loader as GLTFFileLoader).animationStartMode =
        GLTFLoaderAnimationStartMode.NONE;
    });

    const engine = new BABYLON.Engine(canvasRef.current, true);
    engine.loadingScreen = new LoadingScreen(
      canvasRef.current as HTMLCanvasElement
    );
    engine.displayLoadingUI();

    const createScene = function () {
      const scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.ArcRotateCamera(
        'camera',
        Math.PI / 0.292,
        Math.PI / 1.9,
        450,
        new BABYLON.Vector3(0, 100, 0),
        scene
      );

      camera.lowerRadiusLimit = 450;
      camera.upperRadiusLimit = 450;
      camera.viewport.x = -0.2;

      camera.attachControl(canvasRef.current, true);
      const light = new BABYLON.HemisphericLight(
        'light',
        new BABYLON.Vector3(1, 1, 1),
        scene
      );
      light.intensity = 1;

      const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        `${process.env.NEXT_PUBLIC_STATIC}/glb/environmentSpecular.env`,
        scene
      );
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 1;
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000000001);

      LemonGenerator(scene).then((result) => {
        updateSomeLemon = async (lemon: LemonType) => {
          await result.change(lemon);
          console.log('changed');
          scene.render();
        };
        scene.render();
      });

      return scene;
    };

    const scene = createScene();
    scene.executeWhenReady(() => {
      //runDebugger(scene)
      engine.hideLoadingUI();
    });

    engine.runRenderLoop(function () {
      scene.render();
      if (FpsElement) FpsElement.innerHTML = engine.getFps().toFixed(2);
    });

    window.addEventListener('resize', function () {
      engine.resize();
    });

    return () => {
      engine.hideLoadingUI();
      engine.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas className="h-full w-full" id="renderCanvas" ref={canvasRef} />

      <div className='absolute top-4 right-0 max-w-xl 2xl:max-w-2xl w-full'>
        <Inventory />
      </div>
    </div>
  );
}

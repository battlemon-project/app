import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { Vector3 } from '@babylonjs/core';
import {
  type GLTFFileLoader,
  GLTFLoaderAnimationStartMode,
} from '@babylonjs/loaders';
import LoadingScreen from '../components/LoadingScreen';
import { useRouter } from 'next/router';
import { Chests } from './Models/Chests';
import classNames from 'classnames';

export default function HomeScene() {
  const FpsElement =
    typeof document !== 'undefined' && document.getElementById('fps');
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const router = useRouter();

  BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
    (loader as GLTFFileLoader).animationStartMode =
      GLTFLoaderAnimationStartMode.ALL;
  });

  useEffect(() => {
    const engine = new BABYLON.Engine(canvasRef.current, true);
    engine.loadingScreen = new LoadingScreen(
      canvasRef.current as HTMLCanvasElement
    );
    engine.displayLoadingUI();

    // Add your code here matching the playground format
    const createScene = function () {
      const scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.FreeCamera(
        'camera',
        new BABYLON.Vector3(0, 24, -220),
        scene
      );

      camera.fov = 0.01;
      camera.setTarget(new Vector3(0, 0.5, 0));

      camera.attachControl(canvasRef.current, true);
      const light = new BABYLON.HemisphericLight(
        'light',
        new BABYLON.Vector3(10, 10, -10),
        scene
      );
      light.intensity = 0.5;

      const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        `${process.env.NEXT_PUBLIC_STATIC}/glb/environmentSpecular.env`,
        scene
      );
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 1;
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.0000000000000001);

      BABYLON.SceneLoader.OnPluginActivatedObservable.add((loader) => {
        (loader as GLTFFileLoader).animationStartMode =
          GLTFLoaderAnimationStartMode.NONE;
      });

      Chests(scene);

      return scene;
    };

    const scene = createScene();
    scene.executeWhenReady(() => {
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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='h-screen w-screen fixed top-0'
      id="chestCanvas"
    />
  );
}

import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';
import * as BABYLON from '@babylonjs/core';
import {
  type GLTFFileLoader,
  GLTFLoaderAnimationStartMode,
} from '@babylonjs/loaders';
import { Platforms } from './Models/Platforms';
import { LemonGenerator } from './Models/LemonGenerator';
import type { BabylonLoaderType } from '../components/BabylonLoader';
import { useLemonStore } from '../helpers/lemonStore';
import { Inventory } from '../components/HubLemon/Inventory';

let destroyPlatforms: () => void;
let backPlatforms: () => void;
let newLemonUnsubscribe: () => void;

export default function HubScene({
  setLoader,
  handleMintLemon,
}: {
  setLoader: Dispatch<SetStateAction<BabylonLoaderType>>;
  handleMintLemon: () => Promise<void | undefined>;
}) {
  const { inventoryIsOpened } = useLemonStore();
  const FpsElement = document.getElementById('fps');
  const [step, changeStep] = useState<number>(0);

  useEffect(() => {
    setLoader((loader) => ({ ...loader, babylon: true }));
  }, []);

  useEffect(() => {
    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
      (loader as GLTFFileLoader).animationStartMode =
        GLTFLoaderAnimationStartMode.NONE;
    });

    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function () {
      const scene = new BABYLON.Scene(engine);

      const camera = new BABYLON.ArcRotateCamera(
        'camera',
        -Math.PI / 2,
        Math.PI / 2.1,
        450,
        new BABYLON.Vector3(0, 0, 0),
        scene
      );

      camera.lowerAlphaLimit = camera.alpha;
      camera.upperAlphaLimit = camera.alpha;
      camera.upperBetaLimit = camera.beta;
      camera.lowerBetaLimit = camera.beta;
      camera.wheelPrecision = 0.5;
      camera.lowerRadiusLimit = 2450;
      camera.upperRadiusLimit = 2450;

      camera.attachControl(canvas, true);
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

      Platforms({
        scene,
        canvas,
        mintEvent: handleMintLemon,
        changeStep,
      }).then((Platforms) => {
        destroyPlatforms = Platforms.destroy;
        backPlatforms = Platforms.back;
        LemonGenerator(scene).then(({ unsubscribe }) => {
          newLemonUnsubscribe = unsubscribe;
        });
      });

      return scene;
    };

    const scene = createScene();
    scene.executeWhenReady(() => {
      setLoader((loader) => ({ ...loader, babylon: false }));
    });

    engine.runRenderLoop(function () {
      scene.render();
      if (FpsElement) FpsElement.innerHTML = engine.getFps().toFixed(2);
    });

    window.addEventListener('resize', function () {
      engine.resize();
    });

    return () => {
      if (destroyPlatforms) destroyPlatforms();
      if (newLemonUnsubscribe) newLemonUnsubscribe();
      setLoader((loader) => ({ ...loader, babylon: false }));
      engine.dispose();
    };
  }, []);

  const toggleBack = () => {
    if (backPlatforms) {
      changeStep(0);
      useLemonStore.setState({ inventoryIsOpened: false });
      backPlatforms();
    }
  };

  return (
    <div className="relative">
      <canvas className="h-full w-full" id="renderCanvas" />
      <div className="container w-full absolute left-0 top-5">
        {step > 0 && (
          <button
            className="border border-white rounded-md font-semibold flex items-center text-white leading-none text-xl mb-3 px-6 py-0.5 top-20 hover:text-black hover:bg-white transition-all"
            onClick={toggleBack}
          >
            <span style={{ fontSize: '26px', lineHeight: '32px' }}>
              &larr;{' '}
            </span>
            Back
          </button>
        )}
      </div>

      {inventoryIsOpened ? (
        <div className="absolute top-1/2 right-0 max-w-2xl w-full -translate-y-1/2">
          <Inventory />
        </div>
      ) : null}
    </div>
  );
}

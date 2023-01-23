import { useEffect, Dispatch, SetStateAction, useState } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import { Platforms } from './Models/Platforms'
import { NewLemon } from './Models/NewLemon'
import type { Loader } from "../pages/hub";
import { lemonStore } from "../helpers/lemonStore";
import Inventory from "../components/Inventory";



let destroyPlatforms: () => void;
let backPlatforms: () => void;

export default function HubScene(
  {
    setLoader,
    handleMint
  }:{
    setLoader: Dispatch<SetStateAction<Loader>> ,
    handleMint: () => Promise<void>
  }) {

  const FpsElement = document.getElementById("fps");
  const [step, changeStep] = useState<number>(0)

  useEffect(() => {
    setLoader((loader) => ({ ...loader, babylon: true }));
  }, [])

  useEffect(() => {

    BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
      (loader as GLTFFileLoader).animationStartMode = GLTFLoaderAnimationStartMode.NONE;
    });

    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
    const engine = new BABYLON.Engine(canvas, true);
  
    const createScene = function () {
      
      const scene = new BABYLON.Scene(engine);
      
      const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.1,
        450,
        new BABYLON.Vector3(0,0,0),
        scene
      )
    
      camera.lowerAlphaLimit = camera.alpha;
      camera.upperAlphaLimit = camera.alpha;
      camera.upperBetaLimit = camera.beta;
      camera.lowerBetaLimit = camera.beta;
      camera.wheelPrecision = 0.5;
      camera.lowerRadiusLimit = 2450;
      camera.upperRadiusLimit = 2450;
    
      
      camera.attachControl(canvas, true);
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 1), scene);
      light.intensity = 1
    
      var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/glb/environmentSpecular.env", scene);
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 1;
      scene.clearColor = new BABYLON.Color4(0,0,0,0.0000000000000001);

      //skybox
      // const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:4000}, scene);
      // const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      // skyboxMaterial.backFaceCulling = false;
      // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/assets/hub/", scene, undefined, true, [
      //   '/assets/hub/px.png',
      //   '/assets/hub/py.png',
      //   '/assets/hub/pz.png',
      //   '/assets/hub/nx.png',
      //   '/assets/hub/ny.png',
      //   '/assets/hub/nz.png'
      // ]);
      // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      // skybox.material = skyboxMaterial;
      
      Platforms({
        scene, 
        canvas,
        mintEvent: handleMint,
        changeStep: changeStep
      }).then(Platforms => {
        destroyPlatforms = Platforms.destroy
        backPlatforms = Platforms.back
        NewLemon(scene)
      });
      
      //LoadBackpack(scene)
    
      return scene;
    };
    
    const scene = createScene();
    scene.executeWhenReady(() => {
      setLoader((loader) => ({ ...loader, babylon: false }));
    });
    
    engine.runRenderLoop(function () {
      scene.render();
      if (FpsElement) FpsElement.innerHTML = engine.getFps().toFixed(2)
    });
    
    window.addEventListener("resize", function () {
      engine.resize();
    });

    return () => {
      if (destroyPlatforms) destroyPlatforms();
      setLoader((loader) => ({ ...loader, babylon: false }));
      engine.dispose();
    }
  }, []);

  const toggleBack = () => {
    if (backPlatforms) {
      changeStep(0);
      lemonStore.setState((store) => ({ ...store, inventoryIsOpened: false }))
      backPlatforms();
    }
  }

  return (
    <> 
      <canvas className="vh-100 w-100 position-absolute top-0 hubbg" id="renderCanvas" />
      <div className="container position-relative">
        {step > 0 && <button className="btn btn-lg btn-outline-light mb-3 position-absolute pt-0 pb-1 px-4" style={{top: '80px'}} onClick={toggleBack}>
          <span style={{fontSize: '26px', lineHeight: '32px'}}>&larr; </span> 
          Back
        </button>}
        
        <Inventory />
      </div>
    </>
  )
}

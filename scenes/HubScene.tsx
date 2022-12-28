import { useEffect, Dispatch, SetStateAction } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import { Platforms } from './Models/Platforms'
import { NewLemon } from './Models/NewLemon'
import { Ring } from './Models/Ring'
import type { SuiMoveObject } from "@mysten/sui.js";
import type { Loader } from "../pages/hub";

export default function HubScene(
  { 
    lemons, 
    setLoader,
    handleMint
  }:{ 
    lemons: SuiMoveObject[], 
    setLoader: Dispatch<SetStateAction<Loader>> ,
    handleMint: () => Promise<void>
  }) {

  const FpsElement = document.getElementById("fps");
  

  useEffect(() => {
    setLoader((loader) => ({ ...loader, babylon: true }));
  }, [])

  useEffect(() => {
    let removePlatforms: () => void;

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

      //skybox
      const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:4000}, scene);
      const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/assets/hub/", scene, undefined, true, [
        '/assets/hub/px.png',
        '/assets/hub/py.png',
        '/assets/hub/pz.png',
        '/assets/hub/nx.png',
        '/assets/hub/ny.png',
        '/assets/hub/nz.png'
      ]);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skybox.material = skyboxMaterial;
      
      Platforms(scene, camera, handleMint, canvas).then(unload => {
        removePlatforms = unload
        NewLemon(scene, lemons)
        Ring(scene)
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
      if (removePlatforms) removePlatforms();
      setLoader((loader) => ({ ...loader, babylon: false }));
      engine.dispose();
    }
  }, [lemons]);

  return (
    <> 
    
      <canvas className="vh-100 w-100 position-absolute top-0" id="renderCanvas" />
      {JSON.stringify(lemons)}
    </>
  )
}

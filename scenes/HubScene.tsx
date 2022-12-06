import { useEffect, Dispatch, SetStateAction } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import { Platforms } from './Models/Platforms'
import { NewLemon } from './Models/NewLemon'
import type { SuiMoveObject } from "@mysten/sui.js";
import type { Loader } from "../pages/hub";

export default function HubScene(
  { 
    lemons, 
    setLoader 
  }:{ 
    lemons: SuiMoveObject[], 
    setLoader: Dispatch<SetStateAction<Loader>> 
  }) {
  //console.log(lemons)
  
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
        800,
        new BABYLON.Vector3(0,0,0),
        scene
      )
    
      camera.lowerAlphaLimit = camera.alpha;
      camera.upperAlphaLimit = camera.alpha;
      camera.upperBetaLimit = camera.beta;
      camera.lowerBetaLimit = camera.beta;
      camera.wheelPrecision = 0.5;
      camera.lowerRadiusLimit = 500;
      camera.upperRadiusLimit = 1000;
    
      
      camera.attachControl(canvas, true);
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
      light.intensity = 0.9
    
      var hdrTexture = new BABYLON.HDRCubeTexture("/glb/studio_country_hall_1k.hdr", scene, 15);
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 0.4;

      //skybox
      const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:4000}, scene);
      const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/hub/", scene, undefined, true, [
        'assets/hub/px.png',
        'assets/hub/py.png',
        'assets/hub/pz.png',
        'assets/hub/nx.png',
        'assets/hub/ny.png',
        'assets/hub/nz.png'
      ]);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skybox.material = skyboxMaterial;
      
      Platforms(scene, canvas)
      .then(unload => {
        removePlatforms = unload
      });
      NewLemon(scene, lemons)
      //LoadBackpack(scene)
    
      return scene;
    };
    
    const scene = createScene();
    scene.executeWhenReady(() => {
      setLoader((loader) => ({ ...loader, babylon: false }));
    });
    
    engine.runRenderLoop(function () {
      scene.render();
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
    <canvas className="vh-100 w-100 position-absolute top-0" id="renderCanvas" />
  )
}

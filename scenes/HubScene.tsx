import { useRef, useEffect } from "react";
import * as BABYLON from '@babylonjs/core';
import { GLTFFileLoader, GLTFLoaderAnimationStartMode } from "@babylonjs/loaders";
import loadingScreen from './Models/SceneLoader'
import { LoadPlatforms } from './Models/Platforms'
import { NewLemon } from './Models/NewLemon'
import { useSetRecoilState } from 'recoil';
import { loaderState } from '../atoms/loaderState';

export default function HubScene() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const setLoader = useSetRecoilState(loaderState);

  BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (loader) {
    (loader as GLTFFileLoader).animationStartMode = GLTFLoaderAnimationStartMode.NONE;
  });
  
  useEffect(() => {
    const engine = new BABYLON.Engine(canvasRef.current, true);
    engine.loadingScreen = new loadingScreen('', setLoader)
    engine.displayLoadingUI();
  
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
      camera.lowerRadiusLimit = 300;
      camera.upperRadiusLimit = 1000;
    
      
      camera.attachControl(canvasRef.current, true);
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
      light.intensity = 0.5
    
      var hdrTexture = new BABYLON.HDRCubeTexture("/glb/studio_country_hall_1k.hdr", scene, 15);
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 0.2;

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

      LoadPlatforms(scene, canvasRef.current as HTMLCanvasElement);
      NewLemon(scene)
      //LoadBackpack(scene)
    
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
    <canvas ref={canvasRef} className="vh-100 w-100 position-absolute top-0" id="renderCanvas" />
  )
}

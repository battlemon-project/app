import { Scene, SceneLoader } from "@babylonjs/core"

export const Home = async (scene: Scene): Promise<void> => {
  await SceneLoader.ImportMeshAsync(
    "",
    "/glb/",
    "MainMenu_Stripes_Export_lemonprise.glb",
    scene
  );


  scene.getMeshByName('factory_stroke')!.visibility = 0;
  scene.getMeshByName('craft_stroke')!.visibility = 0;
  scene.getMeshByName('craft_manipulator_stroke')!.visibility = 0;
  scene.getMeshByName('craft_manipulator7_stroke')!.visibility = 0;
  scene.getMeshByName('craft_manipulator8_stroke')!.visibility = 0;
  scene.getMeshByName('stake_stroke')!.visibility = 0;
  scene.getMeshByName('stake_coin_stroke')!.visibility = 0;
  scene.getMeshByName('shop_stroke')!.visibility = 0;
  scene.getMeshByName('windmill_stroke_01')!.visibility = 0;
  scene.getMeshByName('windmill_stroke_02')!.visibility = 0;
  scene.getMeshByName('arena_stroke')!.visibility = 0;
  scene.getMeshByName('arena_rotator_a_stroke')!.visibility = 0;
  scene.getMeshByName('download_client_car_stroke')!.visibility = 0;
  scene.getMeshByName('download_client_car_adv_stroke')!.visibility = 0;
  scene.getMeshByName('lemterprise_stroke')!.visibility = 0;
  scene.getMeshByName('engines_stroke')!.visibility = 0;

}

import { Scene, SceneLoader, AnimationGroup } from "@babylonjs/core"

export const NewLemon = async (scene: Scene): Promise<void> => {
  const lemonScene = await SceneLoader.ImportMeshAsync(
    "",
    "/glb/",
    "BTLMN_Rig_203.glb",
    scene
  );

  const idleKatanaAnimation = scene.getAnimationGroupByName("Idle_001_weapon") as AnimationGroup
  idleKatanaAnimation.start(true, 1)

  const idleAnimation = scene.getAnimationGroupByName("Idle_001") as AnimationGroup
  idleAnimation.start(true, 1)
  
  // const katana0 = scene.getMeshByName('ColdArms_Katana_NA01.002_primitive0')
  // const katana1 = scene.getMeshByName('ColdArms_Katana_NA01.002_primitive1')
  // if (katana0) katana0.visibility = 0;
  // if (katana1) katana1.visibility = 0;

  const katana = await SceneLoader.LoadAssetContainerAsync(
    "/glb/",
    "katana.glb",
    scene
  );

  let clonedKatana = katana.instantiateModelsToScene(undefined, false, { doNotInstantiate: true })
  let newKatana = clonedKatana.rootNodes[0];
  //newKatana.parent = scene.getMeshByName('placeholder_weapon_r')
  
  const bone = lemonScene.skeletons[0].bones[lemonScene.skeletons[0].getBoneIndexByName('DEF-hand.R')]
  console.log(bone)
  newKatana.parent = bone

}

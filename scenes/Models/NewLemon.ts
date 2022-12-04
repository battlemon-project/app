import { Scene, SceneLoader, AnimationGroup, TransformNode, Vector3 } from "@babylonjs/core"

export const NewLemon = async (scene: Scene): Promise<void> => {
  const lemonScene = await SceneLoader.ImportMeshAsync(
    "",
    "/glb/",
    "BTLMN_Outfits_Lemon_A (2).glb",
    scene
  );


  const lemonPosition = scene.getNodeByName(`LemonPos_1`) as TransformNode
  const lemon = lemonScene.meshes[0];
  lemon.scaling = new Vector3(100,100,100);
  lemon.parent = lemonPosition;
  lemon.rotation = lemonPosition.rotation;

  let weapon = (await SceneLoader.ImportMeshAsync("", "/glb/", "katana.glb", scene)).meshes[0];
  weapon.parent = scene.getMeshByName('placeholder_weapon_r') as TransformNode

  let cap = (await SceneLoader.ImportMeshAsync("", "/glb/", "BTLMN_Caps_A.glb", scene)).meshes[0];
  cap.parent = scene.getMeshByName('placeholder_cap') as TransformNode

  let cloth = (await SceneLoader.ImportMeshAsync("", "/glb/", "BTLMN_Clothes_A.glb", scene)).meshes[0];
  cloth.parent = scene.getMeshByName('placeholder_cloth') as TransformNode
  
  let back = (await SceneLoader.ImportMeshAsync("", "/glb/", "BTLMN_Backs_A.glb", scene)).meshes[0];
  back.parent = scene.getMeshByName('placeholder_back') as TransformNode

  let face = (await SceneLoader.ImportMeshAsync("", "/glb/", "BTLMN_Faces_A.glb", scene)).meshes[0];
  face.parent = scene.getMeshByName('placeholder_face') as TransformNode

  const placeholder_weapon_idle_001 = scene.getAnimationGroupByName("placeholder_weapon_idle_001") as AnimationGroup
  placeholder_weapon_idle_001.start(true, 1)

  const lemon_idle_001 = scene.getAnimationGroupByName("lemon_idle_001") as AnimationGroup
  lemon_idle_001.start(true, 1)

  const placeholder_head_idle_001 = scene.getAnimationGroupByName("placeholder_head_idle_001") as AnimationGroup
  placeholder_head_idle_001.start(true, 1)

}

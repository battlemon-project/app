import { Scene, SceneLoader, TransformNode, Vector3 } from "@babylonjs/core"

export const Ring = async (scene: Scene): Promise<void> => {
  const mesh = await SceneLoader.ImportMeshAsync(
    "",
    "/glb/",
    "BTLMN_InterfaceRing.glb",
    scene
  );
  
  const ring = scene.getMeshByName('ring_main')
  const ring_rotator = scene.getMeshByName('ring_rotator')
  const ring_back = scene.getMeshByName('ring_back')
  const placement = scene.getMeshByName('ring')
  if (ring && placement && ring_rotator && ring_back) {
    ring_back.visibility = 0
    ring_rotator.visibility = 0
    placement.visibility = 0
    ring.visibility = 0
    ring.parent = placement
    ring.scaling = new Vector3(100,100,100);
  }
}

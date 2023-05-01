import { Scene, SceneLoader, Vector3 } from "@babylonjs/core"
import type { NextRouter } from 'next/router'

export const Chest = async (scene: Scene, router: NextRouter): Promise<void> => {
  await SceneLoader.ImportMeshAsync(
    "",
    `${process.env.NEXT_PUBLIC_MODELS}/treasure/`,
    "basket_a.gltf",
    scene
  );

}

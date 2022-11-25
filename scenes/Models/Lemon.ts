import { Scene, SceneLoader, TransformNode } from "@babylonjs/core"
import data from "./data.json"

export const Lemon = async (scene: Scene): Promise<void> => {
  const container = await SceneLoader.LoadAssetContainerAsync(
    "/glb/",
    "BTLMN_Outfits_Tier_MP_20.glb",
    scene
  );

  // container.materials.forEach((material, index) => {
  //   console.log(material.name)
  //   if (material.name == "MAT_Outfit_Glossy" || material.name == "MAT_Outfit_AA") {
  //     material.bind
  //   }
  // })

  const outfits: string[][] = data.map(({ model }) => {
    return Object.values(model).map((value: any) => {
      if (value && typeof value === 'object' && value.flavour) return value.flavour
      return value
    })
  })

  outfits.forEach((_list, index) => {
    [`Plus_${index+1}`, `Plus_${index+1}_Stroke`].forEach(plus => {
      const mesh = scene.getMeshByName(plus)!
      mesh.visibility = 0
    })

    const nodePosition = scene.getNodeByName(`LemonPos_${index + 1}`) as TransformNode
    let newContainer = container.instantiateModelsToScene((name) => name.split('_primitive')[0], false, { doNotInstantiate: true })
    let newLemon = newContainer.rootNodes[0];
    newLemon.parent = nodePosition;
    newLemon.rotation = nodePosition.rotation;
    newContainer.animationGroups[0].start(true, 1.5);
  })
}

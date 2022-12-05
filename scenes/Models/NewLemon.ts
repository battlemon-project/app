import { Scene, SceneLoader, AnimationGroup, TransformNode, Vector3 } from "@babylonjs/core"
import type { SuiData, SuiMoveObject } from "@mysten/sui.js";

export const NewLemon = async (scene: Scene, lastLemon: SuiData | null): Promise<void> => {
  
  if (lastLemon) {
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

    const traits: { flavour: string, name: string }[] = (lastLemon as SuiMoveObject).fields.traits.map((trait: Record<string, string>) => trait.fields)

    const outfits = [
      {
        model: 'BTLMN_Outfit_Weapon_A.glb',
        placeholder: 'placeholder_weapon_r',
        trait: traits.find(trait => trait.name === 'weapon')
      },
      {
        model: 'BTLMN_Outfit_Cap_A.glb',
        placeholder: 'placeholder_cap',
        trait: traits.find(trait => trait.name === 'cap')
      },
      {
        model: 'BTLMN_Outfit_Cloth_A.glb',
        placeholder: 'placeholder_cloth',
        trait: { name: 'cloth', flavour: 'Cloth_Bandolier_MA02' }
      },
      {
        model: 'BTLMN_Outfit_Back_A.glb',
        placeholder: 'placeholder_back',
        trait: traits.find(trait => trait.name === 'back')
      },
      {
        model: 'BTLMN_Outfit_Face_A.glb',
        placeholder: 'placeholder_face',
        trait: traits.find(trait => trait.name === 'face')
      }
    ]

    for (const outfit of outfits) {
      let trait = (await SceneLoader.ImportMeshAsync("", "/glb/", outfit.model, scene)).meshes[0];
      const all = trait.getChildMeshes();
      all.forEach(one => {
        // console.log(outfit.trait?.flavour)
        // console.log(one.name)
        // debugger;
        if (!one.name.includes(outfit.trait?.flavour || '')) {
          one.visibility = 0;
        }
      })
      trait.parent = scene.getMeshByName(outfit.placeholder) as TransformNode

    }
    
    const placeholder_weapon_idle_001 = scene.getAnimationGroupByName("placeholder_weapon_idle_001") as AnimationGroup
    placeholder_weapon_idle_001.start(true, 1)

    const lemon_idle_001 = scene.getAnimationGroupByName("lemon_idle_001") as AnimationGroup
    lemon_idle_001.start(true, 1)

    const placeholder_head_idle_001 = scene.getAnimationGroupByName("placeholder_head_idle_001") as AnimationGroup
    placeholder_head_idle_001.start(true, 1)
    
  }

}

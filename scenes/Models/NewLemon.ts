import { Scene, SceneLoader, AnimationGroup, TransformNode, Vector3, Mesh, AssetContainer } from "@babylonjs/core"
import type { SuiMoveObject } from "@mysten/sui.js";

export const NewLemon = async (scene: Scene, lemons: SuiMoveObject[]): Promise<void> => {
  const containers: { [key: string]: AssetContainer } = {}
  const lastLemon = lemons[0];

  if (lemons && lemons.length) {
    const models = {
      weapon: 'BTLMN_Outfit_Weapon_A.glb', 
      cap: 'BTLMN_Outfit_Cap_A.glb', 
      cloth: 'BTLMN_Outfit_Cloth_A.glb', 
      back: 'BTLMN_Outfit_Back_A.glb', 
      face: 'BTLMN_Outfit_Face_A.glb'
    }
    for (const [key, link] of Object.entries(models)) {
      containers[key] = await SceneLoader.LoadAssetContainerAsync(
        "/glb/", link, scene
      )
    }
  }


  if (lastLemon) {
    const lemonScene = await SceneLoader.ImportMeshAsync(
      "",
      "/glb/",
      "BTLMN_Lemon_A.glb",
      scene
    );


    const lemonPosition = scene.getNodeByName(`LemonPos_1`) as TransformNode
    const lemon = lemonScene.meshes[0];
    lemon.scaling = new Vector3(100,100,100);
    lemon.position.y = lemon.position.y + 9;
    lemon.parent = lemonPosition;
    lemon.rotation = lemonPosition.rotation;

    const traits: { flavour: string, name: string }[] = (lastLemon as SuiMoveObject).fields.traits.map((trait: Record<string, string>) => trait.fields)

    const clothTrait = traits.find(trait => trait.name === 'cloth');
    if (clothTrait?.flavour == 'Cloth_Poncho_CA01') {
      clothTrait.flavour = 'Cloth_Ninja_Waistband_NA01'
    }
    
    const faceTrait = traits.find(trait => trait.name === 'face');
    if (faceTrait?.flavour == 'Face_Gas_Mask_MA01') {
      faceTrait.flavour = 'Face_Visor_VR_VR01'
    }

    const outfits: { [key: string]: { trait: { flavour: string, name: string } | undefined, placeholder: string }} = {
      weapon: {
        trait: traits.find(trait => trait.name === 'weapon'),
        placeholder: 'placeholder_weapon_r'
      },
      cap: {
        trait: traits.find(trait => trait.name === 'cap'),
        placeholder: 'placeholder_cap'
      },
      cloth: {
        trait: clothTrait,
        placeholder: 'placeholder_cloth'
      },
      back: {
        trait: traits.find(trait => trait.name === 'back'),
        placeholder: 'placeholder_back'
      },
      face: {
        trait: faceTrait,
        placeholder: 'placeholder_face'
      } 
    }

    const placeholder_test = scene.getMeshByName('placeholder_test')
    if (placeholder_test) placeholder_test.visibility = 0;

    const torso = scene.getNodeByName('torso') as Mesh
    if (torso) torso.scaling = new Vector3(0,0,0);

    for (const [key, { trait, placeholder }] of Object.entries(outfits)) {
      const outfitContainer = containers[key].instantiateModelsToScene((name) => name.split('_primitive')[0], false, { doNotInstantiate: true })
      const outfit = outfitContainer.rootNodes[0];

      const all = outfit.getChildMeshes();
      all.forEach(one => {
        if (!one.name.includes(trait?.flavour || '')) {
          one.visibility = 0;
        }
      })
      const placeholderNode = scene.getMeshByName(placeholder) as TransformNode
      outfit.parent = placeholderNode;      
    }
    
    const placeholder_weapon_idle_001 = scene.getAnimationGroupByName("placeholder_weapon_idle_001") as AnimationGroup
    placeholder_weapon_idle_001.start(true, 1)

    const lemon_idle_001 = scene.getAnimationGroupByName("lemon_idle_001") as AnimationGroup
    lemon_idle_001.start(true, 1)

    const placeholder_head_idle_001 = scene.getAnimationGroupByName("placeholder_head_idle_001") as AnimationGroup
    placeholder_head_idle_001.start(true, 1)
    
  }

}

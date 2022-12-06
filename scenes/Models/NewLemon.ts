import { Scene, SceneLoader, AnimationGroup, TransformNode, Vector3, Mesh } from "@babylonjs/core"
import type { SuiMoveObject } from "@mysten/sui.js";

export const NewLemon = async (scene: Scene, lemons: SuiMoveObject[]): Promise<void> => {
  const lastLemon = lemons[0];
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
        trait: clothTrait
        // trait: { name: 'cloth', flavour: lastLemon.fields.created % 2 == 1 ? 'Cloth_Bandolier_MA02' : 'Cloth_Ninja_Waistband_NA01' }
      },
      {
        model: 'BTLMN_Outfit_Back_A.glb',
        placeholder: 'placeholder_back',
        trait: traits.find(trait => trait.name === 'back')
      },
      {
        model: 'BTLMN_Outfit_Face_A.glb',
        placeholder: 'placeholder_face',
        trait: faceTrait
        //trait: { name: 'face', flavour: lastLemon.fields.created % 2 == 0 ? 'Face_VR_Helmet_VR01' : 'balakjflkdjg'}
      }
    ];

    const placeholder_test = scene.getMeshByName('placeholder_test')
    if (placeholder_test) placeholder_test.visibility = 0;

    const torso = scene.getNodeByName('torso') as Mesh
    if (torso) torso.scaling = new Vector3(0,0,0);

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
      const placeholder = scene.getMeshByName(outfit.placeholder) as TransformNode
      trait.parent = placeholder
      
    }
    
    const placeholder_weapon_idle_001 = scene.getAnimationGroupByName("placeholder_weapon_idle_001") as AnimationGroup
    placeholder_weapon_idle_001.start(true, 1)

    const lemon_idle_001 = scene.getAnimationGroupByName("lemon_idle_001") as AnimationGroup
    lemon_idle_001.start(true, 1)

    const placeholder_head_idle_001 = scene.getAnimationGroupByName("placeholder_head_idle_001") as AnimationGroup
    placeholder_head_idle_001.start(true, 1)
    
  }

}

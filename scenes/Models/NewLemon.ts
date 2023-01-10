import { Scene, SceneLoader, AnimationGroup, TransformNode, Vector3, Mesh, AssetContainer } from "@babylonjs/core"
import type { SuiMoveObject } from "@mysten/sui.js";

export const NewLemon = async (scene: Scene, lemons: SuiMoveObject[]): Promise<void> => {
  const containers: { [key: string]: AssetContainer } = {}

  if (lemons && lemons.length) {
    const models = {
      lemon: 'BTLMN_Lemon_A.glb',
      weapon: 'BTLMN_Outfit_Weapons_A.glb', 
      cap: 'BTLMN_Outfit_Cap_A.glb', 
      cloth: 'BTLMN_Outfit_Cloth_A.glb', 
      back: 'BTLMN_Outfit_Back_A.glb', 
      face: 'BTLMN_Outfit_Face_A.glb', 
      foot: 'BTLMN_Outfit_Shoes_A.glb'
    }
    for (const [key, link] of Object.entries(models)) {
      containers[key] = await SceneLoader.LoadAssetContainerAsync(
        "/glb/", link, scene
      )
    }

    lemons.slice(0, 3).forEach((suiLemon, index) => {
      [`Plus_${index + 1}`, `Plus_${index + 1}_Stroke`].forEach((mesh) => {
        const plus = scene.getMeshByName(mesh);
        if (plus) plus.dispose();
      })
      const lemonPosition = scene.getNodeByName(`LemonPos_${index + 1}`) as TransformNode
      let lemonContainer = containers.lemon.instantiateModelsToScene((name) => name.split('_primitive')[0], false, { doNotInstantiate: true })
      const lemon = lemonContainer.rootNodes[0];
      lemon.scaling = new Vector3(120,120,120);
      lemon.position.y = lemon.position.y + 10;
      lemon.parent = lemonPosition;
      lemon.rotation = lemonPosition.rotation;

      const outfits = getOutfits(suiLemon)
      console.log(outfits)

      Object.values(outfits).forEach(({ trait, type, placeholder }) => {
        containers[type].meshes.forEach(mesh => {
          if (!mesh.name.includes(trait!.flavour)) return;
          const placeholderNode = lemon.getChildTransformNodes().find(mesh => mesh.name == placeholder);
          if (placeholderNode) mesh.clone(type + index + 1, placeholderNode)
        })
      })

      lemonContainer.animationGroups.forEach(animationGroup => {
        if (['placeholder_master_idle_a', 'lemon_idle_a', 'placeholder_weapon_r_idle_a'].includes(animationGroup.name)) {
          animationGroup.start(true, 1)
        }
      });
      
    });
  }
}

function getOutfits(lemon: SuiMoveObject) {
  const traits: { flavour: string, name: string }[] = lemon.fields.traits.map((trait: Record<string, string>) => trait.fields)

  // const clothTrait = traits.find(trait => trait.name === 'cloth');
  // if (clothTrait?.flavour == 'Cloth_Poncho_CA01') {
  //   clothTrait.flavour = 'Cloth_Ninja_Waistband_NA01'
  // }
  
  // const faceTrait = traits.find(trait => trait.name === 'face');
  // if (faceTrait?.flavour == 'Face_Gas_Mask_MA01') {
  //   faceTrait.flavour = 'Face_Visor_VR_VR01'
  // }

  const outfits: { [key: string]: { trait: { flavour: string, name: string } | undefined, placeholder: string, type: string }} = {
    weapon: {
      trait: traits.find(trait => trait.name === 'weapon'),
      type: 'weapon',
      placeholder: 'placeholder_weapon_r'
    },
    cap: {
      trait: traits.find(trait => trait.name === 'cap'),
      type: 'cap',
      placeholder: 'placeholder_cap'
    },
    cloth: {
      trait: traits.find(trait => trait.name === 'cloth'),
      type: 'cloth',
      placeholder: 'placeholder_cloth'
    },
    back: {
      trait: traits.find(trait => trait.name === 'back'),
      type: 'back',
      placeholder: 'placeholder_back'
    },
    face: {
      trait: traits.find(trait => trait.name === 'face'),
      type: 'face',
      placeholder: 'placeholder_face'
    },
    foot_r: {
      trait: { flavour: "Shoe_Kicks_SA01_R", name: 'foot' },
      type: 'foot',
      placeholder: 'placeholder_foot_r'
    },
    foot_l: {
      trait: { flavour: "Shoe_Kicks_SA01_L", name: 'foot' },
      type: 'foot',
      placeholder: 'placeholder_foot_l'
    } 
  }

  return outfits;
}
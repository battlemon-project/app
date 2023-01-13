import { Scene, SceneLoader, AnimationGroup, TransformNode, Vector3, Mesh, AssetContainer } from "@babylonjs/core"
import type { SuiMoveObject } from "@mysten/sui.js";
import { traceDeprecation } from "process";

export const NewLemon = async (scene: Scene, lemons: SuiMoveObject[]): Promise<void> => {
  const containers: { [key: string]: AssetContainer } = {}

  if (lemons && lemons.length) {
    const models = {
      lemon: 'BTLMN_Lemon_A_parented.glb',
      weapon: 'BTLMN_Outfit_Weapons_A.glb', 
      cap: 'BTLMN_Outfit_Cap_A.glb', 
      cloth: 'BTLMN_Outfit_Cloth_A.glb', 
      back: 'BTLMN_Outfit_Back_A.glb', 
      face: 'BTLMN_Outfit_Face_A.glb', 
      shoes: 'BTLMN_Outfit_Shoes_A.glb'
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

      const basicTraits = getBasics(suiLemon)
      lemon.getChildMeshes().forEach(mesh => {
        if (!basicTraits.includes(mesh.name) && !mesh.name.includes('placeholder')) {
          mesh.dispose();
        }
      })

      lemon.scaling = new Vector3(120,120,120);
      lemon.position.y = lemon.position.y + 10;
      lemon.parent = lemonPosition;
      lemon.rotation = lemonPosition.rotation;

      const outfits = getOutfits(suiLemon)

      Object.values(outfits).forEach(({ trait, type, placeholder }) => {
        if (type == 'lemon') {
          console.log(containers[type])
        }
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

interface Trait {
  flavour: string
  name: string
}


function getBasics(lemon: SuiMoveObject): string[] {
  const traits: { flavour: string, name: string }[] = lemon.fields.traits.map((trait: Record<string, string>) => trait.fields)
  const basics = traits.filter(trait => ['eyes', 'teeth', 'exo', 'head'].includes(trait.name)).map(trait => trait.flavour)
  return basics;
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

  const shoesTrait = traits.find(trait => trait.name === 'shoes')
  let shoe_r = {...shoesTrait} as Trait;
  let shoe_l = {...shoesTrait} as Trait;
  if (shoesTrait?.flavour) {
    shoe_r.flavour += '_R';
    shoe_l.flavour += '_L';
  }

  const outfits: { [key: string]: { trait: Trait | undefined, placeholder: string, type: string }} = {
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
    shoe_r: {
      trait: shoe_r,
      type: 'shoes',
      placeholder: 'placeholder_shoes_r'
    },
    shoe_l: {
      trait: shoe_l,
      type: 'shoes',
      placeholder: 'placeholder_shoes_l'
    } 
  }

  return outfits;
}
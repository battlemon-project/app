import {
  type InstantiatedEntries,
  type Mesh,
  type Scene,
  SceneLoader,
  type TransformNode,
  Vector3,
} from '@babylonjs/core';
import { type ItemType, useLemonStore } from '../../helpers/lemonStore';
import { ITEMS_TYPE_PLACEHOLDERS } from '../../helpers/dummyLemon';
import type { LemonOwnedNft } from '../../helpers/alchemy';

export interface LemonGeneratorResult {
  unsubscribe: () => void;
  change: (lemon: LemonOwnedNft) => void;
}

export const LemonGenerator = async (
  scene: Scene
): Promise<LemonGeneratorResult> => {
  const { lemons } = useLemonStore.getState();
  const loadedItems: Record<string, Mesh | null> = {};
  let lemonContainer: InstantiatedEntries;

  if (lemons.ownedNfts.length) {
    const lemonAssetContainer = await SceneLoader.LoadAssetContainerAsync(
      `${process.env.NEXT_PUBLIC_MODELS}/characters/`,
      'BTLMN_Lemon.gltf',
      scene
    );
    lemons.ownedNfts.slice(0, 3).forEach((lemon, index) => {
      [`Plus_${index + 1}`, `Plus_${index + 1}_Stroke`].forEach((mesh) => {
        const plus = scene.getMeshByName(mesh);
        if (plus) plus.dispose();
      });
      const lemonPlacement = scene.getNodeByName(
        `LemonPos_${index + 1}`
      ) as TransformNode;
      lemonContainer = lemonAssetContainer.instantiateModelsToScene(
        (name) => name.split('_primitive')[0],
        false,
        { doNotInstantiate: true }
      );
      const lemonNode = lemonContainer.rootNodes[0];
      lemonNode.id = `Lemon__${index + 1}`;

      const properities = lemon.rawMetadata.properties.map(
        (trait) => trait.name
      );
      lemonNode.getChildMeshes().forEach((mesh) => {
        if (
          !properities.includes(mesh.name) &&
          !mesh.name.includes('placeholder') &&
          !mesh.name.includes('Body')
        ) {
          mesh.visibility = 0;
        } else if (mesh.name.includes('Feet')) {
          mesh.id = `Feet_${index + 1}`;
        } else if (mesh.name.includes('Hair')) {
          mesh.id = `Hair_${index + 1}`;
        }
        if (mesh.name.includes('placeholder')) {
          mesh.id = `${mesh.name}_${index + 1}`;
          mesh.scaling = new Vector3(0, 0, 0);
        }
        if (mesh.name.includes('Body')) {
          mesh.subMeshes.forEach((sub) => {
            sub.dispose();
          });
        }
      });

      lemon.rawMetadata.items.forEach(async (item) => {
        await wearItem(item, index + 1);
      });

      const idleAnimation = lemonContainer.animationGroups.find(
        (animation) => animation.name == 'Idle'
      );

      if (lemonPlacement) {
        lemonNode.scaling = new Vector3(120, 120, 120);
        lemonNode.parent = lemonPlacement;
        lemonNode.rotation = lemonPlacement.rotation;
        idleAnimation?.start(true, 1);
      } else {
        lemonNode.scaling = new Vector3(-120, 120, 120);
        idleAnimation?.start(false, 10000);
      }
    });
  }

  async function loadItem(name: string | undefined) {
    if (!name || name.length < 6) return;
    if (loadedItems[name]) return loadedItems[name];
    const result = await SceneLoader.LoadAssetContainerAsync(
      `${process.env.NEXT_PUBLIC_MODELS}/items/`,
      `${name}.gltf`,
      scene
    );
    loadedItems[name] = result.meshes[0] as Mesh;
    return loadedItems[name];
  }

  function takeoffItem(itemType: string, activePlatform: number) {
    const placeholderName = ITEMS_TYPE_PLACEHOLDERS[itemType || ''];
    if (itemType == 'shoes') {
      const basicFeet = scene.getNodeById(`Feet_${activePlatform}`) as Mesh;
      if (basicFeet) basicFeet.scaling = new Vector3(1, 1, 1);
      const placeholderL = scene.getNodeById(
        `placeholder_shoes_r_${activePlatform}`
      ) as Mesh;
      const placeholderR = scene.getNodeById(
        `placeholder_shoes_l_${activePlatform}`
      ) as Mesh;
      placeholderL.scaling = new Vector3(0, 0, 0);
      placeholderR.scaling = new Vector3(0, 0, 0);
      [...placeholderL.getChildren(), ...placeholderR.getChildren()].forEach(
        (mesh) => {
          mesh.dispose();
        }
      );
    } else {
      const placeholder = scene.getNodeById(
        `${placeholderName}_${activePlatform}`
      ) as Mesh;
      placeholder.scaling = new Vector3(0, 0, 0);
      placeholder.getChildren().forEach((mesh) => {
        mesh.dispose();
      });
    }
  }

  async function wearItem(item: ItemType, activePlatform: number) {
    const placeholderName = ITEMS_TYPE_PLACEHOLDERS[item.type || ''];
    const { type, name } = item;
    if (!name || name.length < 6) {
      if (item.type == 'cap') {
        const basicHair = scene.getNodeById(`Hair_${activePlatform}`) as Mesh;
        if (basicHair) {
          basicHair.scaling = new Vector3(1, 1, 1);
          // basicHair.visibility = 1;
        }
      }
      if (item.type == 'shoes') {
        const basicFeet = scene.getNodeById(`Feet_${activePlatform}`) as Mesh;
        if (basicFeet) {
          basicFeet.scaling = new Vector3(1, 1, 1);
          // basicFeet.visibility = 1;
        }
      }
      return;
    }
    if (item.type == 'shoes') {
      const placeholderL = scene.getNodeById(
        `placeholder_shoes_r_${activePlatform}`
      ) as Mesh;
      const placeholderR = scene.getNodeById(
        `placeholder_shoes_l_${activePlatform}`
      ) as Mesh;
      await attachMesh(name + '_L', type, placeholderL, activePlatform);
      await attachMesh(name + '_R', type, placeholderR, activePlatform);
    } else {
      const placeholder = scene.getNodeById(
        `${placeholderName}_${activePlatform}`
      ) as Mesh;
      await attachMesh(name, type, placeholder, activePlatform);
    }
  }

  async function attachMesh(
    name: string | null,
    type: string,
    placeholder: Mesh,
    activePlatform: number
  ): Promise<void> {
    // placeholder?.getChildren().forEach(mesh => {
    //   placeholder.scaling = new Vector3(0,0,0);
    //   mesh.dispose();
    // })

    if (!name) return;
    placeholder.scaling = new Vector3(1, 1, 1);
    const meshOutfit = await loadItem(name);
    if (type == 'cap') {
      const basicHair = scene.getNodeById(`Hair_${activePlatform}`) as Mesh;
      if (basicHair) basicHair.scaling = new Vector3(0, 0, 0);
    }
    if (type == 'shoes') {
      const basicFeet = scene.getNodeById(`Feet_${activePlatform}`) as Mesh;
      if (basicFeet) basicFeet.scaling = new Vector3(0, 0, 0);
    }
    if (meshOutfit) meshOutfit.clone(`outift_${type}`, placeholder);
  }

  const change = async (lemon: LemonOwnedNft) => {
    const lemonNode = scene.getNodeById('Lemon__1');
    const properities = lemon.rawMetadata.properties.map((prop) => prop.name);
    if (lemonNode)
      lemonNode.getChildMeshes().forEach((mesh) => {
        if (properities.includes(mesh.name)) {
          mesh.visibility = 1;
        } else {
          mesh.visibility = 0;
        }
        if (
          mesh.name.includes('Feet') &&
          lemon.rawMetadata.items.find(
            (item) => item.type == 'shoes' && item.name && item.name.length > 5
          )
        ) {
          mesh.visibility = 0;
        }
        if (
          mesh.name.includes('Hair') &&
          lemon.rawMetadata.items.find(
            (item) => item.type == 'cap' && item.name && item.name.length > 5
          )
        ) {
          mesh.visibility = 0;
        }
      });

    Object.keys(ITEMS_TYPE_PLACEHOLDERS).forEach((itemType) => {
      takeoffItem(itemType, 1);
    });

    for (const item of lemon.rawMetadata.items) {
      await wearItem(item, 1);
    }
  };

  const unsubscribe = useLemonStore.subscribe((state, prevState) => {
    if (state.unwearingItem != prevState.unwearingItem) {
      Object.keys(ITEMS_TYPE_PLACEHOLDERS).forEach((itemType) => {
        takeoffItem(itemType, state.activePlatform);
      });

      const items = state.lemons.ownedNfts[
        state.activePlatform - 1
      ].rawMetadata.items.filter((item) => {
        return !state.unwearingItem || item.type != state.unwearingItem.type;
      });

      items.forEach((item) => {
        wearItem(item, state.activePlatform);
      });
    }
    if (state.wearingItem != prevState.wearingItem) {
      Object.keys(ITEMS_TYPE_PLACEHOLDERS).forEach((itemType) => {
        takeoffItem(itemType, state.activePlatform);
      });

      const items = state.lemons.ownedNfts[
        state.activePlatform - 1
      ].rawMetadata.items.filter((item) => {
        return !state.wearingItem || item.type != state.wearingItem.type;
      });
      if (state.wearingItem) items.push(state.wearingItem);

      items.forEach((item) => {
        wearItem(item, state.activePlatform);
      });

      // if (state.wearingItem) {
      //   wearItem(state.wearingItem, state.activePlatform)
      // } else {
      // }
    }
  });

  return {
    unsubscribe,
    change,
  };
};

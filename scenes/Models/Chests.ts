import { type Scene, SceneLoader, Vector3 } from '@babylonjs/core';
import type { NextRouter } from 'next/router';

export const Chests = async (
  scene: Scene
): Promise<void> => {
  const chests = [
    {
      sceneFileName: 'basket_a.gltf',
      position: new Vector3(-2, 0, 0),
    },
    {
      sceneFileName: 'basket_b.gltf',
      position: new Vector3(0, 0, 0),
    },
    {
      sceneFileName: 'basket_c.gltf',
      position: new Vector3(2, 0, 0),
    },
  ];

  chests.map(async (chest) => {
    const c = await SceneLoader.ImportMeshAsync(
      '',
      `${process.env.NEXT_PUBLIC_MODELS}/treasure/`,
      chest.sceneFileName,
      scene
    );
    const rootNode = c.meshes[0];
    rootNode.rotate(new Vector3(0, 200, 0), 1);
    rootNode.position = chest.position;
  });
};

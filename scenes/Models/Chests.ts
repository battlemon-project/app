import { type Scene, SceneLoader, Vector3, ActionManager, Animation, ExecuteCodeAction, AbstractMesh, TransformNode } from '@babylonjs/core';

export const Chests = async (
  scene: Scene
): Promise<void> => {
  const chests = [
    {
      sceneFileName: 'basket_a.gltf',
      name: 'basket_a_bottom',
      position: new Vector3(-2, 0, 0),
    },
    {
      sceneFileName: 'basket_b.gltf',
      name: 'basket_b_bottom',
      position: new Vector3(0, 0, 0),
    },
    {
      sceneFileName: 'basket_c.gltf',
      name: 'basket_c',
      position: new Vector3(2, 0, 0),
    },
  ];

  await chests.map(async (chest) => {
    const c = await SceneLoader.ImportMeshAsync(
      '',
      `${process.env.NEXT_PUBLIC_MODELS}/treasure/`,
      chest.sceneFileName,
      scene
    );
    const rootNode = c.meshes[0];
    rootNode.rotate(new Vector3(0, 200, 0), 1);
    rootNode.position = chest.position;

    const basket = scene.getNodeById(chest.name) as TransformNode;
    console.log(basket.animations)
  });

};

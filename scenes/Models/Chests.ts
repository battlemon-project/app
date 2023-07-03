import {
  type Scene,
  SceneLoader,
  Vector3,
  TransformNode,
  AnimationGroup
} from '@babylonjs/core';

export const Chests = async (scene: Scene): Promise<void> => {
  const chests = [
    {
      sceneFileName: 'basket_a.gltf',
      name: 'basket_a',
      animationName: 'open_a',
      position: new Vector3(-2, 0, 0),
    },
    {
      sceneFileName: 'basket_b.gltf',
      name: 'basket_b',
      animationName: 'open_b',
      position: new Vector3(0, 0, 0),
    },
    {
      sceneFileName: 'basket_c.gltf',
      name: 'basket_c',
      animationName: 'open_c',
      position: new Vector3(2, 0, 0),
    },
  ];


  for (const chest of chests) {
    const c = await SceneLoader.ImportMeshAsync(
      '',
      `${process.env.NEXT_PUBLIC_MODELS}/treasure/`,
      chest.sceneFileName,
      scene
    );
    const rootNode = c.meshes[0];
    rootNode.rotate(new Vector3(0, 200, 0), 1);
    rootNode.position = chest.position;
  }

  chests.forEach(chest => {
    const openAnimation = scene.getAnimationGroupByName(chest.animationName) as AnimationGroup;
    openAnimation.start(false, 1);
  });

};

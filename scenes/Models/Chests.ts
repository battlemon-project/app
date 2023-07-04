import {
  type Scene,
  SceneLoader,
  Vector3,
  TransformNode,
  AnimationGroup,
  Animation,
  AbstractMesh,
} from '@babylonjs/core';
import { useChests } from '../../hooks/useChests';

interface ChestData {
  sceneFileName: string;
  name: string;
  functionName: string;
  animationName: string;
  position: Vector3;
  node?: AbstractMesh;
}

export const Chests = async (scene: Scene): Promise<void> => {
  const chests: ChestData[] = [
    {
      sceneFileName: 'basket_a.gltf',
      name: 'basket_a',
      functionName: 'openA',
      animationName: 'open_a',
      position: new Vector3(-2.2, 0, 0),
    },
    {
      sceneFileName: 'basket_b.gltf',
      name: 'basket_b',
      functionName: 'openB',
      animationName: 'open_b',
      position: new Vector3(0, 0, 0),
    },
    {
      sceneFileName: 'basket_c.gltf',
      name: 'basket_c',
      functionName: 'openC',
      animationName: 'open_c',
      position: new Vector3(2.2, 0, 0),
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
    chest.node = rootNode;
  }

  chests.forEach((chest, i) => {
    useChests.setState({
      [chest.functionName + 'Start']: () => {
        Animation.CreateAndStartAnimation(
          `Chest_scale`,
          chest.node,
          'scaling',
          30,
          30,
          new Vector3(1, 1, 1),
          new Vector3(1.3, 1.3, 1.3),
          0
        );
        if (chest.node) chest.node.position = new Vector3(0, -0.8, 0);
        chests.forEach((_ch, index) => {
          if (index !== i && _ch.node) {
            _ch.node.scaling = new Vector3(0, 0, 0);
          }
        });
      },
      [chest.functionName]: () => {
        const openAnimation = scene.getAnimationGroupByName(
          chest.animationName
        ) as AnimationGroup;
        openAnimation.start(false, 1);
      },
    });
  });
};

import {
  ActionManager,
  Animation,
  type AnimationGroup,
  type AssetContainer,
  ExecuteCodeAction,
  type Scene,
  SceneLoader,
  type TransformNode,
  Vector3,
} from '@babylonjs/core';
import { type Dispatch, type SetStateAction } from 'react';
import { useLemonStore } from '../../helpers/lemonStore';

interface PlatformType {
  destroy: () => void;
  back: () => void;
}

interface PlatformParams {
  scene: Scene;
  canvas: HTMLCanvasElement;
  mintEvent: () => Promise<void>;
  changeStep: Dispatch<SetStateAction<number>>;
}

export const Platforms = async ({
  scene,
  canvas,
  mintEvent,
  changeStep,
}: PlatformParams): Promise<PlatformType> => {
  const containers: Record<string, AssetContainer> = {};
  let step = 0;
  let activePlatform: number = 1;
  const direction = [
    { forward: 3, backward: 2 },
    { forward: 1, backward: 3 },
    { forward: 2, backward: 1 },
  ];

  const models = {
    platforms: 'BTLMN_LemonPlatforms.glb',
    dots: 'BTLMN_LemonIcons.glb',
  };

  for (const [key, link] of Object.entries(models)) {
    containers[key] = await SceneLoader.LoadAssetContainerAsync(
      `${process.env.NEXT_PUBLIC_STATIC}/glb/`,
      link,
      scene
    );
  }

  containers.platforms.addAllToScene();
  const ring = scene.getMeshByName('ring');
  if (ring) {
    ring.visibility = 0;
  }
  // containers.dots.addAllToScene()

  // const ringScene = await Ring(scene)

  // const dots = scene.getTransformNodeByName('icons')
  // if (dots) {
  //   dots.position.y = dots.position.y + 10;

  //   dots.getChildMeshes().forEach(mesh => {
  //     mesh.renderingGroupId = 2;
  //   })
  //   dots.scaling = new Vector3(0,0,0);
  // }
  // const dotsMeshes = dots?.getChildMeshes() || [];

  let originalRotationAngle = 0;

  const Camera = scene.getCameraByName('Camera');
  if (Camera) {
    scene.activeCamera = Camera;
  }

  const operator = scene.getMeshByName('operator');
  if (operator) operator.visibility = 0;
  const target = scene.getMeshByName('target');
  if (target) target.visibility = 0;
  const showPosfeature = scene.getMeshByName('showPosfeature');
  if (showPosfeature) showPosfeature.visibility = 0;
  const showPosOutfit = scene.getMeshByName('showPosOutfit');
  if (showPosOutfit) showPosOutfit.visibility = 0;

  // const platforms = models.meshes[0]
  // platforms.position.y = -100;

  const lookatObjects: string[] = ['LemonPos_1', 'LemonPos_2', 'LemonPos_3'];
  const lemonPositions: TransformNode[] = lookatObjects.map((pos) => {
    return scene.getNodeByName(pos) as TransformNode;
  });

  lemonPositions.forEach((position, index) => {
    position.rotate(new Vector3(0, 1, 0), Math.PI); // This is becouse new lemon rotated by default
    const plus = scene.getMeshByName(`Plus_${index + 1}`);
    const plusStroke = scene.getMeshByName(`Plus_${index + 1}_Stroke`);
    if (plus) {
      plus.rotation = position.rotation;
    }
    if (plusStroke) {
      plusStroke.rotation = position.rotation;
      plusStroke.visibility = 0;
    }
    position.rotate(new Vector3(0, 1, 0), (Math.PI + Math.PI / 3) * index);
  });

  const objects: string[] = [
    'Plus_Back',
    'Plus_Cap',
    'Plus_Cloth',
    'Plus_Face',
    'Plus_Back_Stroke',
    'Plus_Cap_Stroke',
    'Plus_Cloth_Stroke',
    'Plus_Face_Stroke',
    'Line_Back_1',
    'Line_Back_2',
    'Line_Cap_1',
    'Line_Cap_2',
    'Line_Cloth_1',
    'Line_Cloth_2',
    'Line_Face_1',
    'Line_Face_2',
    'Point_Back',
    'Point_Cap',
    'Point_Cloth',
    'Point_Face',
    'Background_Sphere',
  ];

  const unusedObjects: string[] = [
    'Point_Weapon',
    'Plus_Weapon',
    'Plus_Weapon_Stroke',
    'Line_Weapon_1',
    'Line_Weapon_2',
  ];

  [...objects, ...unusedObjects].forEach((name) => {
    const object = scene.getMeshByName(name);
    if (!object) return;
    object.visibility = 0;
    object.checkCollisions = false;
    object.isPickable = false;
  });

  ['collider1', 'collider2', 'collider3'].forEach((name, index) => {
    const collider = scene.getMeshByName(name);
    if (!collider) return;
    collider.actionManager = new ActionManager(scene);
    collider.visibility = 0;

    let stroke = scene.getMeshByName(`Plus_${index + 1}_Stroke`);
    collider.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnPointerOverTrigger,
        async function () {
          if (stroke) stroke.visibility = 1;
          scene.hoverCursor = 'pointer';
        }
      )
    );
    collider.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnPointerOutTrigger,
        async function () {
          if (stroke) stroke.visibility = 0;
          scene.hoverCursor = 'default';
        }
      )
    );

    collider.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, async function () {
        let rotationAngle = 0;
        let platformAnimation: AnimationGroup | null = null;

        stroke = scene.getMeshByName(`Plus_${index + 1}_Stroke`); // refresh stroke
        if (stroke) {
          await mintEvent();
          return;
        }

        if (activePlatform == direction[index].forward) {
          platformAnimation = scene.getAnimationGroupByName(
            'Forward' + direction[index].forward
          ) as AnimationGroup;
          rotationAngle = (2 * Math.PI) / 3;
        } else if (activePlatform == direction[index].backward) {
          platformAnimation = scene.getAnimationGroupByName(
            'Backward' + direction[index].backward
          ) as AnimationGroup;
          rotationAngle = (-2 * Math.PI) / 3;
        }

        if (platformAnimation) {
          platformAnimation.start(false, 1);
        } else {
          if (step != 1) {
            const operatorFocusLemonF = scene.getAnimationGroupByName(
              'operator_FocusLemon_f'
            );
            operatorFocusLemonF?.start(false, 1);
            useLemonStore.setState({ inventoryIsOpened: true });
            lemonPositions.forEach((position, index) => {
              if (activePlatform != index + 1) {
                Animation.CreateAndStartAnimation(
                  `Lemon_scale`,
                  position,
                  'scaling',
                  60,
                  80,
                  new Vector3(1, 1, 1),
                  new Vector3(0, 0, 0),
                  0
                );
              }
            });
            changeStep(1);
            step = 1;
          }
          return;
        }

        lemonPositions.forEach((position, index) => {
          if (activePlatform == index + 1) {
            position.rotate(new Vector3(0, 1, 0), originalRotationAngle);
            originalRotationAngle = 0;
          }
          Animation.CreateAndStartAnimation(
            `Lemon_rotation`,
            position,
            'rotation.y',
            60,
            25,
            position.rotation.y,
            position.rotation.y + rotationAngle,
            0
          );
        });

        activePlatform = index + 1;
        useLemonStore.setState({ activePlatform });
      })
    );
  });

  const currentPosition = { x: 0, y: 0 };
  let clicked = false;

  function pointerDown(evt: MouseEvent) {
    currentPosition.x = evt.clientX;
    clicked = true;
  }

  function pointerUp() {
    clicked = false;
  }

  function pointerMove(evt: MouseEvent) {
    if (!clicked) {
      return;
    }

    const dx = evt.clientX - currentPosition.x;
    const angleY = dx * 0.01;
    lemonPositions[activePlatform - 1].rotate(new Vector3(0, 1, 0), angleY);
    // dotsMeshes.forEach(mesh => mesh.rotate(new Vector3(0,1,0), -1*angleY))
    originalRotationAngle -= angleY;
    currentPosition.x = evt.clientX;
  }

  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointermove', pointerMove);

  return {
    back: () => {
      const operatorFocusLemonB = scene.getAnimationGroupByName(
        'operator_FocusLemon_b'
      );
      operatorFocusLemonB?.start(false, 1);
      lemonPositions.forEach((position, index) => {
        if (activePlatform != index + 1) {
          Animation.CreateAndStartAnimation(
            `Lemon_scale`,
            position,
            'scaling',
            60,
            60,
            new Vector3(0, 0, 0),
            new Vector3(1, 1, 1),
            0
          );
        }
      });
      step = 0;
      useLemonStore.setState({ wearingItem: undefined });
    },
    destroy: () => {
      canvas.removeEventListener('pointerdown', pointerDown, false);
      canvas.removeEventListener('pointerup', pointerUp, false);
      canvas.removeEventListener('pointermove', pointerMove, false);
    },
  };
};

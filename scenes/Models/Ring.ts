import {
  ActionManager,
  Animation,
  ExecuteCodeAction,
  type Scene,
  SceneLoader,
  Vector3,
} from '@babylonjs/core';

export const originalIcons = (): Array<{ order: number; name: string }> => [
  { order: -2, name: 'icon_rent' },
  { order: -1, name: 'icon_sell' },
  { order: 0, name: 'icon_play' },
  { order: 1, name: 'icon_send' },
  { order: 2, name: 'icon_change' },
];

interface RingType {
  reset: () => void;
}

export const Ring = async (scene: Scene): Promise<RingType> => {
  let icons = originalIcons();

  const container = await SceneLoader.ImportMeshAsync(
    '',
    `${process.env.NEXT_PUBLIC_STATIC}/glb/`,
    'BTLMN_InterfaceRing.glb',
    scene
  );

  container.meshes.forEach((mesh, index) => {
    if (index == 0) return;
    if (mesh.name.includes('socket')) {
      mesh.visibility = 0;
    }
  });

  const ring = scene.getMeshByName('ring');
  const ringMain = scene.getMeshByName('ring_main');
  const ringRotator = scene.getMeshByName('ringRotator');
  const ringBack = scene.getMeshByName('ringBack');
  const ringArrowUp = scene.getMeshByName('ringArrowUp');
  const ringArrowDown = scene.getMeshByName('ringArrowDown');

  const setActiveIcon = (initial?: boolean) => {
    const iconBackA = scene.getTransformNodeByName('iconBackA');
    const iconBackB = scene.getTransformNodeByName('iconBackB');
    for (const { order, name } of icons) {
      const icon = scene.getMeshByName(name);
      const degree = '00' + ((360 + order * 10) % 360);
      const socket = scene.getMeshByName(`socket_${degree.slice(-3)}`);
      const iconBackground = iconBackA?.clone('a', icon);

      if (icon && socket) {
        if (order == 0) {
          iconBackground?.dispose();
          iconBackB?.clone('b', icon);
          icon.scaling = new Vector3(1.3, 1.3, 1.3);
        } else {
          iconBackground?.dispose();
          iconBackA?.clone('a', icon);
          icon.scaling = new Vector3(1, 1, 1);
        }
        if (initial) {
          icon.parent = socket;
          icon.rotate(new Vector3(0, 1, 0), -Math.PI / 6);
        }
      }
    }
  };

  if (ringMain && ring && ringRotator && ringBack) {
    ring.scaling = new Vector3(0, 0, 0);
    // ring.rotate(new Vector3(1,0,0), Math.PI)
    ring.visibility = 0;
    // ringBack.visibility = 0
    ringRotator.visibility = 0;
    ringMain.visibility = 0;
    ringMain.parent = ring;
    ringMain.rotation = ring.rotation;
    ringRotator.rotation = ring.rotation;
    ringBack.rotation = ring.rotation;
    // if (ringArrowUp && ringArrowDown) {
    //   ringArrowUp.rotation = ring.rotation
    //   ringArrowDown.rotation = ring.rotation
    // }
    ringMain.scaling = new Vector3(100, 100, 100);

    setActiveIcon(true);
  }

  if (ringRotator && ringArrowUp) {
    // ringArrowUp.visibility = 0;
    ringArrowUp.actionManager = new ActionManager(scene);

    ringArrowUp.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, async function () {
        const canRotate = icons.find((icon) => icon.order < 0);
        if (!canRotate) return;

        Animation.CreateAndStartAnimation(
          `Ring_rotation`,
          ringRotator,
          'rotation.x',
          60,
          5,
          ringRotator.rotation.x,
          ringRotator.rotation.x + Math.PI / 18,
          0
        );

        icons.forEach((icon) => {
          icon.order += 1;
        });
        setActiveIcon();
      })
    );
  }
  if (ringRotator && ringArrowDown) {
    // ringArrowDown.visibility = 0;
    ringArrowDown.actionManager = new ActionManager(scene);

    ringArrowDown.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, async function () {
        const canRotate = icons.find((icon) => icon.order > 0);
        if (!canRotate) return;

        Animation.CreateAndStartAnimation(
          `Ring_rotation`,
          ringRotator,
          'rotation.x',
          60,
          5,
          ringRotator.rotation.x,
          ringRotator.rotation.x - Math.PI / 18,
          0
        );

        icons.forEach((icon) => {
          icon.order -= 1;
        });
        setActiveIcon();
      })
    );
  }

  return {
    reset: () => {
      icons = originalIcons();
      setActiveIcon();
    },
  };
};

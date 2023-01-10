import { Scene, SceneLoader, ActionManager, ExecuteCodeAction, TransformNode, Vector3, Animation } from "@babylonjs/core"

const originalIcons = (): { order: number, name: string }[] => ([
  { order: -2, name: 'icon_rent'},
  { order: -1, name: 'icon_sell'},
  { order: 0, name: 'icon_play'},
  { order: 1, name: 'icon_send'},
  { order: 2, name: 'icon_change'},
])

interface RingType {
  reset: () => void
}

export const Ring = async (scene: Scene): Promise<RingType> => {
  
  let icons = originalIcons()

  const container = await SceneLoader.ImportMeshAsync(
    "",
    "/glb/",
    "BTLMN_InterfaceRing.glb",
    scene
  );
  
  container.meshes.forEach((mesh, index) => {
    if (index == 0) return;
    if (mesh.name.includes('socket')) {
      mesh.visibility = 0;
    }
  })

  const ring = scene.getMeshByName('ring')
  const ring_main = scene.getMeshByName('ring_main')
  const ring_rotator = scene.getMeshByName('ring_rotator')
  const ring_back = scene.getMeshByName('ring_back')

  const setActiveIcon = (initial?: boolean) => {
    const icon_back_a =  scene.getTransformNodeByName('icon_back_a')
    const icon_back_b =  scene.getTransformNodeByName('icon_back_b')
    for (let {order, name} of icons) {
      const icon = scene.getMeshByName(name)
      const degree = '00' + ((360 + order*10) % 360)
      const socket = scene.getMeshByName(`socket_${degree.slice(-3)}`)
      const iconBackground = icon_back_a?.clone('a', icon)
      
      if (icon && socket) {
        if (order == 0) {
          iconBackground?.dispose()
          icon_back_b?.clone('b', icon)
          icon.scaling = new Vector3(1.3,1.3,1.3);
        } else {
          iconBackground?.dispose()
          icon_back_a?.clone('a', icon)
          icon.scaling = new Vector3(1,1,1);
        }
        if (initial) {
          icon.parent = socket
          icon.rotate(new Vector3(0,1,0), -Math.PI/6)
        }
      }
    }    
  }

  if (ring_main && ring && ring_rotator && ring_back) {
    ring.scaling = new Vector3(0,0,0)
    //ring.rotate(new Vector3(1,0,0), Math.PI)
    ring.visibility = 0
    //ring_back.visibility = 0
    ring_rotator.visibility = 0
    ring_main.visibility = 0
    ring_main.parent = ring
    ring_main.rotation = ring.rotation
    ring_rotator.rotation = ring.rotation
    ring_main.scaling = new Vector3(100,100,100);

    setActiveIcon(true)
  }

  const ring_arrow_up = scene.getMeshByName('ring_arrow_up')
  const ring_arrow_down = scene.getMeshByName('ring_arrow_down')
  if (ring_rotator && ring_arrow_up) {
    ring_arrow_up.visibility = 0;
    ring_arrow_up.actionManager = new ActionManager(scene);

    ring_arrow_up.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, async function(){
      const canRotate = icons.find(icon => icon.order < 0)
      if (!canRotate) return;

      Animation.CreateAndStartAnimation(`Ring_rotation`, ring_rotator, "rotation.x", 60, 5, ring_rotator.rotation.x, ring_rotator.rotation.x + Math.PI/18, 0)

      icons.forEach(icon => {
        icon.order += 1;
      })
      setActiveIcon()
    }));

  }
  if (ring_rotator && ring_arrow_down) {
    ring_arrow_down.visibility = 0;
    ring_arrow_down.actionManager = new ActionManager(scene);

    ring_arrow_down.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, async function(){
      const canRotate = icons.find(icon => icon.order > 0)
      if (!canRotate) return;

      Animation.CreateAndStartAnimation(`Ring_rotation`, ring_rotator, "rotation.x", 60, 5, ring_rotator.rotation.x, ring_rotator.rotation.x - Math.PI/18, 0)

      icons.forEach(icon => {
        icon.order -= 1;
      })
      setActiveIcon()
    }));    
  }

  return ({
    reset: () => {
      icons = originalIcons()
      setActiveIcon()
    }
  })
}

import { Scene, SceneLoader, TransformNode, Vector3 } from "@babylonjs/core"

const icons = {
  '320': 'icon_puton',
  '330': 'icon_stake',
  '340': 'icon_rent',
  '350': 'icon_sell',
  '000': 'icon_play',
  '010': 'icon_change',
  '020': 'icon_craft',
  '030': 'icon_send',
  '040': 'icon_takeoff'
}

export const Ring = async (scene: Scene): Promise<void> => {
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
  if (ring_main && ring && ring_rotator && ring_back) {
    ring.scaling = new Vector3(0,0,0)
    //ring.rotate(new Vector3(1,0,0), Math.PI)
    ring.visibility = 0
    ring_back.visibility = 0
    ring_rotator.visibility = 0
    ring_main.visibility = 0
    ring_main.parent = ring
    ring_main.rotation = ring.rotation
    ring_main.scaling = new Vector3(100,100,100);

    for (let [degree, name] of Object.entries(icons)) {
      const icon = scene.getTransformNodeByName(name)
      const socket = scene.getMeshByName(`socket_${degree}`)
      
      if (icon && socket) {
        socket.visibility = 1;
        if (degree == '000') {
          icon.scaling = new Vector3(1.4,1.4,1.4);
        }
        icon.parent = socket
        icon.rotate(new Vector3(0,1,0), -Math.PI/6)
      }
    }


    
  }
}

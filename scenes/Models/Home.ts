import { Scene, SceneLoader } from "@babylonjs/core"
import clientLink from '../../helpers/links'
import type { NextRouter } from 'next/router'

export const Home = async (scene: Scene, router: NextRouter): Promise<void> => {
  await SceneLoader.ImportMeshAsync(
    "",
    "/glb/",
    "MainMenu_Stripes_Export.glb",
    scene
  );

  const buildingStrokes: { [key: string]: { stroke: string[], page?: string } } = {
    factory: {
      stroke: ['factory_stroke'],
    },
    craft: {
      stroke: ['craft_stroke', 'craft_manipulator_stroke', 'craft_manipulator7_stroke', 'craft_manipulator8_stroke']
    },
    stake: {
      stroke: ['stake_stroke', 'stake_coin_stroke']
    },
    shop: {
      stroke: ['shop_stroke', 'windmill_stroke_01', 'windmill_stroke_02']
    },
    arena: {
      stroke: ['arena_stroke', 'arena_rotator_a_stroke'],
      page: '/hub'
    },
    download: {
      stroke: ['download_client_car_stroke', 'download_client_car_adv_stroke'],
      page: clientLink()
    },
    lemterprise: {
      stroke: ['lemterprise_stroke']
    },
    engines: {
      stroke: ['engines_stroke']
    }
  }

  Object.values(buildingStrokes).map(val => val.stroke).flat().forEach(_stroke => {
    const stroke = scene.getMeshByName(_stroke);
    if (stroke) stroke.visibility = 0;
  })

  let selectedBuilding: string = '';

  scene.onPointerMove = function(evt) {
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult && pickResult.hit && pickResult.pickedMesh) {
      const meshPrefix = pickResult.pickedMesh.name.split('_')[0];
      if (selectedBuilding !== meshPrefix) {
        const buildings = buildingStrokes[meshPrefix]
        if (buildings) {
          document.body.style.cursor = "pointer";
          buildings.stroke.forEach(building => {
            const newStrokeBuilding = scene.getMeshByName(building)
            if (newStrokeBuilding) newStrokeBuilding.visibility = 1;
          })
        }
        if (selectedBuilding) {
          const oldStrokeBuildings = buildingStrokes[selectedBuilding]
          if (oldStrokeBuildings) {
            document.body.style.cursor = "default";
            oldStrokeBuildings.stroke.forEach(building => {
              const oldStrokeBuilding = scene.getMeshByName(building)
              if (oldStrokeBuilding) oldStrokeBuilding.visibility = 0;
            })
          }
        }
        selectedBuilding = meshPrefix
      }
    }
  }

  scene.onPointerPick = function(evt) {
    const picked = buildingStrokes[selectedBuilding];
    if (picked && picked.page) {
      router.push(picked.page)
    }
  }
}

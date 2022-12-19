import { Scene, SceneLoader, ActionManager, ExecuteCodeAction, Vector3, TransformNode, AnimationGroup, Animation, Mesh, ArcRotateCamera } from "@babylonjs/core"

export const Platforms = async (scene: Scene, camera: ArcRotateCamera, handleMint: () => Promise<void>, canvas: HTMLCanvasElement): Promise<() => void> => {
  let activePlatform: number = 1;
  const direction = [
    {forward: 3, backward: 2},
    {forward: 1, backward: 3},
    {forward: 2, backward: 1}
  ];
  const models = await SceneLoader.ImportMeshAsync(
    "",
    "/glb/",
    "BTLMN_LemonPlatforms.glb",
    scene
  );
  let originalRotationAngle = 0;


  const Camera = scene.getCameraByName('Camera')
  scene.activeCamera = Camera

  const operator = scene.getMeshByName('operator')
  if (operator) operator.visibility = 0
  const target = scene.getMeshByName('target')
  if (target) target.visibility = 0
  const showPos_feature = scene.getMeshByName('showPos_feature')
  if (showPos_feature) showPos_feature.visibility = 0
  const showPos_outfit = scene.getMeshByName('showPos_outfit')
  if (showPos_outfit) showPos_outfit.visibility = 0
  // if (operator && target) {
  //   //camera.parent = operator;
  //   camera.position = new Vector3(0, -327, 12458);
  //   camera.target = new Vector3(0, 0, 0);
  // }

  const platforms = models.meshes[0]
  platforms.position.y = -100;

  const lookatObjects: string[] = ["LemonPos_1", "LemonPos_2", "LemonPos_3"];

  lookatObjects.forEach((name, index) => {
    const object = scene.getNodeByName(name) as TransformNode 
    object.rotate(new Vector3(0,1,0), Math.PI) // This is becouse new lemon rotated by default  
    const plus = scene.getMeshByName(`Plus_${index + 1}`)
    const plusStroke = scene.getMeshByName(`Plus_${index + 1}_Stroke`)
    if (plus) {
      plus.rotation = object.rotation;
    }
    if (plusStroke) {
      plusStroke.rotation = object.rotation;
      plusStroke.visibility = 0;
    }
    object.rotate(new Vector3(0,1,0), (Math.PI + Math.PI/3)*index)
  });

  const objects: string[] = ["Plus_Back", "Plus_Cap", "Plus_Cloth", "Plus_Face", "Plus_Back_Stroke", "Plus_Cap_Stroke", "Plus_Cloth_Stroke", "Plus_Face_Stroke", "Line_Back_1", "Line_Back_2", "Line_Cap_1", "Line_Cap_2", "Line_Cloth_1", "Line_Cloth_2", "Line_Face_1", "Line_Face_2", "Point_Back", "Point_Cap", "Point_Cloth", "Point_Face", "Background_Sphere"];

  const unusedObjects: string[] = ["Point_Weapon", "Plus_Weapon", "Plus_Weapon_Stroke", "Line_Weapon_1", "Line_Weapon_2"];

  [...objects, ...unusedObjects].forEach(name => {
    const object = scene.getMeshByName(name);
    if (!object) return;
    object.visibility = 0;
    object.checkCollisions = false;
    object.isPickable = false;
  });



  ["collider1", "collider2", "collider3"].forEach((name, index) => {
    const collider = scene.getMeshByName(name);
    if (!collider) return;
    collider.actionManager = new ActionManager(scene);
    collider.visibility = 0;

    let stroke = scene.getMeshByName(`Plus_${index + 1}_Stroke`)	
    collider.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, async function(){
      if (stroke) stroke.visibility = 1;
      scene.hoverCursor = "pointer";
    }));
    collider.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, async function(){
      if (stroke) stroke.visibility = 0;
      scene.hoverCursor = "default";
    }));
    
    collider.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, async function(){
      let rotationAngle = 0;
      let platformAnimation: AnimationGroup | null = null;

      stroke = scene.getMeshByName(`Plus_${index + 1}_Stroke`) // refresh stroke
      if (stroke) {
        await handleMint();
        return;
      }

      if (activePlatform == direction[index].forward) {
        platformAnimation = scene.getAnimationGroupByName('Forward' + direction[index].forward) as AnimationGroup
        rotationAngle = 2*Math.PI/3
      } else
      if (activePlatform == direction[index].backward) {
        platformAnimation = scene.getAnimationGroupByName('Backward' + direction[index].backward) as AnimationGroup
        rotationAngle = -2*Math.PI/3
      }

      if (platformAnimation) {
        platformAnimation.start(false, 1);
      }

      lookatObjects.forEach((name, index) => {
        const lemon = scene.getNodeByName(name) as TransformNode;
        if (activePlatform == index + 1) {
          lemon.rotate(new Vector3(0,1,0), originalRotationAngle)
          originalRotationAngle = 0;
        }
        Animation.CreateAndStartAnimation(`Lemon_rotation`, lemon, "rotation.y", 60, 25, lemon.rotation.y, lemon.rotation.y + rotationAngle, 0)
      })

      activePlatform = index + 1
    }));
    
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
    const activeLemon = scene.getNodeByName(`LemonPos_${activePlatform}`) as TransformNode
    const dx = evt.clientX - currentPosition.x;
    const angleY = dx * 0.01;
    activeLemon.rotate(new Vector3(0,1,0), angleY);
    originalRotationAngle -= angleY;
    currentPosition.x = evt.clientX;
  }
  
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointermove", pointerMove);

  return () => {
    canvas.removeEventListener("pointerdown", pointerDown, false);
    canvas.removeEventListener("pointerup", pointerUp, false);
    canvas.removeEventListener("pointermove", pointerMove, false);
  }
}
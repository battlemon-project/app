import { Scene, SceneLoader, ActionManager, ExecuteCodeAction, Vector3, TransformNode, AnimationGroup, Animation, Mesh } from "@babylonjs/core"

export const LoadPlatforms = async (scene: Scene, canvas: HTMLCanvasElement): Promise<void> => {
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

  const platforms = models.meshes[0]
  platforms.position.y = -100

  const lookatObjects: string[] = ["LemonPos_1", "LemonPos_2", "LemonPos_3"];

  lookatObjects.forEach((name, index) => {
    const object = scene.getNodeByName(name) as TransformNode    
    if (!object) return;
    const Plus = scene.getMeshByName(`Plus_${index + 1}`)
    const Plus_Stroke = scene.getMeshByName(`Plus_${index + 1}_Stroke`)
    if (Plus) Plus.rotation = object.rotation;
    if (Plus_Stroke) Plus_Stroke.rotation = object.rotation;
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
    collider.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function(){	
      scene.hoverCursor = "pointer";
    }));
    collider.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, function(){
      scene.hoverCursor = "default";
    }));
    
    collider.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, function(){
      let rotationAngle = 0;
      let platformAnimation: AnimationGroup | null = null;

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
  console.log(scene)
  canvas.addEventListener("pointerdown", function (evt: MouseEvent) {
    currentPosition.x = evt.clientX;
    clicked = true;
  });
  
  canvas.addEventListener("pointermove", function (evt: MouseEvent) {
    if (!clicked) {
      return;
    }
    const activeLemon = scene.getNodeByName(`LemonPos_${activePlatform}`) as TransformNode
    const dx = evt.clientX - currentPosition.x;
    const angleY = dx * 0.01;
    activeLemon.rotate(new Vector3(0,1,0), angleY);
    originalRotationAngle -= angleY;
    currentPosition.x = evt.clientX;
  });
  
  canvas.addEventListener("pointerup", function () {
    clicked = false;
  });

}


import { Scene, SceneLoader } from "@babylonjs/core"

export const Home = async (scene: Scene): Promise<void> => {
  await SceneLoader.ImportMeshAsync(
    "",
    "/glb/",
    "MainMenu_Stripes_Export_lemonprise.glb",
    scene
  );
}

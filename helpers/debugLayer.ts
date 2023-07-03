import { Scene } from '@babylonjs/core';
import '@babylonjs/core/Debug/debugLayer';

const runDebugger = async (scene: Scene) => {
  await import('@babylonjs/inspector');
  scene.debugLayer.show();
};

export default runDebugger;

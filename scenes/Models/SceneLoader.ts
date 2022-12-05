import { ILoadingScreen } from "@babylonjs/core"
import type { SetterOrUpdater } from 'recoil';

export default class CustomLoadingScreen implements ILoadingScreen {
  //optional, but needed due to interface definitions
  public loadingUIBackgroundColor: string
  
  constructor(public loadingUIText: string, public setLoader: SetterOrUpdater<boolean[]>) {
    this.loadingUIBackgroundColor = '#000'
    this.setLoader = setLoader;
  }

  public displayLoadingUI() {
    this.setLoader((loader) => {
      return [loader[0], true];
    });
  }

  public hideLoadingUI() {
    this.setLoader((loader) => {
      return [loader[0], false];
    });
  }
}
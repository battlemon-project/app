import { ILoadingScreen } from "@babylonjs/core"

export default class CustomLoadingScreen implements ILoadingScreen {
  //optional, but needed due to interface definitions
  public loadingUIBackgroundColor: string

  constructor(public loadingUIText: string) {
    this.loadingUIBackgroundColor = '#000'
  }

  public displayLoadingUI() {
    const loader = document.getElementById('sceneLoaderElement')
    if (loader) {
      loader.classList.add('d-block');
    }
  }

  public hideLoadingUI() {
    const loader = document.getElementById('sceneLoaderElement')
    if (loader) {
      loader.classList.add('d-none');
    }
  }
}
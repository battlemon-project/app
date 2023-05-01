import React, { useRef, useEffect, useState } from "react";
import { Engine, Scene, ArcRotateCamera, Vector3, CubeTexture, Color4 } from '@babylonjs/core';
import "@babylonjs/loaders";
import { LemonGenerator } from './Models/LemonGenerator'
import { useLemonStore } from "../helpers/lemonStore";
import { allProperties, allItems, dummyLemon } from "../helpers/dummyLemon";
import { LemonOwnedNft } from "../helpers/alchemy";

type updateLemonType = (lemon: LemonOwnedNft) => Promise<void>
let updateSomeLemon: updateLemonType = async () => {};

export default function LemonSandboxScene() {
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const [ background, setBackground ] = useState<string>("");
  const [ visibleInterface, setVisibleInterface ] = useState<boolean>(true);
  const { lemons } = useLemonStore()

  const changeItem = (type: string, name: string) => {
    lemons.ownedNfts[0].rawMetadata.items.forEach((item, index) => {
      if (item.type == type) {
        item.name = name
      }
    })
    
    useLemonStore.setState({ lemons: lemons })
    updateSomeLemon?.(lemons.ownedNfts[0])
  }

  
  const changeProperty = (type: string, name: string) => {
    lemons.ownedNfts[0].rawMetadata.properties.forEach((property, index) => {
      if (property.type == type) {
        property.name = name
      }
    })
    
    useLemonStore.setState({ lemons: lemons })
    updateSomeLemon?.(lemons.ownedNfts[0])
  }

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true);

    // Add your code here matching the playground format
    const createScene = function () {
      const scene = new Scene(engine);
      
      const camera = new ArcRotateCamera(
        "camera",
        Math.PI / 0.292,
        Math.PI / 1.9,
        500,
        new Vector3(0,122,0),
        scene
      )    

      camera.lowerRadiusLimit = 50;
      camera.upperRadiusLimit = 500;
      camera.attachControl(canvasRef.current, true);
      
      var hdrTexture = CubeTexture.CreateFromPrefilteredData(`${process.env.NEXT_PUBLIC_STATIC}/glb/environmentSpecular.env`, scene);
      scene.environmentTexture = hdrTexture;
      scene.environmentTexture.level = 1;
      scene.clearColor = new Color4(0,0,0,0.0000000000000001);

      LemonGenerator(scene).then(result => {
        updateSomeLemon = async (lemon: LemonOwnedNft) => {
          await result.change(lemon)
          console.log('changed');
          scene.render();
          return;
        }
        scene.render();
      })

      return scene;
    };
    
    const scene = createScene();

    engine.runRenderLoop(function () {
      scene.render();
    });
    
    window.addEventListener("resize", function () {
      engine.resize();
    });
    
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="vh-100 w-100 position-absolute top-0" id="renderCanvas" style={{background: background && background.indexOf('http') > -1 ? `url(${background})` : background, backgroundSize: 'cover', backgroundPosition: 'center center'}} />
      <div className="position-absolute col-2 ps-3" style={{ display: visibleInterface ? 'block' : 'none'}}>
        {lemons.ownedNfts[0].rawMetadata.properties.map((prop, i) =>
          <div key={i} className="pt-1"> 
            <b className="small px-1" style={{background: '#fff', borderRadius: '3px'}}>{prop.name}</b>
            <br />
            <select className="form-select form-select-sm" value={prop.name || undefined}  onChange={(e) => changeProperty(prop.type, e.target.value)}>
              <option value={undefined}>none</option>
              {allProperties.filter(ap => ap.type == prop.type).map((ap, indx) =>
                <React.Fragment key={indx}>{ ap.name && <option key={indx} value={ap.name}>{ap.name}</option> }</React.Fragment>
              )}
            </select>
          </div>
        )}
      </div>

      <div className="position-absolute col-2 pe-3" style={{ right: '0', display: visibleInterface ? 'block' : 'none'}}>
        {lemons.ownedNfts[0].rawMetadata.items.map((prop, i) =>
          <div key={i} className="pt-1"> 
            <b className="small px-1" style={{background: '#fff', borderRadius: '3px'}}>{prop.type}</b>
            <br />
            <select className="form-select form-select-sm" value={prop.name || undefined}  onChange={(e) => changeItem(prop.type, e.target.value)}>
              <option value={undefined}>none</option>
              {allItems.filter(ap => ap.type == prop.type).map((ap, indx) =>
                <React.Fragment key={indx}>{ ap.name && <option key={indx} value={ap.name}>{ap.name}</option> }</React.Fragment>
              )}
            </select>
          </div>
        )}
        <br />
        <b className="small px-1" style={{background: '#fff', borderRadius: '3px'}}>Background</b>
        <input className="form-control form-control-sm" value={background} onChange={(e) => setBackground(e.target.value)} />
      </div>

      <div style={{position: 'absolute', right: 0, bottom: 0, width: '80px', height: '80px', opacity: visibleInterface ? '1' : '0' }} onClick={() => setVisibleInterface(!visibleInterface)}></div>
    </>
  )
}

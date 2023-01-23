import { outfits, OutfitType } from "../helpers/dummyLemon";
import { useState } from "react";
import { lemonStore } from "../helpers/lemonStore";
import { StringifyOptions } from "querystring";

function Inventory() {
  const { inventoryIsOpened, lemons, activePlatform } = lemonStore.getState();
  const allOutfits = Object.values(outfits).flat();
  const [ outfitList, setOutfitList ] = useState<OutfitType[]>(allOutfits)
  const [ description, setDescription ] = useState<boolean>(true)

  const filterOutifts = (type?: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (type) {
      setOutfitList(outfits[type])
      setDescription(false)
    } else {
      setOutfitList(allOutfits)
      setDescription(false)
    }
  }

  const wearOutfit = (outfit: OutfitType) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    lemonStore.setState((state) => ({ ...state, changeOutfit: outfit }))
  }

  lemonStore.subscribe((state, prevState) => {
    if (state.inventoryIsOpened != prevState.inventoryIsOpened) {
      setDescription(true)
    }
  })

  return (
    <div className={`inventory-container d-flex ${inventoryIsOpened ? 'opened' : ''}`}>
      <div className={`inventory justify-content-center align-self-center w-100`}>
        <div className="d-flex mb-2 action-buttons">
          <a href='https://play.battlemon.com' className="col col-auto d-flex">
            <span className='justify-content-center align-self-center text-center w-100' style={{color: '#000'}}>PLAY</span>
          </a>
          <a href={'#'} className="col col-auto d-flex">
            <span className='justify-content-center align-self-center text-center w-100' style={{color: '#000'}}>RENT</span>
          </a>
          <a href={'#'} className="col col-auto d-flex">
            <span className='justify-content-center align-self-center text-center w-100' style={{color: '#000'}}>SELL</span>
          </a>
        </div>

        <div className="inventory-center">
          {description ? <>
            <div className="px-4 pb-2 pt-3">
              <h4>Brand New Lemon</h4>
              <h5>Characters:</h5>
              {lemons[activePlatform - 1].fields.traits.map(( trait: { fields: { flavour: string, name: string }}) => {
                return <div>
                  <strong className='text-uppercase'>{trait.fields.name}</strong>:&nbsp;
                  {trait.fields.flavour.slice(0, -5).split('_').join(' ')}
                </div>
              })}
            </div>
          </> : <>
            <div className="row">
              {outfitList.map(outfit => 
                <a className="col col-3 border px-1 px-1" key={outfit.name} href={'#'} onClick={wearOutfit(outfit)}>
                  <img src={`/assets/128/${outfit.name}_128.png`} className="img-fluid" />
                </a>
              )}
            </div>
          </>}
        </div>
        <div className="d-flex mt-2">
        
          <a className="col col-auto position-relative" href={'#'} onClick={filterOutifts()}>
            <b className="position-absolute" style={{color: '#4a5480', padding: '19px 15px 0 16px', fontSize: '17px'}}>ALL</b>
            <img src="/assets/tiny/icon_hand_empty.png" />
          </a>
          <a className="col col-auto" href={'#'} onClick={filterOutifts('cap')}>
            <img src="/assets/tiny/icon_cap_64.png" />
          </a>
          <a className="col col-auto" href={'#'} onClick={filterOutifts('cloth')}>
            <img src="/assets/tiny/icon_cloth_64.png" />
          </a>
          <a className="col col-auto" href={'#'} onClick={filterOutifts('face')}>
            <img src="/assets/tiny/icon_face_64.png" />
          </a>
          <a className="col col-auto" href={'#'} onClick={filterOutifts('shoes')}>
            <img src="/assets/tiny/icon_foot_64.png" />
          </a>
          <a className="col col-auto" href={'#'} onClick={filterOutifts('back')}>
            <img src="/assets/tiny/icon_back_128.png" />
          </a>
          <a className="col col-auto" href={'#'} onClick={() => {}}>
            <img src="/assets/tiny/icon_hand_l_64.png" />
          </a>
          <a className="col col-auto" href={'#'} onClick={filterOutifts('weapon')}>
            <img src="/assets/tiny/icon_hand_r_64.png" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
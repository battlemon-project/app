import { outfits, OutfitType } from "../helpers/dummyLemon";
import { useEffect, useState } from "react";

function Inventory() {  
  const [opened, setOpened] = useState(false)
  const [outfitList, setOutfitList] = useState<OutfitType[]>(Object.values(outfits).flat())

  const filterOutifts = (type: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setOutfitList(outfits[type])
  }

  const wearOutfit = (outfit: OutfitType) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    //setOutfitList(outfits[outfit as OutfitType])
  }

  useEffect(() => {
    setOpened(true)
  }, [])

  return (
    <div className='inventory-container d-flex'>
      <div className={`inventory justify-content-center align-self-center w-100 ${opened ? 'opened' : ''}`}>
        <div className="d-flex mb-2 action-buttons">
          <a href={'#'} className="col col-auto d-flex active">
            <span className='justify-content-center align-self-center text-center w-100' style={{color: '#000'}}>INVENTORY</span>
          </a>
          <a href={'#'} className="col col-auto d-flex">
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
          <div className="row">
            {outfitList.map(outfit => 
              <a className="col col-3 border px-1 px-1" key={outfit.name} href={'#'} onClick={wearOutfit(outfit)}>
                <img src={`/assets/128/${outfit.name}_128.png`} className="img-fluid" />
              </a>
            )}
          </div>
        </div>
        <div className="d-flex mt-2">
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
        </div>
      </div>
    </div>
  );
}

export default Inventory;
import { outfits } from "../helpers/dummyLemon";
import { useEffect, useState } from "react";

function Inventory() {  
  const [opened, setOpened] = useState(false)
  const [outfitList, setOutfitList] = useState<string[]>(Object.values(outfits).flat())

  const filterOutifts = (type: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setOutfitList(outfits[type])
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
              <div className="col col-3 border px-1 px-1">
                <img src={`/assets/128/${outfit}_128.png`} className="img-fluid" />
              </div>
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
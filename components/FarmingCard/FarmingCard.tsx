import React from 'react';
import Image, {StaticImageData} from "next/image";
import styles from './FarmingCard.module.css'

export type FarmingCardType = {
    title: string;
    gemURL: StaticImageData;
    pickURL?: StaticImageData;
}
type FarmingCardProps = FarmingCardType

function FarmingCard({title, gemURL, pickURL}: FarmingCardProps)  {
    return (
      <div className="d-flex flex-column p-4 text-center text-white gap-1 border border-white rounded-4">
          <div className="fs-3 fw-bold mb-2">Farming</div>
          <div>Stake</div>
          <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
              {
                  pickURL ? (
                    <>
                      <Image src={pickURL} width={70} height={85} alt="Pick"/>
                      <div className="fs-4 fw-semibold">+</div>
                    </>
                  ) : null
              }

            <Image src={gemURL} width={70} height={85} alt="Gem"/>
          </div>
          <div className="fw-semibold fs-5">{title}</div>
          <button
              className={
                  "border border-white bg-transparent p-2 rounded-2 text-white" + " " + styles.button
              }
          >Proceed</button>
      </div>
    );
}

export default FarmingCard;
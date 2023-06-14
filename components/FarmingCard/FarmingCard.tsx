import React from 'react';
import Image, { type StaticImageData } from 'next/image';

export interface FarmingCardType {
  title: string;
  gemURL: StaticImageData;
  pickURL?: StaticImageData;
}

type FarmingCardProps = FarmingCardType;

export const FarmingCard: React.FC<FarmingCardProps> = ({
  pickURL,
  gemURL,
  title,
}) => {
  return (
    <div className="flex flex-col p-6 text-center text-white gap-1 border border-white rounded-2xl">
      <div className="text-3xl font-bold mb-2">Farming</div>
      <div>Stake</div>
      <div className="flex justify-center items-center gap-3 mb-3">
        {pickURL ? (
          <>
            <Image src={pickURL} width={70} height={85} alt="Pick" />
            <div className="text-4xl font-semibold">+</div>
          </>
        ) : null}

        <Image src={gemURL} width={70} height={85} alt="Gem" />
      </div>
      <div className="font-semibold text-xl mb-2">{title}</div>
      <button className="border border-white bg-transparent p-2 rounded-lg text-white hover:bg-white hover:text-black">
        Soon
      </button>
    </div>
  );
};

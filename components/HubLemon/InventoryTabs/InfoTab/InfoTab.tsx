import React from 'react';
import { type ItemType } from '../../../../helpers/lemonStore';

interface InfoTabProps {
  items: ItemType[];
}
export const InfoTab: React.FC<InfoTabProps> = ({ items }) => {
  return (
    <div className="relative px-10 py-8 text-white">
      <div className="relative z-10">
        <div className="text-2xl font-bold italic mb-5">Brand New Lemon</div>
        <div
          className="h-0.5 mb-5"
          style={{
            background: 'linear-gradient(to right, #348095, #11A6C5)',
          }}
        ></div>
        {items.map((property) => {
          if (!property?.name) return null;
          return (
            <div key={property.type}>
              <span className="uppercase font-bold">{property.type}</span>
              :&nbsp;
              <span className="italic">
                {property.name.split('_').join(' ')}
              </span>
            </div>
          );
        })}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1/3 blur-[120px] bg-blue w-96 h-96"></div>
    </div>
  );
};

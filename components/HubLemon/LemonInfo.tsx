import React from 'react';
import { useLemonStore } from '../../helpers/lemonStore';
import { shallow } from 'zustand/shallow';

export const LemonInfo: React.FC = () => {
  const { lemons, activePlatform } = useLemonStore(
    ({ lemons, activePlatform }) => ({
      lemons,
      activePlatform,
    }),
    shallow
  );

  return (
    <>
      <div className="flex bg-white bg-opacity-50 min-h-50 h-90 overflow-y-auto rounded-md">
        <div className="px-6 pb-2 pt-4">
          <h4 className="text-2xl font-medium mb-2">Brand New Lemon</h4>
          <h5 className="text-xl font-medium mb-2">Characters:</h5>
          {lemons?.ownedNfts[activePlatform - 1].rawMetadata?.properties.map(
            (property) => {
              if (!property?.name) return null;
              return (
                <div key={property.type}>
                  <strong className="uppercase">{property.type}</strong>
                  :&nbsp;
                  {property.name.split('_').join(' ')}
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

import React from 'react';
import { useLemonStore } from '../../helpers/lemonStore';
import { shallow } from 'zustand/shallow';

export default function LemonInfo() {
  const { lemons, activePlatform } = useLemonStore(
    ({ lemons, activePlatform }) => ({
      lemons,
      activePlatform,
    }),
    shallow
  );

  return (
    <>
      <div className="inventory-scroll d-flex">
        <div className="px-4 pb-2 pt-3">
          <h4>Brand New Lemon</h4>
          <h5>Characters:</h5>
          {lemons?.ownedNfts[activePlatform - 1].rawMetadata?.properties.map(
            (property) => {
              if (!property?.name) return null;
              return (
                <div key={property.type}>
                  <strong className="text-uppercase">{property.type}</strong>
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
}

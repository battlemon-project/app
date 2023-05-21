import React, { useEffect, useState } from 'react';
import { useLemonStore } from '../../helpers/lemonStore';
import { shallow } from 'zustand/shallow';
import LemonInfo from './LemonInfo';
import LemonItems from './LemonItems';

function Inventory() {
  const { inventoryIsOpened, lemons, activePlatform } = useLemonStore(
    ({ inventoryIsOpened, lemons, activePlatform }) => ({
      inventoryIsOpened,
      lemons,
      activePlatform,
    }),
    shallow
  );
  const [currentTab, setCurrentTab] = useState<string>('info');

  const changeTab = (tab: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setCurrentTab(tab);
  };

  useEffect(() => {
    const unsubscribe = useLemonStore.subscribe((state, prevState) => {
      if (state.inventoryIsOpened != prevState.inventoryIsOpened) {
        setCurrentTab('info');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!lemons?.ownedNfts?.length) {
    return <></>;
  }

  return (
    <div
      className={`inventory-container d-flex ${
        inventoryIsOpened ? 'opened' : ''
      }`}
    >
      <div
        className={`inventory justify-content-center align-self-center w-100`}
      >
        <div className="d-flex mb-2 action-buttons">
          <a
            href={`#`}
            className={`col col-auto d-flex ${
              currentTab == 'info' && 'active'
            }`}
            onClick={changeTab('info')}
          >
            <span
              className="justify-content-center align-self-center text-center w-100"
              style={{ color: '#000' }}
            >
              INFO
            </span>
          </a>
          <a
            href={`#`}
            className={`col col-auto d-flex ${
              currentTab == 'items' && 'active'
            }`}
            onClick={changeTab('items')}
          >
            <span
              className="justify-content-center align-self-center text-center w-100"
              style={{ color: '#000' }}
            >
              ITEMS
            </span>
          </a>
          <a
            href={`/game/home?playerId=${JSON.stringify(
              lemons?.ownedNfts[activePlatform - 1]
            )}`}
            rel="noreferrer"
            target="_blank"
            className="col col-auto d-flex"
          >
            <span
              className="justify-content-center align-self-center text-center w-100"
              style={{ color: '#000' }}
            >
              PLAY
            </span>
          </a>
          <a
            href={'#'}
            className={`col col-auto d-flex ${
              currentTab == 'rent' && 'active'
            }`}
            onClick={changeTab('rent')}
          >
            <span
              className="justify-content-center align-self-center text-center w-100"
              style={{ color: '#000' }}
            >
              RENT
            </span>
          </a>
          <a
            href={`#`}
            className={`col col-auto d-flex ${
              currentTab == 'sell' && 'active'
            }`}
            onClick={changeTab('sell')}
          >
            <span
              className="justify-content-center align-self-center text-center w-100"
              style={{ color: '#000' }}
            >
              SELL
            </span>
          </a>
          <a
            href={`#`}
            className={`col col-auto d-flex ${
              currentTab == 'change' && 'active'
            }`}
            onClick={changeTab('change')}
          >
            <span
              className="justify-content-center align-self-center text-center w-100"
              style={{ color: '#000' }}
            >
              CHANGE
            </span>
          </a>
          <a
            href={`#`}
            className={`col col-auto d-flex ${
              currentTab == 'send' && 'active'
            }`}
            onClick={changeTab('send')}
          >
            <span
              className="justify-content-center align-self-center text-center w-100"
              style={{ color: '#000' }}
            >
              SEND
            </span>
          </a>
        </div>

        <div className="inventory-center">
          {(() => {
            switch (currentTab) {
              case 'info':
                return <LemonInfo />;
              case 'items':
                return <LemonItems />;
              default:
                null;
            }
          })()}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
